import { useState } from "react";

const GRAD = "linear-gradient(135deg, #00C9B1 0%, #4A6CF7 50%, #8B2FC9 100%)";
const SITUATIONS = [
  { label:"赤ちゃんとの日常", emoji:"👶", bg:"#FFF0F5" },
  { label:"ライブ告知",        emoji:"📣", bg:"#EEF3FF" },
  { label:"仲間とのふれあい",  emoji:"🤝", bg:"#F0FFF4" },
  { label:"不安・驚き",        emoji:"😨", bg:"#F5F0FF" },
  { label:"盛り上がり",         emoji:"🔥", bg:"#FFF5F0" },
];
const MOODS = ["カジュアル","寄り添い","おもしろ","真面目","驚き","煽り"];

// ─── Global nav ────────────────────────────────────────────────────────
function GradientHeader({ screen, setScreen }) {
  const canBack = screen > 0;
  const canFwd  = screen < 4;
  return (
    <div style={{ background: GRAD, padding: "14px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", gap: 20 }}>
        {/* Home */}
        <span onClick={() => setScreen(0)} style={{ fontSize: 22, color: "#fff", cursor: "pointer", opacity: 0.95 }}>⌂</span>
        {/* Back */}
        <span onClick={() => canBack && setScreen(s => s - 1)} style={{ fontSize: 22, color: "#fff", cursor: canBack ? "pointer" : "default", opacity: canBack ? 0.9 : 0.3 }}>↩</span>
        {/* Forward */}
        <span onClick={() => canFwd && setScreen(s => s + 1)} style={{ fontSize: 22, color: "#fff", cursor: canFwd ? "pointer" : "default", opacity: canFwd ? 0.9 : 0.3 }}>↪</span>
      </div>
      {/* Download only */}
      <span style={{ fontSize: 22, color: "#fff", opacity: 0.9, cursor: "pointer" }}>⬇</span>
    </div>
  );
}

// ─── Screen nav (black) ───────────────────────────────────────────────
function ScreenNav({ screen, setScreen }) {
  const labels = ["①テンプレート","②グリッド","③エディター","④ローディング","⑤完了"];
  return (
    <div style={{ background:"#111", padding:"6px 10px", display:"flex", gap:4, overflowX:"auto", flexShrink:0 }}>
      {labels.map((n,i) => (
        <button key={i} onClick={() => setScreen(i)} style={{ flexShrink:0, padding:"4px 10px", borderRadius:20, fontSize:10, fontWeight:600, border:"none", cursor:"pointer", background:screen===i?"#7B3FC9":"#333", color:"#fff" }}>{n}</button>
      ))}
    </div>
  );
}

function BottomNav() {
  return (
    <div style={{ borderTop:"1px solid #eee", background:"#fff", display:"flex", justifyContent:"space-around", padding:"10px 0 20px", flexShrink:0 }}>
      {[{icon:"＋",l:"作成"},{icon:"🗂",l:"プロジェクト"},{icon:"▦",l:"テンプレート",a:true},{icon:"⋯",l:"もっと見る"}].map(it => (
        <div key={it.l} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
          <span style={{ fontSize:20, color:it.a?"#7B3FC9":"#888" }}>{it.icon}</span>
          <span style={{ fontSize:10, color:it.a?"#7B3FC9":"#888", fontWeight:it.a?700:400 }}>{it.l}</span>
        </div>
      ))}
    </div>
  );
}

