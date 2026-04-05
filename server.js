require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const dns = require("dns").promises;
const { parse: parseHtml } = require("node-html-parser");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// ── Claude Code CLI 経由で生成（stdinにプロンプトを流す） ────
function claudeGenerate(prompt, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    // -p "-" でstdinからプロンプトを読む
    // ANTHROPIC_API_KEY を除外（Claude Code の認証を使わせる）
    const env = { ...process.env };
    delete env.ANTHROPIC_API_KEY;
    const proc = spawn("claude", ["-p", "-"], {
      stdio: ["pipe", "pipe", "pipe"],
      env,
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", d => stdout += d.toString());
    proc.stderr.on("data", d => stderr += d.toString());

    // プロンプトをstdinに書いて閉じる
    proc.stdin.write(prompt, "utf8");
    proc.stdin.end();

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error("生成タイムアウト（2分）"));
    }, timeoutMs);

    proc.on("close", code => {
      clearTimeout(timer);
      if (code !== 0) {
        console.error("[claudeGenerate] exit:", code, "stderr:", stderr.slice(0, 300));
        return reject(new Error(stderr || `終了コード: ${code}`));
      }
      resolve(stdout);
    });
  });
}


// ── パターンライブラリ読み込み ────────────────────────────────
const PATTERN_DIR = path.join(__dirname, "pattern-library");
const PATTERNS = {};
for (const file of fs.readdirSync(PATTERN_DIR)) {
  if (!file.endsWith(".json")) continue;
  const data = JSON.parse(fs.readFileSync(path.join(PATTERN_DIR, file), "utf8"));
  if (!data.goal || !data.phases) continue; // レイアウト定義など非パターンファイルをスキップ
  PATTERNS[data.goal] = data;
}
console.log("パターンライブラリ読み込み完了:", Object.keys(PATTERNS));

// ── フェーズ配分ロジック ──────────────────────────────────────
function allocatePhases(referenceGoal, totalDays) {
  // 参照パターンからフェーズ順序と比率を取得
  const ref = PATTERNS[referenceGoal];
  if (!ref) return null;

  const phases = ref.phases;
  const totalPatterns = phases.reduce((s, p) => s + p.patterns.length, 0);

  let allocated = [];
  let remaining = totalDays;

  phases.forEach((phase, i) => {
    const ratio = phase.patterns.length / totalPatterns;
    const isLast = i === phases.length - 1;
    const days = isLast ? remaining : Math.max(1, Math.round(totalDays * ratio));
    allocated.push({ ...phase, allocated_days: days });
    remaining -= isLast ? remaining : days;
  });

  return allocated;
}

// ── 最も近い参照パターンを選択 ────────────────────────────────
function selectReferencePattern(goal) {
  const goalMap = {
    講座販売: "勉強会告知A",
    セミナー告知: "勉強会告知A",
    勉強会告知: "勉強会告知A",
    個別相談: "勉強会告知C",
    物販: "物販",
    EC販売: "物販",
    コンテンツ販売: "勉強会告知B",
    ファン化: "勉強会告知B",
    "DM・LINE獲得": "勉強会告知D",
  };
  // 完全一致
  if (goalMap[goal]) return goalMap[goal];
  // 部分一致
  for (const [key, val] of Object.entries(goalMap)) {
    if (goal.includes(key) || key.includes(goal)) return val;
  }
  // デフォルト
  return "勉強会告知A";
}

// ── SSRF対策：プライベートIP判定 ─────────────────────────────
function isPrivateIp(ip) {
  const privateRanges = [
    /^127\./,                          // loopback
    /^10\./,                           // private A
    /^172\.(1[6-9]|2\d|3[01])\./,     // private B
    /^192\.168\./,                     // private C
    /^169\.254\./,                     // link-local
    /^::1$/,                           // IPv6 loopback
    /^fc00:/i,                         // IPv6 unique local
    /^fe80:/i,                         // IPv6 link-local
    /^0\.0\.0\.0$/,
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,  // CGNAT
  ];
  return privateRanges.some(re => re.test(ip));
}

async function validateUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("URLの形式が正しくありません");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("http / https のURLのみ対応しています");
  }
  // DNS解決してIPを確認（SSRF対策）
  let addresses;
  try {
    addresses = await dns.lookup(parsed.hostname, { all: true });
  } catch {
    throw new Error("URLのホスト名を解決できませんでした");
  }
  for (const { address } of addresses) {
    if (isPrivateIp(address)) {
      throw new Error("内部ネットワークへのアクセスは許可されていません");
    }
  }
  return parsed;
}

