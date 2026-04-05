import { useState, useRef } from "react";

const GRAD = "linear-gradient(135deg, #00C9B1 0%, #4A6CF7 50%, #8B2FC9 100%)";
const P = "#7B3FC9";
const MOODS = ["カジュアル","寄り添い","おもしろ","真面目","驚き","煽り"];
const SITUATIONS = [
  { label:"赤ちゃんとの日常", emoji:"👶", bg:"#FFF0F5" },
  { label:"ライブ告知",        emoji:"📣", bg:"#1a1a2e" },
  { label:"仲間とのふれあい",  emoji:"🤝", bg:"#F0FFF4" },
  { label:"不安・驚き",        emoji:"😨", bg:"#1a1a1a" },
  { label:"盛り上がり",         emoji:"🔥", bg:"#FFF5F0" },
];
const GOALS = ["個別相談の申込","DM・LINE獲得","講座・コース販売","コンテンツ販売","EC・物販","アフィリエイト","ファン化・日常発信","無料教育コンテンツ","その他"];
const GENRES = ["片付け・整理収納","脳育・知育","マネー・副業","美容・ダイエット","子育て・教育","ビジネス・集客","その他"];
const USAGE_PCT = 27;

// ─── Shared styles ────────────────────────────────────────────
const s = {
  app: { display:"flex", flexDirection:"column", height:"100vh", maxWidth:430, margin:"0 auto", fontFamily:"'Helvetica Neue','Hiragino Sans','Yu Gothic',sans-serif", position:"relative", overflow:"hidden", background:"#fff" },
  gnav: { background:GRAD, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 },
  gnavIcon: { fontSize:22, color:"#fff", cursor:"pointer", opacity:0.95, userSelect:"none" },
  gnavIconOff: { fontSize:22, color:"#fff", opacity:0.3, cursor:"default", userSelect:"none" },
  snav: { background:"#111", padding:"6px 10px", display:"flex", gap:4, overflowX:"auto", flexShrink:0, scrollbarWidth:"none" },
  snavBtn: (active) => ({ flexShrink:0, padding:"4px 10px", borderRadius:20, fontSize:10, fontWeight:600, border:"none", cursor:"pointer", background:active?"#7B3FC9":"#333", color:"#fff", whiteSpace:"nowrap" }),
  scroll: { flex:1, overflowY:"auto", scrollbarWidth:"none" },
  bnav: { borderTop:"1px solid #eee", background:"#fff", display:"flex", justifyContent:"space-around", padding:"10px 0 20px", flexShrink:0 },
  bitem: (active) => ({ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer" }),
  bicon: (active) => ({ fontSize:20, color:active?P:"#888" }),
  blabel: (active) => ({ fontSize:10, color:active?P:"#888", fontWeight:active?700:400 }),
  btn: { width:"100%", padding:"16px", borderRadius:14, background:P, color:"#fff", fontSize:16, fontWeight:700, border:"none", cursor:"pointer" },
  btnOutline: { width:"100%", padding:"14px", borderRadius:14, background:"#fff", color:P, fontSize:15, fontWeight:700, border:`1.5px solid ${P}`, cursor:"pointer" },
  sectionBox: { border:"1px solid #eee", borderRadius:12, overflow:"hidden", marginBottom:12 },
  sectionHead: { background:"#F7F5FF", padding:"10px 14px", display:"flex", alignItems:"center", gap:8, fontSize:12, fontWeight:700, color:"#4C1D95" },
  sectionBody: { padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 },
  fieldLabel: { fontSize:11, color:"#888", marginBottom:4, display:"flex", alignItems:"center", gap:4 },
  inp: { width:"100%", padding:"10px 12px", border:"1.5px solid #ddd", borderRadius:9, fontSize:13, color:"#333", background:"#fff", outline:"none" },
  inpFocus: { border:`1.5px solid ${P}` },
  sel: { width:"100%", padding:"10px 12px", border:"1.5px solid #ddd", borderRadius:9, fontSize:13, color:"#333", background:"#fff", appearance:"none" },
  ta: { width:"100%", padding:"10px 12px", border:"1.5px solid #ddd", borderRadius:9, fontSize:12, color:"#333", background:"#fff", resize:"none", minHeight:64, lineHeight:1.5, outline:"none" },
  chip: (on) => ({ padding:"6px 14px", borderRadius:20, fontSize:12, border:`1.5px solid ${on?"#7B3FC9":"#ddd"}`, background:on?"#7B3FC9":"#fff", color:on?"#fff":"#555", cursor:"pointer", fontWeight:on?700:400, whiteSpace:"nowrap" }),
  req: { fontSize:9, background:"#FEE2E2", color:"#DC2626", padding:"2px 6px", borderRadius:4, fontWeight:700 },
  opt: { fontSize:9, background:"#F3F4F6", color:"#6B7280", padding:"2px 6px", borderRadius:4 },
  pbar: { height:4, background:"#eee", borderRadius:2, margin:"6px 0 14px" },
  pfill: (pct) => ({ height:4, width:`${pct}%`, background:P, borderRadius:2 }),
  hint: { fontSize:10, color:"#aaa", marginTop:3 },
};

// ─── Global Nav ────────────────────────────────────────────────
function GNav({ screen, setScreen, showMenu, setShowMenu }) {
  const isEditor = screen === "editor";
  const screens = ["signup","login","verify","dashboard","step1a","step1b","step2","generating","step3","step4","bgselect","step5","editor","loading","complete","mypage"];
  const idx = screens.indexOf(screen);
  const navTitle = {
    signup:"", login:"", verify:"", dashboard:"",
    step1a:"基本情報　STEP 1a", step1b:"基本情報　STEP 1b",
    step2:"テキストのテンション選択",
    generating:"テキスト生成",
    step3:"テキスト確認",
    step4:"レイアウト選択",
    bgselect:"背景画像を選ぶ",
    step5:"合成プレビュー",
    editor:"編集モード",
    loading:"", complete:"", mypage:"マイページ",
  }[screen] || "";

  return (
    <div style={s.gnav}>
      <div style={{ display:"flex", gap:18, alignItems:"center" }}>
        <span style={s.gnavIcon} onClick={() => setScreen("dashboard")}>⌂</span>
        {isEditor && <>
          <span style={idx > 0 ? s.gnavIcon : s.gnavIconOff} onClick={() => idx > 0 && setScreen(screens[idx-1])}>↩</span>
          <span style={idx < screens.length-1 ? s.gnavIcon : s.gnavIconOff} onClick={() => idx < screens.length-1 && setScreen(screens[idx+1])}>↪</span>
        </>}
      </div>
      <span style={{ color:"#fff", fontSize:13, fontWeight:600, flex:1, textAlign:"center" }}>{navTitle || "Stories AI"}</span>
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        {isEditor && <span style={s.gnavIcon}>⬇</span>}
        <span style={s.gnavIcon} onClick={() => setShowMenu(true)}>≡</span>
      </div>
    </div>
  );
}

// ─── Screen Nav ────────────────────────────────────────────────
function SNav({ screen }) {
  const map = {
    signup:   [["①登録",true],["②基本情報",false]],
    login:    [["①ログイン",true],["②基本情報",false]],
    verify:   [["①認証",true],["②基本情報",false]],
    dashboard:[["HOME",true]],
    step1a:   [["HOME",false],["①基本情報",true],["②ターゲット",false],["③テンション",false],["④テキスト確認",false],["⑤レイアウト",false],["⑥STEP5",false]],
    step1b:   [["HOME",false],["①基本情報",false],["②ターゲット",true],["③テンション",false],["④テキスト確認",false],["⑤レイアウト",false],["⑥STEP5",false]],
    step2:    [["HOME",false],["①基本情報",false],["②ターゲット",false],["③テンション",true],["④テキスト確認",false],["⑤レイアウト",false],["⑥STEP5",false]],
    generating:[["③テンション",false],["テキスト生成",true],["④テキスト確認",false]],
    step3:    [["テキスト生成",false],["④テキスト確認",true],["⑤レイアウト",false],["⑥STEP5",false]],
    step4:    [["④テキスト確認",false],["⑤レイアウト",true],["⑥背景画像",false],["⑦STEP5",false]],
    bgselect: [["⑤レイアウト",false],["⑥背景画像",true],["⑦STEP5",false]],
    step5:    [["⑥背景画像",false],["⑦合成プレビュー",true]],
    editor:   [["⑦合成プレビュー",false],["編集中",true]],
    loading:  [["⑧保存中",true]],
    complete: [["⑨完了",true]],
    mypage:   [["マイページ",true]],
  };
  const items = map[screen] || [];
  return (
    <div style={s.snav}>
      {items.map(([label, active]) => (
        <button key={label} style={s.snavBtn(active)}>{label}</button>
      ))}
    </div>
  );
}

// ─── Bottom Nav ────────────────────────────────────────────────
function BNav({ screen, setScreen }) {
  return (
    <div style={s.bnav}>
      {[["⌂","ホーム","dashboard"],["📋","履歴","history"],["👤","マイページ","mypage"]].map(([ic,lb,sc]) => (
        <div key={sc} style={s.bitem(screen===sc)} onClick={() => setScreen(sc)}>
          <span style={s.bicon(screen===sc)}>{ic}</span>
          <span style={s.blabel(screen===sc)}>{lb}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Menu Overlay ──────────────────────────────────────────────
function MenuOverlay({ onClose, setScreen }) {
  return (
    <div style={{ position:"absolute", inset:0, zIndex:100, background:"rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div style={{ position:"absolute", top:0, right:0, bottom:0, width:280, background:"#fff", boxShadow:"-4px 0 24px rgba(0,0,0,.15)", display:"flex", flexDirection:"column" }} onClick={e=>e.stopPropagation()}>
        <div style={{ background:GRAD, padding:"20px 20px 16px" }}>
          <div style={{ color:"#fff", fontSize:16, fontWeight:700 }}>山田 花子</div>
          <div style={{ color:"rgba(255,255,255,.75)", fontSize:12 }}>you@example.com</div>
          <div style={{ display:"inline-block", background:"rgba(255,255,255,.2)", borderRadius:6, padding:"3px 10px", fontSize:11, color:"#fff", marginTop:8, fontWeight:700 }}>Pro プラン</div>
        </div>
        <div style={{ flex:1, padding:"8px 0" }}>
          {[
            ["📋","生成履歴","history"],
            ["👤","マイページ","mypage"],
            ["⚙","設定","mypage"],
          ].map(([ic,lb,sc]) => (
            <div key={lb} style={{ padding:"14px 20px", borderBottom:"1px solid #f5f5f5", display:"flex", alignItems:"center", gap:12, cursor:"pointer", fontSize:15, color:"#333", fontWeight:500 }}
              onClick={() => { setScreen(sc); onClose(); }}>
              <span style={{ fontSize:20 }}>{ic}</span>{lb}
            </div>
          ))}
        </div>
        <div style={{ padding:"8px 0 32px", borderTop:"1px solid #eee" }}>
          <div style={{ padding:"14px 20px", cursor:"pointer", fontSize:15, color:"#E24B4A", fontWeight:700, display:"flex", alignItems:"center", gap:12 }}
            onClick={() => { setScreen("login"); onClose(); }}>
            <span style={{ fontSize:20 }}>↪</span>ログアウト
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Usage Bar ─────────────────────────────────────────────────
function UsageBar({ pct }) {
  const color = pct >= 90 ? "#E24B4A" : pct >= 75 ? "#F59E0B" : "#7B3FC9";
  return (
    <div style={{ background:"#F7F5FF", borderRadius:10, padding:"10px 14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:12, color:"#888" }}>今月の使用量</span>
        <span style={{ fontSize:12, fontWeight:700, color }}>{pct}%</span>
      </div>
      <div style={{ height:6, background:"#eee", borderRadius:3 }}>
        <div style={{ height:6, width:`${pct}%`, background:color, borderRadius:3 }}/>
      </div>
      <div style={{ fontSize:10, color:"#aaa", marginTop:4 }}>API使用コスト ¥{Math.round(pct*5)} / ¥500上限</div>
    </div>
  );
}

// ─── Story Card ────────────────────────────────────────────────
function StoryCard({ bg, emoji, lines, onClick, selected }) {
  return (
    <div onClick={onClick} style={{ flexShrink:0, width:90, aspectRatio:"9/16", background:bg, borderRadius:14, overflow:"hidden", cursor:"pointer", boxShadow:`0 2px 10px rgba(0,0,0,0.08)`, display:"flex", flexDirection:"column", padding:"10px 8px 8px", border:selected?`2.5px solid ${P}`:"2.5px solid transparent" }}>
      <div style={{ fontSize:20, marginBottom:6 }}>{emoji}</div>
      {(lines||[]).map((l,i) => <div key={i} style={{ fontSize:l.size||9, fontWeight:l.bold?800:500, color:l.color||"#222", lineHeight:1.35, marginBottom:2, whiteSpace:"pre-line" }}>{l.text}</div>)}
    </div>
  );
}

// ══ Screen: Signup ═════════════════════════════════════════════
function SignupScreen({ setScreen }) {
  return (
    <div style={{ ...s.scroll, padding:"24px 24px 40px" }}>
      <div style={{ fontSize:28, fontWeight:900, marginBottom:4 }}>Stories AI</div>
      <div style={{ fontSize:13, color:"#888", marginBottom:24 }}>SNS発信者のためのストーリーズ自動生成</div>
      <div style={{ border:"1.5px solid #ddd", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", marginBottom:14, fontSize:14 }}>
        <span style={{ fontSize:18, fontWeight:900 }}>G</span>Googleで登録
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <div style={{ flex:1, height:1, background:"#eee" }}/><span style={{ fontSize:11, color:"#bbb" }}>または</span><div style={{ flex:1, height:1, background:"#eee" }}/>
      </div>
      {[["お名前","山田 花子","text"],["メールアドレス","you@example.com","email"],["パスワード","••••••••","password"]].map(([lb,ph,tp]) => (
        <div key={lb} style={{ marginBottom:12 }}>
          <div style={s.fieldLabel}>{lb}</div>
          <input style={s.inp} placeholder={ph} type={tp}/>
        </div>
      ))}
      <button style={s.btn} onClick={() => setScreen("verify")}>3日間無料で始める</button>
      <div style={{ fontSize:10, color:"#bbb", textAlign:"center", marginTop:8 }}>利用規約・プライバシーポリシーに同意</div>
      <div style={{ fontSize:12, color:P, textAlign:"center", marginTop:14, cursor:"pointer" }} onClick={() => setScreen("login")}>すでにアカウントがある → ログイン</div>
    </div>
  );
}

// ══ Screen: Login ══════════════════════════════════════════════
function LoginScreen({ setScreen }) {
  return (
    <div style={{ ...s.scroll, padding:"24px 24px 40px" }}>
      <div style={{ fontSize:24, fontWeight:900, marginBottom:24 }}>ログイン</div>
      <div style={{ border:"1.5px solid #ddd", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", marginBottom:14, fontSize:14 }}>
        <span style={{ fontSize:18, fontWeight:900 }}>G</span>Googleでログイン
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <div style={{ flex:1, height:1, background:"#eee" }}/><span style={{ fontSize:11, color:"#bbb" }}>または</span><div style={{ flex:1, height:1, background:"#eee" }}/>
      </div>
      <div style={{ marginBottom:12 }}>
        <div style={s.fieldLabel}>メールアドレス</div>
        <input style={s.inp} placeholder="you@example.com" type="email"/>
      </div>
      <div style={{ marginBottom:8 }}>
        <div style={s.fieldLabel}>パスワード</div>
        <input style={s.inp} placeholder="••••••••" type="password"/>
      </div>
      <div style={{ textAlign:"right", marginBottom:16 }}>
        <span style={{ fontSize:12, color:P, cursor:"pointer" }} onClick={() => setScreen("pwreset")}>パスワードを忘れた方</span>
      </div>
      <button style={s.btn} onClick={() => setScreen("dashboard")}>ログイン</button>
      <div style={{ fontSize:12, color:P, textAlign:"center", marginTop:14, cursor:"pointer" }} onClick={() => setScreen("signup")}>新規登録はこちら</div>
    </div>
  );
}

// ══ Screen: Verify ═════════════════════════════════════════════
function VerifyScreen({ setScreen }) {
  return (
    <div style={{ ...s.scroll, padding:"48px 24px 40px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ fontSize:60, marginBottom:20 }}>✉</div>
      <div style={{ fontSize:20, fontWeight:900, textAlign:"center", marginBottom:10 }}>メールを確認してください</div>
      <div style={{ fontSize:13, color:"#888", textAlign:"center", lineHeight:1.7, marginBottom:24 }}>you@example.com に送信しました。<br/>メール内のリンクをタップすると<br/>自動的にログインされます。</div>
      <div style={{ background:"#F7F5FF", borderRadius:12, padding:"14px 16px", marginBottom:20, width:"100%" }}>
        <div style={{ fontSize:12, color:"#6D28D9", lineHeight:1.7 }}>メールが届かない場合：<br/>・迷惑メールフォルダを確認<br/>・数分待ってから再送信</div>
      </div>
      <button style={s.btnOutline} onClick={() => {}}>再送信する</button>
      <div style={{ fontSize:12, color:P, marginTop:14, cursor:"pointer" }} onClick={() => setScreen("signup")}>別のメールアドレスで登録</div>
      <button style={{ ...s.btn, marginTop:20, background:"#eee", color:"#555" }} onClick={() => setScreen("dashboard")}>（デモ）認証完了 →</button>
    </div>
  );
}

// ══ Screen: Dashboard ══════════════════════════════════════════
function DashboardScreen({ setScreen }) {
  const pct = USAGE_PCT;
  const warn = pct >= 90;
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {warn && (
        <div style={{ background:"#FEF3C7", borderBottom:"2px solid #F59E0B", padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18 }}>⚠</span>
          <span style={{ fontSize:13, fontWeight:700, color:"#92400E", flex:1 }}>今月の生成残りわずかです</span>
          <span style={{ fontSize:12, color:P, fontWeight:700, cursor:"pointer" }} onClick={() => setScreen("pricing")}>プランを確認 →</span>
        </div>
      )}
      <div style={{ ...s.scroll, padding:"16px" }}>
        <UsageBar pct={pct}/>
        <button style={{ ...s.btn, marginTop:12 }} onClick={() => setScreen("step1a")}>＋ 新規生成</button>
        <div style={{ fontSize:14, fontWeight:700, margin:"16px 0 10px" }}>最近の生成</div>
        {[["4/1生成　30日分","150枚 → 開く","#1a2a4c"],["3/15生成　14日分","70枚 → 開く","#3a1a5c"],["2/28生成　7日分","35枚 → 開く","#1a4c2a"]].map(([title,sub,bg]) => (
          <div key={title} style={{ border:"1px solid #eee", borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", gap:12, marginBottom:8, cursor:"pointer" }} onClick={() => setScreen("step5")}>
            <div style={{ width:32, height:50, background:bg, borderRadius:5, flexShrink:0 }}/>
            <div>
              <div style={{ fontSize:13, fontWeight:700 }}>{title}</div>
              <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ Screen: Step1a ═════════════════════════════════════════════
function Step1aScreen({ setScreen }) {
  const [goal, setGoal] = useState("個別相談の申込");
  const [days, setDays] = useState(30);
  return (
    <div style={{ ...s.scroll, padding:"4px 16px 40px" }}>
      <div style={s.pbar}><div style={s.pfill(20)}/></div>
      <div style={s.sectionBox}>
        <div style={s.sectionHead}><span>🎯</span>発信の目的<span style={s.req}>必須</span></div>
        <div style={s.sectionBody}>
          <div>
            <div style={s.fieldLabel}>達成したいゴール</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:4 }}>
              {GOALS.map(g => <div key={g} style={s.chip(goal===g)} onClick={() => setGoal(g)}>{g}</div>)}
            </div>
          </div>
          <div>
            <div style={s.fieldLabel}>商材・サービス名<span style={s.opt}>任意</span></div>
            <input style={s.inp} placeholder="例：個別相談90分"/>
          </div>
          <div>
            <div style={s.fieldLabel}>生成日数（1〜30日）<span style={s.req}>必須</span></div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:6 }}>
              <input type="range" min={1} max={30} value={days} onChange={e=>setDays(Number(e.target.value))} style={{ flex:1, accentColor:P }}/>
              <span style={{ fontSize:16, fontWeight:700, color:P, minWidth:28 }}>{days}</span>
              <span style={{ fontSize:12, color:"#aaa" }}>日</span>
            </div>
            <div style={{ background:"#F7F5FF", borderRadius:8, padding:"8px 12px", marginTop:8, fontSize:12, color:"#6D28D9", lineHeight:1.6 }}>
              テキスト生成・Canvas合成・PNG保存はすべて無制限
            </div>
          </div>
        </div>
      </div>
      <div style={s.sectionBox}>
        <div style={s.sectionHead}><span>👤</span>発信者プロフィール</div>
        <div style={s.sectionBody}>
          <div>
            <div style={s.fieldLabel}>発信ジャンル<span style={s.req}>必須</span></div>
            <select style={s.sel}>{GENRES.map(g => <option key={g}>{g}</option>)}</select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <div style={s.fieldLabel}>年代<span style={s.opt}>任意</span></div>
              <select style={s.sel}><option>30代後半</option><option>40代</option><option>50代以上</option></select>
            </div>
            <div>
              <div style={s.fieldLabel}>子ども<span style={s.opt}>任意</span></div>
              <select style={s.sel}><option>なし</option><option>1人</option><option selected>2人</option><option>3人以上</option></select>
            </div>
          </div>
          <div>
            <div style={s.fieldLabel}>強み・自分らしさ<span style={s.opt}>任意</span></div>
            <textarea style={s.ta} placeholder="例：元お片付け苦手だったワーキングマザー。子どもが3人いても15分で片付く仕組みを作った経験をもとに発信中。"/>
            <div style={s.hint}>AIが言葉のトーンや共感ポイントを合わせます</div>
          </div>
        </div>
      </div>
      <button style={s.btn} onClick={() => setScreen("step1b")}>次へ</button>
    </div>
  );
}

// ══ Screen: Step1b ═════════════════════════════════════════════
function Step1bScreen({ setScreen }) {
  return (
    <div style={{ ...s.scroll, padding:"4px 16px 40px" }}>
      <div style={s.pbar}><div style={s.pfill(40)}/></div>
      <div style={s.sectionBox}>
        <div style={s.sectionHead}><span>🎯</span>ターゲット設定<span style={s.req}>必須</span></div>
        <div style={s.sectionBody}>
          <div>
            <div style={s.fieldLabel}>メインターゲット<span style={s.req}>必須</span></div>
            <input style={{ ...s.inp, borderColor:P }} defaultValue="子育てで忙しい30代後半〜40代前半のママ"/>
            <div style={s.hint}>例：育児中の30〜40代ワーキングマザー</div>
          </div>
          <div>
            <div style={s.fieldLabel}>サブターゲット<span style={s.opt}>任意</span></div>
            <input style={s.inp} placeholder="例：産育休中の方、復職を考えている専業主婦"/>
          </div>
        </div>
      </div>
      <div style={s.sectionBox}>
        <div style={s.sectionHead}><span>💬</span>悩み・理想・理由<span style={s.req}>必須</span></div>
        <div style={s.sectionBody}>
          {[["表の悩み（口にしていること）",["忙しくて家が片付かない","物が多すぎて捨てられない","続かない"]],
            ["理想の未来",["家に帰るのが楽しみになる","子どもに怒らなくなる","自分の時間が生まれる"]],
            ["表向きの理由（口にする言い訳）",["時間がない","やる気が出ない","方法が分からない"]]].map(([lb,vals]) => (
            <div key={lb}>
              <div style={s.fieldLabel}>{lb}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:4 }}>
                {vals.map((v,i) => <input key={i} style={s.inp} defaultValue={i===0?v:""} placeholder={i>0?v:""}/>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:12, padding:"12px 14px", marginBottom:10 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#7C3AED", marginBottom:6, display:"flex", alignItems:"center", gap:8 }}>
          本音インサイト
          <span style={{ fontSize:9, background:"#FEF3C7", color:"#92400E", padding:"2px 6px", borderRadius:4, fontWeight:700 }}>AIへの隠し入力</span>
        </div>
        <textarea style={{ ...s.ta, background:"#F5F3FF", borderColor:"#DDD6FE" }} placeholder={"例：\n・「私だけできていない気がして惨めに感じている」\n・「本当は自分の時間が欲しい。でも言えない」"}/>
        <div style={s.hint}>フロントには表示されません。ストーリーズの言葉の深みに活かします。</div>
      </div>
      <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, marginBottom:12, cursor:"pointer" }}>
        <span style={{ fontSize:20 }}>🌀</span>
        <span style={{ fontSize:13, color:"#4C1D95", fontWeight:700 }}>AIにインサイトを提案させる</span>
      </div>
      <button style={s.btn} onClick={() => setScreen("step2")}>次へ</button>
      <button style={s.btnOutline} onClick={() => setScreen("step1a")}>← 戻る</button>
    </div>
  );
}

// ══ Screen: Step2 ══════════════════════════════════════════════
function Step2Screen({ setScreen }) {
  const [selected, setSelected] = useState(0);
  const fonts = [
    { label:"シンプル", font:"Hiragino Sans, sans-serif", desc:"Hiragino角ゴシック" },
    { label:"かわいい", font:"Comic Sans MS, cursive", desc:"丸ゴシック" },
    { label:"落ち着き", font:"Georgia, serif", desc:"メイリオ" },
  ];
  return (
    <div style={{ ...s.scroll, padding:"4px 16px 40px" }}>
      <div style={s.pbar}><div style={s.pfill(55)}/></div>
      <div style={{ fontSize:16, fontWeight:900, marginBottom:5 }}>テキストのテンションを選択</div>
      <div style={{ fontSize:12, color:"#999", marginBottom:16 }}>横スクロールで選択</div>
      <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8 }}>
        {fonts.map((f,i) => (
          <div key={i} onClick={() => setSelected(i)} style={{ flexShrink:0, width:140, border:`2px solid ${selected===i?P:"#ddd"}`, borderRadius:14, padding:"12px", cursor:"pointer", position:"relative" }}>
            {selected===i && <div style={{ position:"absolute", top:8, right:8, width:20, height:20, background:P, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", fontWeight:700 }}>✓</div>}
            <div style={{ background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)", borderRadius:8, padding:"14px 10px", marginBottom:10, textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:900, fontFamily:f.font, color:"#3A2A15" }}>見出し見本</div>
              <div style={{ fontSize:11, fontFamily:f.font, color:"#5A4A35", marginTop:4, lineHeight:1.5 }}>本文テキストはこんな感じ</div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:selected===i?P:"#333", textAlign:"center" }}>{f.label}</div>
            <div style={{ fontSize:10, color:"#999", textAlign:"center", marginTop:2 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <button style={{ ...s.btn, marginTop:20 }} onClick={() => setScreen("generating")}>次へ</button>
      <button style={s.btnOutline} onClick={() => setScreen("step1b")}>← 戻る</button>
    </div>
  );
}

// ══ Screen: Generating ═════════════════════════════════════════
function GeneratingScreen({ setScreen }) {
  return (
    <div style={{ ...s.scroll, padding:"20px 16px 40px" }}>
      <div style={{ fontSize:18, fontWeight:900, textAlign:"center", marginBottom:6 }}>テキストを生成中...</div>
      <div style={{ fontSize:13, color:P, textAlign:"center", fontWeight:700, marginBottom:14 }}>Day 3 / 30 生成中</div>
      <div style={{ height:5, background:"#eee", borderRadius:3, marginBottom:16 }}>
        <div style={{ height:5, width:"10%", background:GRAD, borderRadius:3 }}/>
      </div>
      <div style={{ border:"1px solid #eee", borderRadius:12, overflow:"hidden", marginBottom:10 }}>
        <div style={{ background:"#F7F5FF", padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, fontWeight:700, color:P }}>Day 1　認知フェーズ</span>
          <span style={{ fontSize:10, background:"#DCFCE7", color:"#166534", padding:"2px 8px", borderRadius:6, fontWeight:700 }}>生成済み</span>
        </div>
        <div style={{ padding:"10px 12px" }}>
          <div style={{ fontSize:14, fontWeight:900, color:"#1a1a1a", marginBottom:4, paddingBottom:4, borderBottom:"1px solid #f0f0f0" }}>片付けで収入が変わる？</div>
          <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:6 }}>30代ママが知るべき秘訣</div>
          {["毎日忙しくて家が散らかっている…実は収入にも影響しているかもしれません。","片付けられない状態が続くと、探し物に時間を取られ、仕事への集中力も低下します。","逆に、整った空間では思考がクリアになり、行動力が変わります。","実際に片付けを習慣化したママたちの多くが「自分への投資を始めた」と語っています。","「整理収納」は単なる片付けではなく、人生を変えるスキルかもしれません。"].map((t,i) => (
            <div key={i} style={{ fontSize:12, color:"#555", lineHeight:1.6, marginBottom:3 }}>{t}</div>
          ))}
          <div style={{ fontSize:12, fontWeight:700, color:"#555", marginTop:6, paddingTop:6, borderTop:"1px solid #f0f0f0" }}>まずはたった1つの場所から始めてみませんか？</div>
        </div>
      </div>
      <div style={{ border:"1px solid #eee", borderRadius:12, overflow:"hidden", marginBottom:10 }}>
        <div style={{ background:"#F7F5FF", padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, fontWeight:700, color:P }}>Day 2　認知フェーズ</span>
          <span style={{ fontSize:10, background:"#DCFCE7", color:"#166534", padding:"2px 8px", borderRadius:6, fontWeight:700 }}>生成済み</span>
        </div>
        <div style={{ padding:"10px 12px" }}>
          <div style={{ fontSize:14, fontWeight:900, color:"#1a1a1a", marginBottom:4 }}>家が片付かない本当の理由、知っていますか？</div>
          <div style={{ fontSize:12, color:"#555", lineHeight:1.6 }}>多くのママが「時間がない」と言いますが、本当の原因は別にあります。</div>
        </div>
      </div>
      <div style={{ border:`1.5px dashed ${P}`, borderRadius:12, padding:"10px 12px", marginBottom:14 }}>
        <div style={{ fontSize:12, color:P, fontWeight:700, marginBottom:8 }}>Day 3 認知フェーズ　生成中...</div>
        {[80,60,90,50,70].map((w,i) => <div key={i} style={{ height:8, background:"#DDD6FE", borderRadius:4, marginBottom:6, width:`${w}%` }}/>)}
      </div>
      <button style={s.btnOutline} onClick={() => setScreen("step3")}>（デモ）生成完了 → 確認画面へ</button>
    </div>
  );
}

// ══ Screen: Step3 ══════════════════════════════════════════════
function Step3Screen({ setScreen }) {
  const days = [
    { day:1, phase:"認知", h1:"片付けで収入が変わる？", h2:"30代ママが知るべき秘訣", body:["毎日忙しくて家が散らかっている…","実は収入にも影響しているかもしれません。","片付けを習慣化したママたちが語る変化とは？"] },
    { day:2, phase:"認知", h1:"家が片付かない本当の理由", h2:"知っていますか？", body:["「時間がない」は本当の理由ではありません。","実は片付けの仕組みがないだけかもしれません。"] },
    { day:3, phase:"認知", h1:"忙しいママが実践する", h2:"5分片付け術とは？", body:["毎日5分だけで家が変わる方法があります。","特別な道具も時間も不要です。"] },
  ];
  return (
    <div style={{ ...s.scroll, padding:"4px 16px 40px" }}>
      <div style={s.pbar}><div style={s.pfill(65)}/></div>
      <div style={{ fontSize:15, fontWeight:900, marginBottom:4 }}>生成テキストを確認・編集</div>
      <div style={{ fontSize:11, color:"#aaa", marginBottom:14 }}>直接編集可能・制限なし・カウントなし</div>
      {days.map(d => (
        <div key={d.day} style={{ border:"1px solid #eee", borderRadius:12, overflow:"hidden", marginBottom:10 }}>
          <div style={{ background:"#F7F5FF", padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:700, color:P }}>Day {d.day}　{d.phase}フェーズ</span>
            <div style={{ border:`1px solid ${P}`, borderRadius:7, padding:"3px 10px", fontSize:11, color:P, cursor:"pointer", fontWeight:600 }}>この日を再生成</div>
          </div>
          <div style={{ padding:"10px 12px" }}>
            <div style={{ fontSize:14, fontWeight:900, color:"#1a1a1a", marginBottom:3 }}>{d.h1}</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:6 }}>{d.h2}</div>
            {d.body.map((t,i) => <div key={i} style={{ fontSize:12, color:"#555", lineHeight:1.6, marginBottom:3 }}>{t}</div>)}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
              <div style={{ border:"1px solid #ddd", borderRadius:6, padding:"3px 10px", fontSize:11, color:"#888", cursor:"pointer" }}>編集</div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ fontSize:12, color:"#bbb", textAlign:"center", margin:"8px 0 16px" }}>… 30日分 縦スクロール …</div>
      <button style={s.btn} onClick={() => setScreen("step4")}>テキストを確定</button>
      <button style={s.btnOutline} onClick={() => setScreen("step2")}>← 戻る</button>
    </div>
  );
}

// ══ Screen: Step4 ══════════════════════════════════════════════
function Step4Screen({ setScreen }) {
  const [mood, setMood] = useState(null);
  const cards = [
    { bg:"#FFF0F5", emoji:"👶", mood:"カジュアル", lines:[{text:"生後3ヶ月\n立ってる🤣",bold:true,size:10}] },
    { bg:"#1a1a2e", emoji:"📣", mood:"真面目", lines:[{text:"INSTA LIVE",bold:true,size:10,color:"#7B8BF7"},{text:"2/13 21:30〜",size:8,color:"#fff"}] },
    { bg:"#e8f5e9", emoji:"🤝", mood:"寄り添い", lines:[{text:"仲間と一緒に",size:10},{text:"頑張ってます💚",size:9,color:"#444"}] },
    { bg:"#f3e5f5", emoji:"✨", mood:"カジュアル", lines:[{text:"大切な家族が\n増えた今",size:10}] },
    { bg:"#fff9c4", emoji:"💡", mood:"おもしろ", lines:[{text:"無知なママには\nならない！",size:10}] },
    { bg:"#b2dfdb", emoji:"😎", mood:"カジュアル", lines:[{text:"ついにだぁ😎",bold:true,size:12}] },
    { bg:"#fce4ec", emoji:"❤️", mood:"寄り添い", lines:[{text:"それを教えて\nくれたのが",size:10}] },
    { bg:"#FFF5F0", emoji:"🔥", mood:"煽り", lines:[{text:"激ヤバ企画です",bold:true,size:10}] },
  ];
  const filtered = mood ? cards.filter(c => c.mood === mood) : cards.slice(0,5);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ ...s.scroll }}>
        <div style={{ padding:"4px 16px 0" }}>
          <div style={s.pbar}><div style={s.pfill(75)}/></div>
        </div>

        {/* AIにお任せ — 明確なボタン */}
        <div style={{ padding:"0 16px 16px" }}>
          <div onClick={() => setScreen("bgselect")} style={{ background:GRAD, borderRadius:16, padding:"18px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", boxShadow:"0 4px 20px rgba(123,63,201,.35)", border:"none" }}>
            <div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.8)", marginBottom:4 }}>迷ったらこれ</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:4 }}>AIにお任せ</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.75)" }}>ターゲットに最適なレイアウトを自動選択</div>
            </div>
            <div style={{ background:"rgba(255,255,255,.2)", borderRadius:50, width:56, height:56, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🌀</div>
          </div>
        </div>

        {/* 言葉のテンションを選択 */}
        <div style={{ padding:"0 16px 10px" }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>言葉のテンションを選択</div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, scrollbarWidth:"none" }}>
            {MOODS.map(m => (
              <div key={m} onClick={() => setMood(mood===m?null:m)} style={{ flexShrink:0, padding:"9px 18px", borderRadius:22, border:`1.5px solid ${mood===m?P:"#ddd"}`, background:mood===m?P:"#fff", color:mood===m?"#fff":"#444", fontSize:13, fontWeight:600, cursor:"pointer" }}>{m}</div>
            ))}
          </div>
          {mood && (
            <button style={{ ...s.btn, marginTop:12 }} onClick={() => setScreen("bgselect")}>
              「{mood}」で進む →
            </button>
          )}
        </div>

        {/* シチュエーション — 大きく */}
        <div style={{ padding:"4px 16px 14px" }}>
          <div style={{ fontSize:13, color:"#888", fontWeight:700, marginBottom:10 }}>または選んで選択</div>
          <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4, scrollbarWidth:"none" }}>
            {SITUATIONS.map((sit,i) => (
              <div key={i} style={{ flexShrink:0, textAlign:"center" }} onClick={() => setScreen("bgselect")}>
                <div style={{ width:80, aspectRatio:"9/16", background:sit.bg, borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,.1)" }}>
                  <span style={{ fontSize:30 }}>{sit.emoji}</span>
                </div>
                <div style={{ fontSize:10, color:"#555", marginTop:6, lineHeight:1.3, maxWidth:80 }}>{sit.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* おすすめグリッド — 小さく */}
        <div style={{ padding:"0 16px 4px", fontSize:13, fontWeight:700, color:"#555" }}>おすすめ</div>
        <div style={{ padding:"6px 12px 24px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          <div style={{ background:"#fff", borderRadius:10, aspectRatio:"9/16", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, cursor:"pointer", border:"1.5px dashed #ddd" }}>
            <span style={{ fontSize:18, color:"#aaa" }}>＋</span>
            <span style={{ fontSize:8, color:"#aaa", textAlign:"center" }}>空のデザインを作成</span>
          </div>
          {filtered.map((c,i) => (
            <div key={i} onClick={() => setScreen("bgselect")} style={{ background:c.bg, borderRadius:10, aspectRatio:"9/16", position:"relative", cursor:"pointer", overflow:"hidden", padding:"8px 6px", display:"flex", flexDirection:"column", boxShadow:"0 2px 6px rgba(0,0,0,.07)" }}>
              <div style={{ position:"absolute", top:4, right:4, width:18, height:18, background:"rgba(255,255,255,.85)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>⋯</div>
              <div style={{ fontSize:14, marginBottom:3 }}>{c.emoji}</div>
              {c.lines.map((l,j) => <div key={j} style={{ fontSize:l.size||8, fontWeight:l.bold?800:500, color:l.color||"#222", lineHeight:1.3, whiteSpace:"pre-line", marginBottom:2 }}>{l.text}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══ Screen: BgSelect ═══════════════════════════════════════════
function BgSelectScreen({ setScreen }) {
  const [imgs, setImgs] = useState({ 1:true, 2:false, 3:false, 4:false, 5:false });
  const days = [
    { day:1, phase:"認知", bg:"#1a2a4c" },
    { day:2, phase:"認知", bg:"#8a6a4a" },
    { day:3, phase:"認知", bg:"#2a1a4c" },
    { day:4, phase:"興味", bg:"#1a4c2a" },
    { day:5, phase:"興味", bg:"#4c1a2a" },
  ];
  const toggle = (day) => setImgs(prev => ({ ...prev, [day]: !prev[day] }));
  return (
    <div style={{ ...s.scroll, padding:"4px 16px 120px" }}>
      <div style={s.pbar}><div style={s.pfill(85)}/></div>
      <div style={{ fontSize:18, fontWeight:900, marginBottom:4 }}>背景画像を選んでください</div>
      <div style={{ fontSize:12, color:"#aaa", marginBottom:16 }}>1枚ずつ設定できます。後でスキップも可</div>
      {days.map(d => (
        <div key={d.day} style={{ border:"1px solid #eee", borderRadius:14, overflow:"hidden", marginBottom:12 }}>
          <div style={{ background:"#F7F5FF", padding:"10px 14px", fontSize:13, fontWeight:700, color:P }}>Day {d.day}　{d.phase}フェーズ</div>
          <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:52, height:82, background:d.bg, borderRadius:8, flexShrink:0, position:"relative", display:"flex", alignItems:"flex-end", padding:"5px" }}>
              {imgs[d.day] && (
                <div style={{ width:22, height:22, background:"#1D9E75", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:12, color:"#fff" }}>✓</span>
                </div>
              )}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:"#888", marginBottom:8 }}>背景画像</div>
              {imgs[d.day]
                ? (
                  <div style={{ border:"1.5px solid #1D9E75", borderRadius:10, padding:"11px 14px", fontSize:13, color:"#1D9E75", textAlign:"center", cursor:"pointer", background:"#F0FDF4", fontWeight:600 }}
                    onClick={() => toggle(d.day)}>
                    設定済み　変更する
                  </div>
                ) : (
                  <div style={{ border:`1.5px dashed ${P}`, borderRadius:10, padding:"11px 14px", fontSize:13, color:P, textAlign:"center", cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
                    onClick={() => toggle(d.day)}>
                    <span style={{ fontSize:16 }}>＋</span> 画像を選ぶ
                  </div>
                )
              }
            </div>
          </div>
        </div>
      ))}
      <div style={{ fontSize:12, color:"#bbb", textAlign:"center", marginBottom:20 }}>… 30日分 縦スクロール …</div>
      <button style={s.btn} onClick={() => setScreen("step5")}>次へ → 合成プレビュー</button>
      <div style={{ textAlign:"center", marginTop:12, fontSize:13, color:P, cursor:"pointer" }} onClick={() => setScreen("step5")}>背景なしでそのまま進む</div>
    </div>
  );
}

// ══ Screen: Step5 ══════════════════════════════════════════════
function Step5Screen({ setScreen }) {
  const [activeTab, setActiveTab] = useState("全30日");
  const [expanded, setExpanded] = useState({});
  const tabs = ["全30日","認知","興味","関心","意欲","行動変容"];
  const phaseColor = { "認知":"#1D9E75","興味":"#BA7517","関心":"#185FA5","意欲":"#7C3AED","行動変容":"#DC2626" };
  const days = [
    { day:1, phase:"認知", bg:"#1a2a4c", title:"片付けで収入が変わる？",
      pages:[
        { h1:"片付けで収入が変わる？", sub:"30代ママが知るべき秘訣", body:"毎日忙しくて家が散らかっている…実は収入にも影響しているかもしれません。" },
        { h1:"探し物に使う時間は年間150時間", sub:"あなたの収入を奪っている", body:"整った空間では思考がクリアになり、仕事への集中力が変わります。" },
        { h1:"片付けを習慣化したママの声", sub:"「自分への投資を始めた」", body:"まずはたった1つの場所から始めてみませんか？" },
      ]
    },
    { day:2, phase:"認知", bg:"#3a1a5c", title:"家が片付かない本当の理由",
      pages:[
        { h1:"家が片付かない本当の理由", sub:"知っていますか？", body:"「時間がない」は本当の理由ではありません。実は片付けの仕組みがないだけかもしれません。" },
        { h1:"片付けは才能ではなくシステム", sub:"誰でもできる理由がある", body:"正しい順番と場所を決めるだけで家は劇的に変わります。" },
      ]
    },
    { day:3, phase:"認知", bg:"#5a3a1c", title:"忙しいママが実践する5分片付け術",
      pages:[
        { h1:"忙しいママが実践する", sub:"5分片付け術とは？", body:"毎日5分だけで家が変わる方法があります。特別な道具も時間も不要です。" },
      ]
    },
    { day:4, phase:"興味", bg:"#1a4c2a", title:"片付けが変えた私の時間術",
      pages:[{ h1:"片付けが変えた私の時間術", sub:"Before & After", body:"片付け前は毎朝30分探し物をしていた私が、今では朝の支度が15分で完了。" }]
    },
    { day:5, phase:"興味", bg:"#4c1a2a", title:"整理収納で気づいた意外な変化",
      pages:[{ h1:"整理収納で気づいた意外な変化", sub:"家族との関係が変わった", body:"物が減ると、家族への八つ当たりが減りました。空間が心に影響を与えるのです。" }]
    },
    { day:6, phase:"興味", bg:"#2a4c4c", title:"子どもとの時間が増えた理由",
      pages:[{ h1:"子どもとの時間が増えた理由", sub:"片付けが生んだ余白", body:"家事時間が1日30分短縮。その時間を子どもと過ごすことを選びました。" }]
    },
  ];
  const filtered = activeTab === "全30日" ? days : days.filter(d => d.phase === activeTab);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* 戻るボタン */}
      <div style={{ padding:"8px 16px", borderBottom:"1px solid #eee", display:"flex", alignItems:"center" }}>
        <div style={{ fontSize:13, color:P, cursor:"pointer", fontWeight:600 }} onClick={() => setScreen("bgselect")}>
          ← 背景画像を変更
        </div>
      </div>
      {/* フェーズタブ */}
      <div style={{ display:"flex", gap:6, overflowX:"auto", padding:"8px 12px", borderBottom:"1px solid #eee", scrollbarWidth:"none" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flexShrink:0, padding:"6px 16px", borderRadius:18, border:"none", background:activeTab===t?P:"#f3f3f3", color:activeTab===t?"#fff":"#555", fontSize:13, fontWeight:activeTab===t?700:400, cursor:"pointer" }}>{t}</button>
        ))}
      </div>
      <div style={{ ...s.scroll, padding:"10px 14px" }}>
        {filtered.map(d => (
          <div key={d.day} style={{ border:"1px solid #eee", borderRadius:14, overflow:"hidden", marginBottom:10 }}>
            {/* Day行 */}
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", cursor:"pointer" }}
              onClick={() => setExpanded(prev => ({ ...prev, [d.day]: !prev[d.day] }))}>
              <div style={{ width:52, height:82, background:d.bg, borderRadius:8, flexShrink:0, position:"relative" }}>
                <div style={{ position:"absolute", top:3, left:3, background:phaseColor[d.phase]||"#888", borderRadius:4, padding:"2px 6px", fontSize:8, color:"#fff", fontWeight:700 }}>{d.phase}</div>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>Day {d.day}</div>
                <div style={{ fontSize:12, color:"#555", lineHeight:1.4 }}>{d.title}</div>
                <div style={{ fontSize:11, color:"#aaa", marginTop:3 }}>{d.pages.length}枚</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ fontSize:10, color:P, fontWeight:600, cursor:"pointer" }} onClick={e => { e.stopPropagation(); setScreen("editor"); }}>編集</div>
                <div style={{ fontSize:18, color:"#ccc", transform:expanded[d.day]?"rotate(90deg)":"" }}>›</div>
              </div>
            </div>
            {/* 展開：各ページのテキスト全文 */}
            {expanded[d.day] && (
              <div style={{ background:"#FAFAFA", borderTop:"1px solid #eee" }}>
                {d.pages.map((pg, pi) => (
                  <div key={pi} style={{ padding:"12px 14px", borderBottom: pi < d.pages.length-1 ? "1px solid #eee":"none" }}>
                    <div style={{ fontSize:10, color:"#aaa", marginBottom:5 }}>{pi+1}枚目</div>
                    <div style={{ fontSize:15, fontWeight:900, color:"#1a1a1a", marginBottom:3 }}>{pg.h1}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:6 }}>{pg.sub}</div>
                    <div style={{ fontSize:12, color:"#555", lineHeight:1.7 }}>{pg.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* 保存ボタン */}
      <div style={{ background:"#fff", borderTop:"1px solid #eee", padding:"12px 14px", display:"flex", gap:10 }}>
        <div style={{ flex:1, border:"1.5px solid #ddd", borderRadius:12, padding:"12px", textAlign:"center", fontSize:13, fontWeight:700, color:"#555", cursor:"pointer" }}>個別保存</div>
        <div style={{ flex:2, background:P, borderRadius:12, padding:"12px", textAlign:"center", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }} onClick={() => setScreen("loading")}>まとめて保存</div>
      </div>
    </div>
  );
}

// ══ Screen: Editor ═════════════════════════════════════════════
function EditorScreen({ setScreen }) {
  const [selectedEl, setSelectedEl] = useState(null);
  const [activeTool, setActiveTool] = useState("font");
  const [fontSize, setFontSize] = useState(39);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strike, setStrike] = useState(false);
  const [textColor, setTextColor] = useState("#3A2A15");
  const [selectedFont, setSelectedFont] = useState("851チカラヅヨク");
  const [styleSheet, setStyleSheet] = useState(false);
  const [colorPicker, setColorPicker] = useState(false);
  const [titlePos, setTitlePos] = useState({ x:0, y:0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const fonts = ["851チカラヅヨク","AR Gyokaisho","AR Pcrystal","Noto Serif JP","ヒラギノ明朝","游明朝","源ノ角ゴシック","M PLUS 1p"];
  const textStyles = ["タイトル","サブタイトル","見出し","小見出し","セクションのヘッダー","本文"];
  const swatches = ["#000000","#3A2A15","#5A4A35","#FFFFFF","#F5F0E8","#E53935","#F9A8C0","#FC8181","#FF8A65","#FFF5F0","#7B3FC9","#7B8BF7","#4A6CF7","#00C9B1","#68D391","#1a1a2e","#1a1a1a","#4a148c","#888888","#EEEEEE"];

  const bottomTools = [
    {id:"edit",  icon:"⌨", label:"編集"},
    {id:"font",  icon:"Ff",label:"フォント"},
    {id:"style", icon:"H", label:"テキストスタイル"},
    {id:"size",  icon:"AA",label:"フォントサイズ"},
    {id:"color", icon:"A", label:"カラー"},
    {id:"format",icon:"B", label:"フォーマット"},
  ];

  const handleToolTap = (id) => {
    setStyleSheet(false); setColorPicker(false);
    if (id==="style") { setStyleSheet(true); setActiveTool("style"); return; }
    if (id==="color") { setColorPicker(true); setActiveTool("color"); return; }
    setActiveTool(prev => prev===id ? null : id);
  };

  const onDragStart = (e) => {
    setSelectedEl("title"); setDragging(true);
    const t = e.touches ? e.touches[0] : e;
    setDragStart({ x: t.clientX - titlePos.x, y: t.clientY - titlePos.y });
    e.preventDefault();
  };
  const onDragMove = (e) => {
    if (!dragging || !dragStart) return;
    const t = e.touches ? e.touches[0] : e;
    setTitlePos({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };
  const onDragEnd = () => { setDragging(false); setDragStart(null); };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#EBEBEB", overflow:"hidden" }}
      onMouseMove={onDragMove} onMouseUp={onDragEnd}
      onTouchMove={onDragMove} onTouchEnd={onDragEnd}>

      {/* キャンバス */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"10px 14px", overflow:"hidden" }}>
        <div style={{ position:"relative", width:"100%", maxWidth:290 }}>
          <div style={{ background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)", borderRadius:10, aspectRatio:"9/16", overflow:"hidden", display:"flex", flexDirection:"column", padding:"26px 20px 16px", gap:7, border:selectedEl?"2px solid #7B3FC9":"2px solid transparent" }}>
            <div style={{ fontSize:46, fontWeight:900, color:"#3A2A15", lineHeight:0.9, textAlign:"center", fontFamily:"Georgia,serif", letterSpacing:-2, marginBottom:7 }}>THANK<br/>YOU</div>
            <div style={{ fontSize:38, opacity:0.45, alignSelf:"flex-start", marginLeft:-8, marginBottom:5 }}>🌿</div>
            {/* ドラッグ可能なタイトル */}
            <div
              onMouseDown={onDragStart} onTouchStart={onDragStart}
              onClick={() => { setSelectedEl("title"); setActiveTool("font"); setStyleSheet(false); setColorPicker(false); }}
              style={{ cursor:"grab", padding:"5px 7px", borderRadius:4, border:selectedEl==="title"?"1.5px solid #7B3FC9":"1.5px solid transparent", transform:`translate(${titlePos.x}px,${titlePos.y}px)`, touchAction:"none", userSelect:"none", position:"relative", zIndex:2 }}>
              <div style={{ fontSize:20, fontWeight:bold?900:700, color:selectedEl==="title"?textColor:"#3A2A15", textAlign:"center", fontStyle:italic?"italic":"normal", textDecoration:[underline?"underline":"",strike?"line-through":""].filter(Boolean).join(" ")||"none" }}>年末のご挨拶</div>
            </div>
            <div onClick={() => { setSelectedEl("body"); setActiveTool("font"); setStyleSheet(false); setColorPicker(false); }} style={{ cursor:"pointer", padding:"5px 7px", borderRadius:4, border:selectedEl==="body"?"1.5px solid #7B3FC9":"1.5px solid transparent" }}>
              <div style={{ fontSize:fontSize/4.2, color:selectedEl==="body"?textColor:"#5A4A35", textAlign:"center", lineHeight:1.65 }}>今年も大変お世話になりました<br/>来年も笑顔で会えますように<br/>良いお年をお迎えください</div>
            </div>
            <div style={{ marginTop:"auto", fontSize:10, color:"#888", textAlign:"center" }}>J Spa &amp; Massage</div>
          </div>
          {selectedEl && (
            <div style={{ position:"absolute", top:"33%", left:"50%", transform:"translateX(-50%)", background:"#fff", borderRadius:28, padding:"7px 12px", display:"flex", gap:14, boxShadow:"0 4px 16px rgba(0,0,0,.2)", zIndex:10, whiteSpace:"nowrap" }}>
              {[{icon:"🌀",t:"AI"},{icon:"✏️",t:"編集"},{icon:"↩",t:"置換"},{icon:"⊕",t:"追加"},{icon:"🗑",t:"削除"},{icon:"⋯",t:"その他"}].map(({icon,t}) => (
                <span key={t} title={t} style={{ fontSize:16, cursor:"pointer" }}>{icon}</span>
              ))}
            </div>
          )}
          {selectedEl==="title" && (
            <div style={{ position:"absolute", bottom:-26, left:"50%", transform:"translateX(-50%)", fontSize:11, color:"#888", whiteSpace:"nowrap" }}>☜ ドラッグで位置を移動</div>
          )}
        </div>
      </div>

      {/* ページストリップ */}
      <div style={{ background:"#E0E0E0", padding:"6px 12px", display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
        <div style={{ width:44, height:60, background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)", borderRadius:5, border:`2px solid ${P}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>1</div>
        <div style={{ width:44, height:60, background:"#fff", borderRadius:5, border:"1px solid #ccc", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#aaa", cursor:"pointer" }}>＋</div>
      </div>

      {/* ツールバー（テキスト・ペン・消しゴム・スタンプ・【画像挿入】・【背景入替】・取消） */}
      <div style={{ background:"#0f0f1a", padding:"7px 10px", display:"flex", gap:4, alignItems:"center", flexShrink:0 }}>
        {[
          {ic:"T",  id:"txt",   label:"テキスト",  accent:false},
          {ic:"✏",  id:"pen",   label:"ペン",      accent:false},
          {ic:"◻",  id:"erase", label:"消しゴム",  accent:false},
          {ic:"★",  id:"stamp", label:"スタンプ",  accent:false},
          {ic:"🖼",  id:"imgadd",label:"画像挿入",  accent:true},
          {ic:"🔄",  id:"bgswap",label:"背景入替",  accent:true},
          {ic:"↩",  id:"undo",  label:"取消",      accent:false},
        ].map(({ic,id,label,accent}) => (
          <div key={id} title={label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", flex:1, maxWidth:46 }}>
            <div style={{ width:34, height:34, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, border: accent ? "1px solid rgba(29,158,117,.5)" : "none",
              background: id==="txt" ? "rgba(123,63,201,.3)" : accent ? "rgba(29,158,117,.18)" : "rgba(255,255,255,.07)",
              color: id==="txt" ? "#9B6FE8" : accent ? "#1D9E75" : "rgba(255,255,255,.75)" }}>{ic}</div>
            <div style={{ fontSize:7, color:"rgba(255,255,255,.4)", whiteSpace:"nowrap" }}>{label}</div>
          </div>
        ))}
        <div style={{ flex:1 }}/>
        <div onClick={() => setScreen("loading")} style={{ width:36, height:36, borderRadius:8, background:P, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:"#fff", cursor:"pointer", fontWeight:700, flexShrink:0 }}>✓</div>
      </div>

      {/* 下部パネル */}
      <div style={{ background:"#fff", flexShrink:0, borderTop:"1px solid #eee" }}>
        {activeTool==="font" && (
          <div style={{ borderBottom:"1px solid #f0f0f0", padding:"9px 0" }}>
            <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"0 12px", scrollbarWidth:"none" }}>
              {fonts.map(f => (
                <div key={f} onClick={() => setSelectedFont(f)} style={{ flexShrink:0, padding:"8px 14px", borderRadius:20, border:`1.5px solid ${selectedFont===f?P:"#ddd"}`, background:selectedFont===f?"#F3EAFF":"#F7F7F7", fontSize:12, fontWeight:600, color:selectedFont===f?P:"#333", cursor:"pointer", whiteSpace:"nowrap" }}>{f}</div>
              ))}
            </div>
          </div>
        )}
        {activeTool==="size" && (
          <div style={{ borderBottom:"1px solid #f0f0f0", padding:"12px 18px" }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>フォントサイズ</div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1, position:"relative", height:4, background:"#eee", borderRadius:2 }}>
                <div style={{ position:"absolute", left:0, width:`${fontSize}%`, height:"100%", background:P, borderRadius:2 }}/>
                <input type="range" min={8} max={100} value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} style={{ position:"absolute", inset:"-8px 0", opacity:0, cursor:"pointer", width:"100%" }}/>
                <div style={{ position:"absolute", left:`${fontSize}%`, top:"50%", transform:"translate(-50%,-50%)", width:18, height:18, background:P, borderRadius:"50%", pointerEvents:"none" }}/>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, border:"1px solid #ddd", borderRadius:8, padding:"6px 10px" }}>
                <button onClick={() => setFontSize(v=>Math.max(8,v-1))} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer" }}>－</button>
                <span style={{ fontSize:14, fontWeight:700, minWidth:24, textAlign:"center" }}>{fontSize}</span>
                <button onClick={() => setFontSize(v=>Math.min(100,v+1))} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer" }}>＋</button>
              </div>
            </div>
          </div>
        )}
        {colorPicker && (
          <div style={{ borderBottom:"1px solid #f0f0f0", padding:"12px 14px" }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>テキストカラー</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {swatches.map(hex => (
                <div key={hex} onClick={() => setTextColor(hex)} style={{ width:30, height:30, borderRadius:"50%", background:hex, cursor:"pointer", border:textColor===hex?`3px solid ${P}`:"2px solid #ddd", flexShrink:0 }}/>
              ))}
            </div>
          </div>
        )}
        {activeTool==="format" && (
          <div style={{ borderBottom:"1px solid #f0f0f0", padding:"10px 14px", display:"flex", gap:8 }}>
            {[{label:"B",active:bold,onTap:()=>setBold(b=>!b),fw:900},{label:"I",active:italic,onTap:()=>setItalic(v=>!v)},{label:"U",active:underline,onTap:()=>setUnderline(v=>!v)},{label:"S",active:strike,onTap:()=>setStrike(v=>!v)}].map(btn=>(
              <button key={btn.label} onClick={btn.onTap} style={{ width:42, height:42, borderRadius:9, background:btn.active?"#F3EAFF":"#F5F5F5", border:`1.5px solid ${btn.active?P:"#ddd"}`, color:btn.active?P:"#333", fontSize:17, cursor:"pointer", fontWeight:btn.fw||600 }}>{btn.label}</button>
            ))}
          </div>
        )}
        {styleSheet && (
          <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#fff", borderRadius:"20px 20px 0 0", boxShadow:"0 -4px 20px rgba(0,0,0,.14)", zIndex:200, maxHeight:"50vh", overflowY:"auto" }}>
            <div style={{ width:36, height:4, background:"#ddd", borderRadius:2, margin:"12px auto 10px" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 18px 10px" }}>
              <span style={{ fontSize:15, fontWeight:700 }}>テキストスタイル</span>
              <button onClick={() => { setStyleSheet(false); setActiveTool(null); }} style={{ background:"none", border:"1.5px solid #ddd", borderRadius:"50%", width:28, height:28, cursor:"pointer" }}>✕</button>
            </div>
            {textStyles.map((st,i) => (
              <div key={st} onClick={() => { setStyleSheet(false); setActiveTool(null); }} style={{ padding:"12px 20px", borderBottom:"1px solid #f5f5f5", fontSize:i===0?20:i===1?16:i===2?14:12, fontWeight:i<=2?700:400, cursor:"pointer" }}>{st}</div>
            ))}
            <div style={{ height:24 }}/>
          </div>
        )}
        {/* ボトムタブ */}
        <div style={{ display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
          {bottomTools.map(t => (
            <div key={t.id} onClick={() => handleToolTap(t.id)} style={{ flex:"0 0 auto", padding:"10px 13px", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderBottom:activeTool===t.id?`2.5px solid ${P}`:"2.5px solid transparent", cursor:"pointer" }}>
              {t.id==="color"
                ? <div style={{ fontSize:14, fontWeight:900, color:activeTool==="color"?P:"#555", position:"relative" }}>A<div style={{ position:"absolute", bottom:-2, left:0, right:0, height:3, background:textColor, borderRadius:2 }}/></div>
                : <span style={{ fontSize:14, fontWeight:700, color:activeTool===t.id?P:"#555" }}>{t.icon}</span>
              }
              <span style={{ fontSize:8, color:activeTool===t.id?P:"#666", whiteSpace:"nowrap" }}>{t.label}</span>
            </div>
          ))}
          <div style={{ flex:"0 0 auto", padding:"8px 12px", display:"flex", alignItems:"center" }}>
            <div onClick={() => setScreen("loading")} style={{ width:32, height:32, borderRadius:"50%", border:"2px solid #ddd", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:15 }}>✓</div>
          </div>
        </div>
        <div style={{ height:16 }}/>
      </div>
    </div>
  );
}

// ══ Screen: Loading ════════════════════════════════════════════
function LoadingScreen({ setScreen }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#fff" }}>
      <div style={{ height:6, background:GRAD }}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", padding:"0 30px 60px" }}>
        <div style={{ width:200, height:140, background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)", borderRadius:12, marginBottom:30, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(123,63,201,0.1)" }}/>
          <div style={{ fontSize:28, fontWeight:900, color:"#3A2A15", fontFamily:"Georgia,serif", zIndex:1 }}>THANK YOU</div>
          <div style={{ fontSize:12, color:"#7B4A30", zIndex:1 }}>年末のご挨拶</div>
        </div>
        <div style={{ fontSize:22, fontWeight:900, marginBottom:10 }}>デザインを準備中です...</div>
        <div style={{ fontSize:14, color:"#555", marginBottom:40 }}>最後の仕上げを実行しています 😎</div>
        <div style={{ width:"100%", height:4, background:"#eee", borderRadius:2, marginBottom:40, overflow:"hidden" }}>
          <div style={{ width:"72%", height:"100%", background:GRAD, borderRadius:2 }}/>
        </div>
        <button onClick={() => setScreen("step5")} style={{ ...s.btnOutline, width:"100%" }}>キャンセル</button>
      </div>
    </div>
  );
}

// ══ Screen: Complete ═══════════════════════════════════════════
function CompleteScreen({ setScreen }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <div style={{ flex:"0 0 auto", background:"#EBEBEB", display:"flex", alignItems:"center", justifyContent:"center", padding:"10px 16px" }}>
        <div style={{ width:"100%", maxWidth:200, background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)", borderRadius:8, aspectRatio:"9/14", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"16px", border:`2px solid ${P}`, overflow:"hidden" }}>
          <div style={{ fontSize:28, fontWeight:900, color:"#3A2A15", fontFamily:"Georgia,serif", textAlign:"center", lineHeight:0.9, marginBottom:10 }}>THANK<br/>YOU</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#3A2A15", marginBottom:6 }}>年末のご挨拶</div>
          <div style={{ fontSize:9, color:"#5A4A35", textAlign:"center", lineHeight:1.6 }}>今年も大変お世話になりました<br/>来年も笑顔で会えますように<br/>良いお年をお迎えください</div>
        </div>
      </div>
      <div style={{ flex:1, background:GRAD, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"30px 28px 40px", position:"relative", overflow:"hidden" }}>
        {["🟡","🔴","🟢","🔵","🟠","🟣"].map((c,i) => (
          <div key={i} style={{ position:"absolute", top:`${8+i*12}%`, left:`${8+i*14}%`, fontSize:14, opacity:0.8, transform:`rotate(${i*30}deg)` }}>{c}</div>
        ))}
        <div style={{ fontSize:60, marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:24, fontWeight:900, color:"#fff", marginBottom:8, textAlign:"center" }}>カメラロールに保存しました</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,.8)", marginBottom:20 }}>30枚を保存しました</div>
        <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"16px 20px", marginBottom:24, textAlign:"center" }}>
          <div style={{ fontSize:13, color:"#fff", lineHeight:1.7, fontStyle:"italic" }}>「完璧とは、付け加えるものがないのではなく、<br/>取り除くものがないということだ」</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.8)", marginTop:8 }}>アントワーヌ・ド・サン=テグジュペリ</div>
        </div>
        <div style={{ display:"flex", gap:10, width:"100%", marginBottom:12 }}>
          <button onClick={() => setScreen("dashboard")} style={{ flex:1, padding:"16px", borderRadius:14, background:"rgba(255,255,255,.9)", color:P, fontSize:14, fontWeight:700, border:"none", cursor:"pointer" }}>⌂ TOPに戻る</button>
          <button onClick={() => setScreen("step5")} style={{ flex:1, padding:"16px", borderRadius:14, background:"rgba(255,255,255,.2)", color:"#fff", fontSize:14, fontWeight:700, border:"none", cursor:"pointer" }}>続けて編集</button>
        </div>
        <button style={{ width:"100%", padding:"14px", borderRadius:14, background:"rgba(255,255,255,.15)", color:"#fff", fontSize:14, fontWeight:700, border:"1.5px solid rgba(255,255,255,.4)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <span>🔗</span>友達に紹介する（URLをコピー）
        </button>
      </div>
    </div>
  );
}

// ══ Screen: Mypage ═════════════════════════════════════════════
function MypageScreen({ setScreen }) {
  return (
    <div style={{ ...s.scroll, padding:"16px 16px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16, padding:"12px 14px", background:"#F7F5FF", borderRadius:14 }}>
        <div style={{ width:48, height:48, borderRadius:"50%", background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:"#fff", fontWeight:700, flexShrink:0 }}>山</div>
        <div>
          <div style={{ fontSize:15, fontWeight:700 }}>山田 花子</div>
          <div style={{ fontSize:12, color:"#888", marginTop:2 }}>you@example.com</div>
        </div>
        <div style={{ marginLeft:"auto", border:`1px solid ${P}`, borderRadius:7, padding:"4px 10px", fontSize:11, color:P, cursor:"pointer" }}>編集</div>
      </div>
      <div style={{ ...s.sectionBox }}>
        <div style={s.sectionHead}><span>👤</span>アカウント情報</div>
        <div style={s.sectionBody}>
          {[["お名前","山田 花子"],["メールアドレス","you@example.com"]].map(([lb,v]) => (
            <div key={lb}>
              <div style={s.fieldLabel}>{lb}</div>
              <input style={s.inp} defaultValue={v}/>
            </div>
          ))}
          <div>
            <div style={s.fieldLabel}>パスワード</div>
            <div style={{ ...s.inp, color:P, textAlign:"center", cursor:"pointer" }}>パスワードを変更</div>
          </div>
        </div>
      </div>
      <div style={{ ...s.sectionBox }}>
        <div style={s.sectionHead}><span>💳</span>プラン・課金</div>
        <div style={s.sectionBody}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:12, color:"#888" }}>現在のプラン</div>
              <div style={{ fontSize:22, fontWeight:900, color:P }}>Pro</div>
            </div>
            <div style={{ background:"#DCFCE7", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:700, color:"#166534" }}>有効</div>
          </div>
          <div style={{ fontSize:12, color:"#888" }}>¥3,980/月 · 次回更新 2026.05.01</div>
          <UsageBar pct={USAGE_PCT}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div style={{ border:"1.5px solid #ddd", borderRadius:10, padding:"12px", textAlign:"center", fontSize:13, fontWeight:700, color:"#555", cursor:"pointer" }}>プラン変更</div>
            <div style={{ border:"1.5px solid #ddd", borderRadius:10, padding:"12px", textAlign:"center", fontSize:13, fontWeight:700, color:"#555", cursor:"pointer" }}>請求管理</div>
          </div>
          <div style={{ background:"#F5F3FF", border:"1.5px solid #DDD6FE", borderRadius:10, padding:"12px 14px", cursor:"pointer" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#7C3AED", marginBottom:4 }}>PDCA伴走プランへアップグレード</div>
            <div style={{ fontSize:11, color:"#6D28D9" }}>投稿レビュー・改善提案付き</div>
          </div>
          <div style={{ textAlign:"center", fontSize:12, color:"#E24B4A", cursor:"pointer", padding:"4px" }}>解約する（月末まで有効）</div>
        </div>
      </div>
      <div style={{ ...s.sectionBox }}>
        <div style={s.sectionHead}><span>⚙</span>アプリ設定</div>
        <div style={{ padding:"4px 0" }}>
          {["通知設定","プライバシーポリシー","利用規約"].map(item => (
            <div key={item} style={{ padding:"14px 16px", borderBottom:"1px solid #f5f5f5", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
              <span style={{ fontSize:14 }}>{item}</span><span style={{ fontSize:18, color:"#ccc" }}>›</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ border:"1.5px solid #FEE2E2", borderRadius:12, padding:"14px", textAlign:"center", background:"#FFF5F5", cursor:"pointer", marginTop:4 }} onClick={() => setScreen("login")}>
        <span style={{ fontSize:14, fontWeight:700, color:"#E24B4A" }}>ログアウト</span>
      </div>
    </div>
  );
}

// ══ Root ═══════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [showMenu, setShowMenu] = useState(false);

  const showBNav = ["dashboard","step5","history","mypage"].includes(screen);
  const hideGNav = false;

  return (
    <div style={s.app}>
      <GNav screen={screen} setScreen={setScreen} showMenu={showMenu} setShowMenu={setShowMenu}/>
      <SNav screen={screen}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {screen==="signup"    && <SignupScreen    setScreen={setScreen}/>}
        {screen==="login"     && <LoginScreen     setScreen={setScreen}/>}
        {screen==="verify"    && <VerifyScreen    setScreen={setScreen}/>}
        {screen==="dashboard" && <DashboardScreen setScreen={setScreen}/>}
        {screen==="step1a"    && <Step1aScreen    setScreen={setScreen}/>}
        {screen==="step1b"    && <Step1bScreen    setScreen={setScreen}/>}
        {screen==="step2"     && <Step2Screen     setScreen={setScreen}/>}
        {screen==="generating"&& <GeneratingScreen setScreen={setScreen}/>}
        {screen==="step3"     && <Step3Screen     setScreen={setScreen}/>}
        {screen==="step4"     && <Step4Screen     setScreen={setScreen}/>}
        {screen==="bgselect"  && <BgSelectScreen  setScreen={setScreen}/>}
        {screen==="step5"     && <Step5Screen     setScreen={setScreen}/>}
        {screen==="editor"    && <EditorScreen    setScreen={setScreen}/>}
        {screen==="loading"   && <LoadingScreen   setScreen={setScreen}/>}
        {screen==="complete"  && <CompleteScreen  setScreen={setScreen}/>}
        {screen==="mypage"    && <MypageScreen    setScreen={setScreen}/>}
        {screen==="history"   && <DashboardScreen setScreen={setScreen}/>}
      </div>
      {showBNav && <BNav screen={screen} setScreen={setScreen}/>}
      {showMenu && <MenuOverlay onClose={() => setShowMenu(false)} setScreen={setScreen}/>}
    </div>
  );
}