function StoryCard({ bg, emoji, lines, onClick }) {
  return (
    <div onClick={onClick} style={{ flexShrink:0, width:90, aspectRatio:"9/16", background:bg, borderRadius:14, overflow:"hidden", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.08)", display:"flex", flexDirection:"column", padding:"10px 8px 8px" }}>
      <div style={{ fontSize:20, marginBottom:6 }}>{emoji}</div>
      {(lines||[]).map((l,i) => (
        <div key={i} style={{ fontSize:l.size||9, fontWeight:l.bold?800:500, color:l.color||"#222", lineHeight:1.35, marginBottom:2, whiteSpace:"pre-line" }}>{l.text}</div>
      ))}
    </div>
  );
}

// ══ Screen 1 ══════════════════════════════════════════════════════════
function TemplateScreen({ next }) {
  const sitCards = [
    { bg:"#FFF0F5", emoji:"👶", lines:[{text:"生後3ヶ月\n立ってる🤣",bold:true,size:10}] },
    { bg:"#1a1a2e", emoji:"📣", lines:[{text:"INSTA LIVE",bold:true,size:9,color:"#7B8BF7"},{text:"2/13(金)21:30〜",size:7,color:"#fff"}] },
    { bg:"#F0FFF4", emoji:"🤝", lines:[{text:"仲間と一緒に",size:9,bold:true},{text:"楽しく働く💚",size:8}] },
    { bg:"#1a1a1a", emoji:"😨", lines:[{text:"もしも…",bold:true,size:11,color:"#fff"},{text:"将来に不安が",size:7,color:"#aaa"}] },
    { bg:"#FFF5F0", emoji:"🔥", lines:[{text:"激ヤバ企画！",bold:true,size:9},{text:"年に一度の",size:8,color:"#888"}] },
  ];
  const recCards = [
    { bg:"#FFF0F5", emoji:"👶", label:"赤ちゃんとの日常" },
    { bg:"#1a1a2e", emoji:"📣", label:"ライブ告知" },
    { bg:"#F0FFF4", emoji:"🤝", label:"仲間とのふれあい" },
    { bg:"#1a1a1a", emoji:"😨", label:"不安・驚き" },
  ];
  return (
    <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
      <div style={{ background:"linear-gradient(160deg,#E8E0F8 0%,#D8E8FF 60%,#fff 100%)", padding:"20px 20px 0" }}>
        <div style={{ width:44,height:44,borderRadius:"50%",background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:18,marginBottom:18,position:"relative" }}>
          n<div style={{ position:"absolute",top:0,right:0,width:12,height:12,background:"#E53935",borderRadius:"50%",border:"2px solid #fff" }} />
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
          <span style={{ fontSize:26,fontWeight:900 }}>ストーリーズ</span>
          <div style={{ width:28,height:28,borderRadius:"50%",border:"1.5px solid #ccc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>▾</div>
        </div>
        <div style={{ background:"#fff",borderRadius:50,padding:"12px 18px",display:"flex",alignItems:"center",gap:10,marginBottom:18,boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize:18,opacity:0.4 }}>🔍</span>
          <span style={{ fontSize:14,color:"#aaa" }}>シチュエーションを検索</span>
        </div>
      </div>
      <div style={{ padding:"20px 20px 28px" }}>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:17,fontWeight:800,marginBottom:14 }}>シチュエーションから選ぶ</div>
          <div style={{ display:"flex",gap:12,overflowX:"auto",paddingBottom:8 }}>
            {sitCards.map((c,i) => (
              <div key={i} style={{ flexShrink:0,textAlign:"center" }}>
                <StoryCard {...c} onClick={next} />
                <div style={{ fontSize:10,color:"#444",marginTop:6,lineHeight:1.3,maxWidth:90 }}>{SITUATIONS[i].label}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:17,fontWeight:800,marginBottom:14 }}>あなたへのおすすめ</div>
          <div style={{ display:"flex",gap:10,overflowX:"auto",paddingBottom:4 }}>
            {recCards.map((c,i) => (
              <div key={i} onClick={next} style={{ flexShrink:0,width:80,cursor:"pointer" }}>
                <div style={{ width:80,aspectRatio:"9/16",background:c.bg,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,boxShadow:"0 2px 8px rgba(0,0,0,0.07)" }}>
                  <span style={{ fontSize:22 }}>{c.emoji}</span>
                </div>
                <div style={{ fontSize:10,color:"#555",marginTop:5,lineHeight:1.3,textAlign:"center" }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══ Screen 2: Grid — mood chips ════════════════════════════════════════
function GridScreen({ next }) {
  const [mood, setMood] = useState("カジュアル");
  const allCards = [
    { bg:"#FFF0F5",emoji:"👶",mood:"カジュアル",lines:[{text:"生後3ヶ月\n立ってる🤣",bold:true,size:9}] },
    { bg:"#fff3e0",emoji:"🤣",mood:"おもしろ",  lines:[{text:"パパよ…🤣",bold:true,size:11}] },
    { bg:"#1a1a2e",emoji:"📣",mood:"真面目",    lines:[{text:"INSTA LIVE",bold:true,size:9,color:"#7B8BF7"},{text:"2/13 21:30〜",size:7,color:"#fff"}] },
    { bg:"#e8f5e9",emoji:"🤝",mood:"寄り添い",  lines:[{text:"仲間と一緒に",size:9},{text:"頑張ってます💚",size:8,color:"#444"}] },
    { bg:"#1a1a1a",emoji:"😨",mood:"驚き",      lines:[{text:"もしも…",bold:true,size:11,color:"#fff"},{text:"将来に不安が",size:7,color:"#aaa"}] },
    { bg:"#FFF5F0",emoji:"🔥",mood:"煽り",      lines:[{text:"激ヤバ企画です",bold:true,size:9}] },
    { bg:"#f3e5f5",emoji:"✨",mood:"カジュアル",lines:[{text:"大切な家族が\n増えた今",size:9}] },
    { bg:"#e3f2fd",emoji:"💬",mood:"寄り添い",  lines:[{text:"どんな人生に\nしたい？",size:9}] },
    { bg:"#fff9c4",emoji:"💡",mood:"おもしろ",  lines:[{text:"無知なママには\nならない！",size:9}] },
    { bg:"#fce4ec",emoji:"❤️",mood:"驚き",      lines:[{text:"それを教えて\nくれたのが",size:9}] },
    { bg:"#e8eaf6",emoji:"📚",mood:"真面目",    lines:[{text:"お金の勉強会",bold:true,size:9},{text:"2/13(金)21:30〜",size:7,color:"#555"}] },
    { bg:"#f9fbe7",emoji:"🌿",mood:"寄り添い",  lines:[{text:"寂しそうな時は\nそばに",size:8}] },
    { bg:"#ff8a65",emoji:"🚨",mood:"煽り",      lines:[{text:"⚠️緊急事態",bold:true,size:10,color:"#fff"},{text:"アカ消えるかも",size:7,color:"#fff"}] },
    { bg:"#b2dfdb",emoji:"😎",mood:"カジュアル",lines:[{text:"ついにだぁ😎",bold:true,size:11}] },
    { bg:"#4a148c",emoji:"🎉",mood:"煽り",      lines:[{text:"年に一度の\n激ヤバ！",bold:true,size:9,color:"#fff"}] },
  ];
  const filtered = allCards.filter(c => c.mood === mood);
  return (
    <div style={{ flex:1, overflowY:"auto", background:"#F5F5F7" }}>
      {/* Mood chips */}
      <div style={{ background:"#fff", padding:"14px 16px 0", boxShadow:"0 1px 0 #eee" }}>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:14, WebkitOverflowScrolling:"touch", scrollbarWidth:"none" }}>
          {MOODS.map(m => (
            <div key={m} onClick={() => setMood(m)} style={{ flexShrink:0, padding:"7px 18px", borderRadius:22, border:`1.5px solid ${mood===m?"#7B3FC9":"#ddd"}`, background:mood===m?"#7B3FC9":"#fff", color:mood===m?"#fff":"#444", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>{m}</div>
          ))}
        </div>
      </div>
      {/* Grid */}
      <div style={{ padding:"14px 12px 24px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        <div style={{ background:"#fff",borderRadius:12,aspectRatio:"9/16",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize:22,color:"#aaa" }}>＋</span>
          <span style={{ fontSize:9,color:"#aaa",textAlign:"center",lineHeight:1.3 }}>空のデザインを作成</span>
        </div>
        {filtered.map((c,i) => (
          <div key={i} onClick={next} style={{ background:c.bg,borderRadius:12,aspectRatio:"9/16",position:"relative",cursor:"pointer",overflow:"hidden",padding:"10px 8px",display:"flex",flexDirection:"column",boxShadow:"0 2px 8px rgba(0,0,0,0.07)" }}>
            <div style={{ position:"absolute",top:6,right:6,width:22,height:22,background:"rgba(255,255,255,0.85)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10 }}>⋯</div>
            <div style={{ fontSize:16,marginBottom:4 }}>{c.emoji}</div>
            {c.lines.map((l,j) => (
              <div key={j} style={{ fontSize:l.size||8,fontWeight:l.bold?800:500,color:l.color||"#222",lineHeight:1.3,whiteSpace:"pre-line",marginBottom:2 }}>{l.text}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ Screen 3: Editor ════════════════════════════════════════════════════
function EditorScreen({ next }) {
  const [selectedEl, setSelectedEl] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [fontSize, setFontSize] = useState(39);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strike, setStrike] = useState(false);
  const [textColor, setTextColor] = useState("#3A2A15");
  const [selectedFont, setSelectedFont] = useState("851チカラヅヨク");
  const [styleSheet, setStyleSheet] = useState(false);
  const [colorPicker, setColorPicker] = useState(false);

  const fonts = ["851チカラヅヨク","AR Gyokaisho","AR Pcrystal","Noto Serif JP","ヒラギノ明朝","游明朝","源ノ角ゴシック","M PLUS 1p","Kosugi Maru","Sawarabi Mincho"];
  const textStyles = ["タイトル","サブタイトル","見出し","小見出し","セクションのヘッダー","本文"];
  const swatches = ["#000000","#3A2A15","#5A4A35","#FFFFFF","#F5F0E8","#E53935","#F9A8C0","#FC8181","#FF8A65","#FFF5F0","#7B3FC9","#7B8BF7","#4A6CF7","#00C9B1","#68D391","#1a1a2e","#1a1a1a","#4a148c","#888888","#EEEEEE"];
  const bottomTools = [
    {id:"edit",icon:"⌨",label:"編集"},
    {id:"font",icon:"Ff",label:"フォント"},
    {id:"style",icon:"H",label:"テキストスタイル"},
    {id:"size",icon:"AA",label:"フォントサイズ"},
    {id:"color",icon:"A",label:"カラー"},
    {id:"format",icon:"B",label:"フォーマット"},
    {id:"detail",icon:"↕",label:"詳細"},
    {id:"effect",icon:"◻",label:"エフェクト"},
    {id:"anim",icon:"◎",label:"アニメーション"},
    {id:"opacity",icon:"⠿",label:"透明度"},
    {id:"layer",icon:"⧉",label:"レイヤー"},
  ];
  const handleToolTap = (id) => {
    setStyleSheet(false); setColorPicker(false);
    if (id==="style") { setStyleSheet(true); setActiveTool("style"); return; }
    if (id==="color") { setColorPicker(true); setActiveTool("color"); return; }
    setActiveTool(prev => prev===id ? null : id);
  };

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",background:"#EBEBEB",overflow:"hidden" }}>
      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"14px 16px",overflow:"hidden" }}>
        <div style={{ position:"relative",width:"100%",maxWidth:310 }}>
          <div style={{ background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)",borderRadius:10,aspectRatio:"9/16",overflow:"hidden",display:"flex",flexDirection:"column",padding:"30px 22px 18px",gap:8,border:selectedEl?"2px solid #7B3FC9":"2px solid transparent" }}>
            <div style={{ fontSize:52,fontWeight:900,color:"#3A2A15",lineHeight:0.9,textAlign:"center",fontFamily:"Georgia,serif",letterSpacing:-2,marginBottom:8 }}>THANK<br/>YOU</div>
            <div style={{ fontSize:44,opacity:0.45,alignSelf:"flex-start",marginLeft:-10,marginBottom:6 }}>🌿</div>
            <div onClick={()=>{setSelectedEl("title");setActiveTool("font");setStyleSheet(false);setColorPicker(false);}} style={{ cursor:"pointer",padding:"6px 8px",borderRadius:4,border:selectedEl==="title"?"1.5px solid #7B3FC9":"1.5px solid transparent" }}>
              <div style={{ fontSize:22,fontWeight:bold?900:700,color:selectedEl==="title"?textColor:"#3A2A15",textAlign:"center",fontStyle:italic?"italic":"normal",textDecoration:[underline?"underline":"",strike?"line-through":""].filter(Boolean).join(" ")||"none" }}>年末のご挨拶</div>
            </div>
            <div onClick={()=>{setSelectedEl("body");setActiveTool("font");setStyleSheet(false);setColorPicker(false);}} style={{ cursor:"pointer",padding:"6px 8px",borderRadius:4,border:selectedEl==="body"?"1.5px solid #7B3FC9":"1.5px solid transparent" }}>
              <div style={{ fontSize:fontSize/3.8,color:selectedEl==="body"?textColor:"#5A4A35",textAlign:"center",lineHeight:1.7 }}>今年も大変お世話になりました<br/>来年も笑顔で会えますように<br/>良いお年をお迎えください</div>
            </div>
            <div style={{ marginTop:"auto",fontSize:11,color:"#888",textAlign:"center" }}>J Spa &amp; Massage</div>
          </div>
          {selectedEl && (
            <div style={{ position:"absolute",top:"35%",left:"50%",transform:"translateX(-50%)",background:"#fff",borderRadius:30,padding:"8px 14px",display:"flex",gap:16,boxShadow:"0 4px 16px rgba(0,0,0,0.18)",zIndex:10 }}>
              {[{icon:"🌀",t:"AI"},{icon:"✏️",t:"編集"},{icon:"↩",t:"置換"},{icon:"⊕",t:"追加"},{icon:"🗑",t:"削除"},{icon:"⋯",t:"その他"}].map(({icon,t})=>(
                <span key={t} title={t} style={{ fontSize:17,cursor:"pointer" }}>{icon}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Page strip */}
      <div style={{ background:"#E0E0E0",padding:"7px 14px",display:"flex",gap:10,alignItems:"center",flexShrink:0 }}>
        <div style={{ width:48,height:66,background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)",borderRadius:6,border:"2px solid #7B3FC9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>1</div>
        <div style={{ width:48,height:66,background:"#fff",borderRadius:6,border:"1px solid #ccc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#aaa",cursor:"pointer" }}>＋</div>
      </div>
      {/* Bottom panel */}
      <div style={{ background:"#fff",flexShrink:0,borderTop:"1px solid #eee" }}>
        {activeTool==="font" && (
          <div style={{ borderBottom:"1px solid #f0f0f0",padding:"10px 0" }}>
            <div style={{ display:"flex",gap:10,overflowX:"auto",padding:"0 14px",WebkitOverflowScrolling:"touch",scrollbarWidth:"none" }}>
              {fonts.map(f => (
                <div key={f} onClick={()=>setSelectedFont(f)} style={{ flexShrink:0,padding:"9px 16px",borderRadius:22,border:`1.5px solid ${selectedFont===f?"#7B3FC9":"#ddd"}`,background:selectedFont===f?"#F3EAFF":"#F7F7F7",fontSize:13,fontWeight:600,color:selectedFont===f?"#7B3FC9":"#333",cursor:"pointer",whiteSpace:"nowrap" }}>{f}</div>
              ))}
            </div>
          </div>
        )}
        {activeTool==="size" && (
          <div style={{ borderBottom:"1px solid #f0f0f0",padding:"14px 20px" }}>
            <div style={{ fontSize:13,fontWeight:600,marginBottom:12 }}>フォントサイズ</div>
            <div style={{ display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ flex:1,position:"relative",height:4,background:"#eee",borderRadius:2 }}>
                <div style={{ position:"absolute",left:0,width:`${fontSize}%`,height:"100%",background:"#7B3FC9",borderRadius:2 }} />
                <input type="range" min={8} max={100} value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} style={{ position:"absolute",inset:"-8px 0",opacity:0,cursor:"pointer",width:"100%" }} />
                <div style={{ position:"absolute",left:`${fontSize}%`,top:"50%",transform:"translate(-50%,-50%)",width:20,height:20,background:"#7B3FC9",borderRadius:"50%",pointerEvents:"none" }} />
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:10,border:"1px solid #ddd",borderRadius:8,padding:"7px 12px" }}>
                <button onClick={()=>setFontSize(s=>Math.max(8,s-1))} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer" }}>－</button>
                <span style={{ fontSize:15,fontWeight:700,minWidth:28,textAlign:"center" }}>{fontSize}</span>
                <button onClick={()=>setFontSize(s=>Math.min(100,s+1))} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer" }}>＋</button>
              </div>
            </div>
          </div>
        )}
        {colorPicker && (
          <div style={{ borderBottom:"1px solid #f0f0f0",padding:"14px 16px" }}>
            <div style={{ fontSize:13,fontWeight:600,marginBottom:10 }}>テキストカラー</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
              {swatches.map(hex => (
                <div key={hex} onClick={()=>setTextColor(hex)} style={{ width:32,height:32,borderRadius:"50%",background:hex,cursor:"pointer",border:textColor===hex?"3px solid #7B3FC9":"2px solid #ddd",boxShadow:"0 1px 4px rgba(0,0,0,0.12)",flexShrink:0 }} />
              ))}
            </div>
          </div>
        )}
        {activeTool==="format" && (
          <div style={{ borderBottom:"1px solid #f0f0f0",padding:"12px 16px",display:"flex",gap:10 }}>
            {[{label:"B",active:bold,onTap:()=>setBold(b=>!b),fw:900},{label:"I",active:italic,onTap:()=>setItalic(v=>!v),fi:"italic"},{label:"U",active:underline,onTap:()=>setUnderline(v=>!v),td:"underline"},{label:"S",active:strike,onTap:()=>setStrike(v=>!v),td2:"line-through"}].map(btn=>(
              <button key={btn.label} onClick={btn.onTap} style={{ width:44,height:44,borderRadius:10,background:btn.active?"#F3EAFF":"#F5F5F5",border:`1.5px solid ${btn.active?"#7B3FC9":"#ddd"}`,color:btn.active?"#7B3FC9":"#333",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:btn.fw||600,fontStyle:btn.fi||"normal",textDecoration:btn.td||btn.td2||"none" }}>{btn.label}</button>
            ))}
          </div>
        )}
        {styleSheet && (
          <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderRadius:"20px 20px 0 0",boxShadow:"0 -4px 20px rgba(0,0,0,0.14)",zIndex:200,maxHeight:"55vh",overflowY:"auto" }}>
            <div style={{ width:36,height:4,background:"#ddd",borderRadius:2,margin:"14px auto 12px" }} />
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 20px 12px" }}>
              <span style={{ fontSize:16,fontWeight:700 }}>テキストスタイル</span>
              <button onClick={()=>{setStyleSheet(false);setActiveTool(null)}} style={{ background:"none",border:"1.5px solid #ddd",borderRadius:"50%",width:30,height:30,cursor:"pointer" }}>✕</button>
            </div>
            {textStyles.map((s,i) => (
              <div key={s} onClick={()=>{setStyleSheet(false);setActiveTool(null)}} style={{ padding:"14px 24px",borderBottom:"1px solid #f5f5f5",fontSize:i===0?22:i===1?17:i===2?14:12,fontWeight:i<=2?700:400,cursor:"pointer" }}>{s}</div>
            ))}
            <div style={{ height:30 }} />
          </div>
        )}
        {/* Tool tabs */}
        <div style={{ display:"flex",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none" }}>
          {bottomTools.map(t => (
            <div key={t.id} onClick={()=>handleToolTap(t.id)} style={{ flex:"0 0 auto",padding:"11px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,borderBottom:activeTool===t.id?"2.5px solid #7B3FC9":"2.5px solid transparent",cursor:"pointer" }}>
              {t.id==="color"
                ? <div style={{ fontSize:15,fontWeight:900,color:activeTool==="color"?"#7B3FC9":"#555",position:"relative" }}>A<div style={{ position:"absolute",bottom:-2,left:0,right:0,height:3,background:textColor,borderRadius:2 }} /></div>
                : <span style={{ fontSize:15,fontWeight:700,color:activeTool===t.id?"#7B3FC9":"#555" }}>{t.icon}</span>
              }
              <span style={{ fontSize:9,color:activeTool===t.id?"#7B3FC9":"#666",whiteSpace:"nowrap" }}>{t.label}</span>
            </div>
          ))}
          <div style={{ flex:"0 0 auto",padding:"8px 14px",display:"flex",alignItems:"center" }}>
            <div onClick={next} style={{ width:36,height:36,borderRadius:"50%",border:"2px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18 }}>✓</div>
          </div>
        </div>
        <div style={{ height:20 }} />
      </div>
    </div>
  );
}

// ══ Screen 4: Loading ══════════════════════════════════════════════════
function LoadingScreen({ next }) {
  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",background:"#fff" }}>
      <div style={{ height:6,background:GRAD }} />
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:"0 30px 60px" }}>
        <div style={{ width:200,height:140,background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)",borderRadius:12,marginBottom:30,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",inset:0,background:"rgba(123,63,201,0.1)" }} />
          <div style={{ fontSize:28,fontWeight:900,color:"#3A2A15",fontFamily:"Georgia,serif",zIndex:1 }}>THANK YOU</div>
          <div style={{ fontSize:12,color:"#7B4A30",zIndex:1 }}>年末のご挨拶</div>
        </div>
        <div style={{ fontSize:22,fontWeight:900,marginBottom:10 }}>デザインを準備中です...</div>
        <div style={{ fontSize:14,color:"#555",marginBottom:40 }}>最後の仕上げを実行しています 😎</div>
        <div style={{ width:"100%",height:4,background:"#eee",borderRadius:2,marginBottom:40,overflow:"hidden" }}>
          <div style={{ width:"72%",height:"100%",background:GRAD,borderRadius:2 }} />
        </div>
        <button onClick={next} style={{ width:"100%",padding:"16px",border:"1.5px solid #ccc",borderRadius:14,fontSize:16,background:"#fff",cursor:"pointer" }}>キャンセル</button>
      </div>
    </div>
  );
}

// ══ Screen 5: Complete ═════════════════════════════════════════════════
function CompleteScreen({ restart }) {
  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column" }}>
      <div style={{ flex:"0 0 auto",background:"#EBEBEB",display:"flex",alignItems:"center",justifyContent:"center",padding:"10px 16px" }}>
        <div style={{ width:"100%",maxWidth:200,background:"linear-gradient(160deg,#F5F0E8,#E8E0D0)",borderRadius:8,aspectRatio:"9/14",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px",border:"2px solid #7B3FC9",overflow:"hidden" }}>
          <div style={{ fontSize:28,fontWeight:900,color:"#3A2A15",fontFamily:"Georgia,serif",textAlign:"center",lineHeight:0.9,marginBottom:10 }}>THANK<br/>YOU</div>
          <div style={{ fontSize:12,fontWeight:700,color:"#3A2A15",marginBottom:6 }}>年末のご挨拶</div>
          <div style={{ fontSize:9,color:"#5A4A35",textAlign:"center",lineHeight:1.6 }}>今年も大変お世話になりました<br/>来年も笑顔で会えますように<br/>良いお年をお迎えください</div>
        </div>
      </div>
      <div style={{ flex:1,background:"linear-gradient(160deg,#00C9B1 0%,#4A6CF7 40%,#8B2FC9 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 28px 40px",position:"relative",overflow:"hidden" }}>
        {["🟡","🔴","🟢","🔵","🟠","🟣"].map((c,i) => (
          <div key={i} style={{ position:"absolute",top:`${8+i*12}%`,left:`${8+i*14}%`,fontSize:14,opacity:0.8,transform:`rotate(${i*30}deg)` }}>{c}</div>
        ))}
        <div style={{ fontSize:60,marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:24,fontWeight:900,color:"#fff",marginBottom:20,textAlign:"center" }}>カメラロールに保存しました</div>
        <div style={{ background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"16px 20px",marginBottom:24,textAlign:"center" }}>
          <div style={{ fontSize:13,color:"#fff",lineHeight:1.7,fontStyle:"italic" }}>「完璧とは、付け加えるものがないのではなく、<br/>取り除くものがないということだ」</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:8 }}>アントワーヌ・ド・サン=テグジュペリ</div>
        </div>
        <button onClick={restart} style={{ width:"100%",padding:"18px",borderRadius:14,background:"linear-gradient(135deg,#7B3FC9,#C060C0)",color:"#fff",fontSize:16,fontWeight:700,border:"none",cursor:"pointer" }}>このデザインを共有</button>
      </div>
    </div>
  );
}

// ══ Root ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState(0);
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'Helvetica Neue','Hiragino Sans','Yu Gothic',sans-serif" }}>
      <GradientHeader screen={screen} setScreen={setScreen} />
      <ScreenNav screen={screen} setScreen={setScreen} />
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        {screen===0 && <TemplateScreen next={()=>setScreen(1)} />}
        {screen===1 && <GridScreen next={()=>setScreen(2)} />}
        {screen===2 && <EditorScreen next={()=>setScreen(3)} />}
        {screen===3 && <LoadingScreen next={()=>setScreen(4)} />}
        {screen===4 && <CompleteScreen restart={()=>setScreen(0)} />}
      </div>
      {screen<=1 && <BottomNav />}
    </div>
  );
}