// ── テキスト抽出ヘルパー ──────────────────────────────────────
function extractTextFromHtml(html) {
  const root = parseHtml(html);
  // script / style / noscript / iframe を除去
  ["script", "style", "noscript", "iframe", "nav", "footer", "header"].forEach(tag => {
    root.querySelectorAll(tag).forEach(el => el.remove());
  });
  // テキストを取得・整形
  const text = root.text
    .replace(/<!DOCTYPE[^>]*>/gi, "")   // DOCTYPE宣言を除去
    .replace(/\s{3,}/g, "\n\n")         // 連続する空白を段落区切りに
    .replace(/\n{4,}/g, "\n\n\n")       // 過剰な改行を圧縮
    .trim();
  return text;
}

// ── Node.js http/https モジュールでURL取得 ───────────────────
function fetchUrl(parsedUrl, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const lib = parsedUrl.protocol === "https:" ? https : http;
    const MAX_BYTES = 500_000;
    const chunks = [];
    let totalBytes = 0;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
      path: parsedUrl.pathname + (parsedUrl.search || ""),
      method: "GET",
      headers: {
        "User-Agent": "StoriesAI/1.0 (content-analysis-bot)",
        "Accept": "text/html,application/xhtml+xml",
      },
      rejectUnauthorized: false, // 開発環境の証明書問題を回避
    };

    const req = lib.request(options, (response) => {
      // リダイレクト処理（最大3回）
      if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
        try {
          const redirectUrl = new URL(response.headers.location, parsedUrl.href);
          resolve({ redirect: redirectUrl.href });
        } catch {
          reject(new Error("リダイレクト先URLが不正です"));
        }
        return;
      }

      const statusCode = response.statusCode;
      const contentType = response.headers["content-type"] || "";

      response.on("data", (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes <= MAX_BYTES) chunks.push(chunk);
      });

      response.on("end", () => {
        resolve({
          statusCode,
          contentType,
          body: Buffer.concat(chunks).toString("utf-8"),
          truncated: totalBytes > MAX_BYTES,
        });
      });

      response.on("error", reject);
    });

    req.on("error", reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("TIMEOUT"));
    });

    req.end();
  });
}

// ── URL読み込みエンドポイント ─────────────────────────────────
app.post("/fetch-insight", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url は必須です" });

  // バリデーション（SSRF対策含む）
  let parsed;
  try {
    parsed = await validateUrl(url);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  // フェッチ（リダイレクト最大3回）
  let result;
  let currentUrl = parsed;
  for (let i = 0; i < 3; i++) {
    try {
      result = await fetchUrl(currentUrl);
    } catch (err) {
      if (err.message === "TIMEOUT") {
        return res.status(408).json({ error: "読み込みがタイムアウトしました（5秒）" });
      }
      return res.status(502).json({ error: `URLへのアクセスに失敗しました: ${err.message}` });
    }

    if (result.redirect) {
      try {
        currentUrl = await validateUrl(result.redirect);
      } catch (err) {
        return res.status(400).json({ error: `リダイレクト先: ${err.message}` });
      }
      continue;
    }
    break;
  }

  if (!result || result.redirect) {
    return res.status(502).json({ error: "リダイレクトが多すぎます" });
  }

  if (result.statusCode < 200 || result.statusCode >= 300) {
    return res.status(502).json({ error: `取得失敗: HTTP ${result.statusCode}` });
  }

  if (!result.contentType.includes("text/html") && !result.contentType.includes("text/plain")) {
    return res.status(400).json({ error: "HTML / テキスト形式のURLのみ対応しています" });
  }

  // テキスト抽出
  const text = extractTextFromHtml(result.body);

  // 上限10,000文字
  const MAX_CHARS = 10_000;
  const trimmed = text.length > MAX_CHARS
    ? text.slice(0, MAX_CHARS) + "\n\n…（文字数上限により一部省略）"
    : text;

  res.json({
    success: true,
    url: currentUrl.href,
    text: trimmed,
    chars: trimmed.length,
    truncated: text.length > MAX_CHARS,
  });
});

// ── ストーリーズ生成エンドポイント ───────────────────────────
app.post("/generate", async (req, res) => {
  const { goal, genre, pain_points, desired_future, days = 30, tension = "カジュアル" } = req.body;

  if (!goal || !genre || !pain_points) {
    return res.status(400).json({ error: "goal, genre, pain_pointsは必須です" });
  }

  const refKey = selectReferencePattern(goal);
  const phaseAllocation = allocatePhases(refKey, days);

  if (!phaseAllocation) {
    return res.status(400).json({ error: "参照パターンが見つかりません" });
  }

  // 参照パターンのサマリーを構築
  const patternSummary = phaseAllocation
    .map((phase) => {
      const samplePatterns = phase.patterns.slice(0, 3);
      const axes = [...new Set(samplePatterns.map((p) => p.appeal_axis).filter(Boolean))];
      const tensions = [...new Set(samplePatterns.map((p) => p.tension).filter(Boolean))];
      const angles = [...new Set(samplePatterns.map((p) => p.presentation_angle).filter(Boolean))];
      return `【${phase.phase_name}フェーズ】${phase.allocated_days}日間
  訴求軸: ${axes.join(" / ")}
  テンション: ${tensions.join(" / ")}
  切り口例: ${angles.slice(0, 2).join(" / ")}`;
    })
    .join("\n\n");

  // Day別のフェーズ割り当てを生成
  const dayPhaseMap = [];
  let day = 1;
  for (const phase of phaseAllocation) {
    for (let d = 0; d < phase.allocated_days; d++) {
      dayPhaseMap.push({ day, phase_name: phase.phase_name, phase_num: phase.phase_num });
      day++;
    }
  }

  const systemPrompt = `あなたはInstagramストーリーズ専門のコピーライターです。
マーケティングフレームワーク（認知→関係構築→共感教育→告知→行動）に従い、
フォロワーの心理段階を丁寧に育てる連続ストーリーズを生成します。

## 参照パターン（${refKey}）
${patternSummary}

## フェーズ別の絶対ルール

### 認知・関係構築フェーズ（序盤）
- 商品・サービス名・個別相談・講座などの告知ワードを一切出さない
- 発信者の日常・価値観・共感できるエピソードで人柄を見せる
- 「あなたもこういう経験ない？」「こんなこと感じたことある？」という問いかけが中心
- CTAは「アンケートに答えて」「リアクションボタン押して」など超低ハードル
- 絶対にNG: 「個別相談」「申込」「LINE」「DM」「募集」などのワード

### 共感教育フェーズ（中盤）
- 見込み客が抱える問題の「原因の再定義」をする
- 「実はこれが原因だった」「〇〇すれば変わる」という気づきを与える
- においわせ程度に「こんな方法があります」と示唆するが詳細は出さない
- CTAは「続きが気になる人は保存して」「明日も見てね」など

### 告知・行動フェーズ（終盤のみ）
- ここで初めて具体的な商品・サービス・申込みに言及する
- 「実は私、〇〇を提供しています」という自然な流れで
- CTAに「DMで「相談」と送って」など具体的アクションを入れる

## 生成ルール
- 見出し：15文字以内、インパクト重視
- 本文：2〜3文、口語体、改行で読みやすく
- テンション：${tension}スタイルを基本に、フェーズで強弱
- 出力はJSON配列のみ（説明文不要）

## 良い例（認知フェーズ）
見出し：「片付け苦手な私が変わった話」
本文：「正直、昔は家の中カオスでした。ものがどこにあるか分からなくて、毎朝10分は探し物してた。そんな私が変わったきっかけを、ちょっとずつ話しますね。」
CTA：なし

## 悪い例（認知フェーズでNG）
見出し：「個別相談受付中！」← 序盤にこれは絶対NG
本文：「ストーリーズ見てくれてる人いますか？」← 不自然な問いかけNG`;

  const userPrompt = `以下の情報をもとに${days}日分のストーリーズを生成してください。

【商材情報】
- 目標: ${goal}
- ジャンル: ${genre}
- 見込み客の悩み: ${pain_points}
- 叶えたい未来: ${desired_future || "未記入"}

【Day別フェーズ割り当て】
${dayPhaseMap.map((d) => `Day${d.day}: ${d.phase_name}フェーズ`).join("\n")}

出力形式（JSON配列）:
[
  {
    "day": 1,
    "phase": "フェーズ名",
    "headline": "見出し",
    "body": ["本文1行目", "本文2行目"],
    "cta": "CTA文言（告知・購入フェーズのみ）"
  }
]`;

  try {
    const fullPrompt = systemPrompt + "\n\n" + userPrompt;
    const content = await claudeGenerate(fullPrompt);

    // JSON部分を抽出
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "JSON抽出失敗", raw: content });
    }

    const stories = JSON.parse(jsonMatch[0]);
    res.json({
      success: true,
      goal,
      genre,
      days,
      reference_pattern: refKey,
      phase_allocation: phaseAllocation.map((p) => ({
        phase_name: p.phase_name,
        days: p.allocated_days,
      })),
      stories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── ヘルスチェック ────────────────────────────────────────────
app.get("/patterns", (req, res) => {
  res.json({
    available_patterns: Object.keys(PATTERNS),
    total_patterns: Object.values(PATTERNS).reduce(
      (s, p) => s + p.phases.reduce((ss, ph) => ss + ph.patterns.length, 0),
      0
    ),
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Stories AI バックエンド起動: http://localhost:${PORT}`);
  console.log(`パターン確認: http://localhost:${PORT}/patterns`);
  console.log(`生成API: POST http://localhost:${PORT}/generate`);
});
