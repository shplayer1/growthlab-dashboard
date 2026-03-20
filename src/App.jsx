import { useState, useRef, useEffect } from "react";

// ─── PERSISTENT STORAGE ──────────────────────────────────────────────────────
const DB = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --ink:#0d0f14;
  --ink2:#161a22;
  --ink3:#1e2330;
  --border:#252d3d;
  --border2:#2e3850;
  --lo:#00ff87;
  --lo2:#00c96a;
  --hi:#ff4d6d;
  --hi2:#ff8c00;
  --blue:#4d9fff;
  --purple:#b06aff;
  --text:#e8edf5;
  --text2:#8b96aa;
  --text3:#4a5468;
  --mono:'JetBrains Mono',monospace;
  --display:'Bebas Neue',sans-serif;
  --body:'Outfit',sans-serif;
}

html,body,#root{height:100%;background:var(--ink);color:var(--text);font-family:var(--body)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* ─── AUTH ─── */
@keyframes floatIn{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.7;transform:scale(1.05)}}

.auth-wrap{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:#0a0c11;padding:20px;overflow:hidden;position:relative;
}
.auth-wrap::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 50% at 20% 20%,rgba(0,255,135,0.06) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(77,159,255,0.05) 0%,transparent 60%),radial-gradient(ellipse 40% 60% at 50% -10%,rgba(0,255,135,0.1) 0%,transparent 70%);
  pointer-events:none;
}
.auth-wrap::after{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(0,255,135,0.03) 1px,transparent 1px);
  background-size:32px 32px;pointer-events:none;
}
.auth-glow{
  position:absolute;top:-200px;left:50%;transform:translateX(-50%);
  width:600px;height:600px;
  background:radial-gradient(circle,rgba(0,255,135,0.08) 0%,transparent 70%);
  pointer-events:none;animation:pulse 4s ease-in-out infinite;
}
.auth-box{
  width:100%;max-width:440px;
  background:rgba(22,26,34,0.9);border:1px solid rgba(37,45,61,0.8);
  border-radius:24px;padding:44px 40px;
  box-shadow:0 0 0 1px rgba(0,255,135,0.05),0 0 80px rgba(0,255,135,0.06),0 32px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.04);
  backdrop-filter:blur(20px);position:relative;z-index:1;
  animation:floatIn .5s cubic-bezier(.16,1,.3,1) both;
}
.auth-box::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,135,0.3),rgba(77,159,255,0.2),transparent);
  border-radius:24px 24px 0 0;
}
.auth-logo{
  font-family:var(--display);font-size:34px;letter-spacing:3px;
  background:linear-gradient(135deg,#00ff87 0%,#00e87a 50%,#00c96a 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  margin-bottom:4px;line-height:1;
}
.auth-tagline{
  font-size:11px;color:var(--text3);
  font-family:var(--mono);letter-spacing:2px;margin-bottom:36px;
}
.auth-tabs{
  display:flex;gap:3px;background:rgba(30,35,48,0.8);
  border:1px solid var(--border);border-radius:12px;padding:4px;margin-bottom:28px;
}
.auth-tab{
  flex:1;padding:9px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;
  border:none;background:transparent;color:var(--text3);font-family:var(--body);
  transition:all .2s cubic-bezier(.16,1,.3,1);letter-spacing:.3px;
}
.auth-tab.on{
  background:linear-gradient(135deg,rgba(0,255,135,0.15),rgba(0,255,135,0.08));
  color:var(--lo);box-shadow:0 1px 8px rgba(0,0,0,0.3),inset 0 1px 0 rgba(0,255,135,0.1);
  border:1px solid rgba(0,255,135,0.15);
}
.field{margin-bottom:18px}
.field label{display:block;font-size:11px;font-family:var(--mono);color:var(--text3);letter-spacing:1.5px;margin-bottom:8px;text-transform:uppercase}
.field input,.field select{
  width:100%;background:rgba(13,15,20,0.7);border:1px solid rgba(37,45,61,0.9);border-radius:10px;
  padding:12px 16px;font-size:14px;color:var(--text);font-family:var(--body);outline:none;
  transition:all .2s;box-shadow:inset 0 1px 3px rgba(0,0,0,0.3);
}
.field input:focus,.field select:focus{
  border-color:rgba(0,255,135,0.4);
  box-shadow:0 0 0 3px rgba(0,255,135,0.08),inset 0 1px 3px rgba(0,0,0,0.3);
  background:rgba(13,15,20,0.9);
}
.field input::placeholder{color:rgba(74,84,104,0.6)}
.field select option{background:#161a22}
.auth-btn{
  width:100%;padding:14px;
  background:linear-gradient(135deg,#00ff87,#00d474);
  color:#000;border:none;border-radius:12px;
  font-size:15px;font-weight:800;cursor:pointer;font-family:var(--body);
  transition:all .2s cubic-bezier(.16,1,.3,1);margin-top:6px;
  letter-spacing:.5px;position:relative;overflow:hidden;
  box-shadow:0 4px 20px rgba(0,255,135,0.25),0 1px 0 rgba(255,255,255,0.2) inset;
}
.auth-btn::after{
  content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
  transition:left .4s;
}
.auth-btn:hover::after{left:100%}
.auth-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,255,135,0.35)}
.auth-btn:active{transform:translateY(0)}
.auth-err{background:rgba(255,77,109,0.08);border:1px solid rgba(255,77,109,0.25);border-radius:10px;padding:11px 14px;font-size:13px;color:var(--hi);margin-bottom:18px;display:flex;align-items:center;gap:8px;}
.auth-switch{text-align:center;margin-top:22px;font-size:13px;color:var(--text3)}
.auth-switch span{color:var(--lo);cursor:pointer;font-weight:600;transition:opacity .15s;}
.auth-switch span:hover{opacity:.8;text-decoration:underline}
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);margin:22px 0;position:relative}
.divider::after{content:'OR';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(22,26,34,0.9);padding:0 12px;font-size:10px;color:var(--text3);font-family:var(--mono);letter-spacing:2px;}
.auth-demo-btn{
  width:100%;padding:12px;background:rgba(30,35,48,0.8);color:var(--text2);
  border:1px solid rgba(37,45,61,0.8);border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;
  font-family:var(--body);transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;
}
.auth-demo-btn:hover{background:rgba(0,255,135,0.06);border-color:rgba(0,255,135,0.2);color:var(--lo);transform:translateY(-1px);}

/* ─── APP SHELL ─── */
.shell{display:flex;height:100vh;overflow:hidden}
.sidebar{
  width:240px;min-width:240px;background:var(--ink2);border-right:1px solid var(--border);
  display:flex;flex-direction:column;overflow:hidden;
}
.sb-head{padding:20px 18px 16px;border-bottom:1px solid var(--border)}
.sb-logo{font-family:var(--display);font-size:22px;letter-spacing:2px;color:var(--lo)}
.sb-sub{font-size:9px;font-family:var(--mono);color:var(--text3);letter-spacing:2px;margin-top:1px}
.sb-user{
  display:flex;align-items:center;gap:10px;padding:12px 18px;
  border-bottom:1px solid var(--border);background:rgba(0,255,135,0.03);
}
.sb-avatar{
  width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--lo),var(--blue));
  display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#000;flex-shrink:0;
}
.sb-uname{font-size:13px;font-weight:600;line-height:1.2}
.sb-uemail{font-size:10px;color:var(--text3);font-family:var(--mono)}
.sb-nav{flex:1;padding:12px 10px;overflow-y:auto}
.sb-section{font-size:9px;font-family:var(--mono);color:var(--text3);letter-spacing:2px;text-transform:uppercase;padding:8px 8px 4px}
.nav-item{
  display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;
  cursor:pointer;font-size:13px;font-weight:500;color:var(--text2);
  transition:all .12s;border:1px solid transparent;margin-bottom:2px;
}
.nav-item:hover{background:var(--ink3);color:var(--text)}
.nav-item.on{background:rgba(0,255,135,0.08);color:var(--lo);border-color:rgba(0,255,135,0.15)}
.nav-icon{font-size:15px;width:18px;text-align:center}
.sb-foot{padding:14px 18px;border-top:1px solid var(--border)}
.logout-btn{
  width:100%;padding:8px;background:transparent;border:1px solid var(--border2);border-radius:8px;
  font-size:12px;color:var(--text2);cursor:pointer;font-family:var(--body);transition:all .12s;
}
.logout-btn:hover{border-color:var(--hi);color:var(--hi)}

/* ─── MAIN ─── */
.main{flex:1;overflow-y:auto;display:flex;flex-direction:column}
.topbar{
  background:var(--ink2);border-bottom:1px solid var(--border);padding:14px 28px;
  display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:5;
}
.topbar-title{font-family:var(--display);font-size:22px;letter-spacing:1px}
.topbar-right{display:flex;gap:10px;align-items:center}
.btn{
  padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;
  border:none;font-family:var(--body);transition:all .12s;
}
.btn-lo{background:var(--lo);color:#000}
.btn-lo:hover{background:var(--lo2);transform:translateY(-1px)}
.btn-outline{background:transparent;color:var(--text2);border:1px solid var(--border2)}
.btn-outline:hover{border-color:var(--lo);color:var(--lo)}
.btn-ghost{background:var(--ink3);color:var(--text);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--border2)}
.btn-red{background:rgba(255,77,109,0.1);color:var(--hi);border:1px solid rgba(255,77,109,0.2)}
.btn-red:hover{background:rgba(255,77,109,0.2)}
.content{padding:24px 28px;flex:1}

/* ─── UPLOAD ─── */
.upload-zone{
  border:2px dashed var(--border2);border-radius:16px;padding:56px 40px;text-align:center;
  cursor:pointer;transition:all .2s;background:var(--ink2);position:relative;overflow:hidden;
}
.upload-zone::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(circle at 50% 0%,rgba(0,255,135,0.03) 0%,transparent 70%);
  pointer-events:none;
}
.upload-zone:hover,.upload-zone.drag{border-color:var(--lo);background:rgba(0,255,135,0.03)}
.upload-ico{font-size:44px;margin-bottom:16px}
.upload-t{font-size:20px;font-weight:700;margin-bottom:8px}
.upload-s{font-size:13px;color:var(--text2);line-height:1.6}
.upload-hint{
  margin-top:24px;display:inline-flex;gap:8px;flex-wrap:wrap;justify-content:center;
}
.tag{
  padding:4px 10px;border-radius:20px;font-size:11px;font-family:var(--mono);
  background:var(--ink3);border:1px solid var(--border2);color:var(--text2);
}

/* ─── KPI GRID ─── */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.kpi-card{
  background:var(--ink2);border:1px solid var(--border);border-radius:14px;
  padding:18px 20px;position:relative;overflow:hidden;transition:border-color .2s;cursor:default;
}
.kpi-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:var(--kc,var(--lo));opacity:.7;
}
.kpi-card:hover{border-color:color-mix(in srgb,var(--kc,var(--lo)) 30%,var(--border))}
.kpi-lbl{font-size:10px;font-family:var(--mono);color:var(--text2);letter-spacing:.5px;margin-bottom:8px;text-transform:uppercase}
.kpi-val{font-family:var(--display);font-size:30px;letter-spacing:1px;color:var(--kc,var(--lo));line-height:1}
.kpi-sub{font-size:11px;color:var(--text2);margin-top:6px}
.kpi-delta{font-size:11px;margin-top:4px;font-family:var(--mono)}
.kpi-delta.up{color:#00ff87}
.kpi-delta.dn{color:var(--hi)}
.kpi-spark{margin-top:10px;display:flex;align-items:flex-end;gap:2px;height:28px}
.spark-b{flex:1;border-radius:2px;transition:height .3s}

/* ─── CARDS ─── */
.card{background:var(--ink2);border:1px solid var(--border);border-radius:14px;padding:20px}
.card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.card-title{font-size:14px;font-weight:700}
.badge{padding:3px 8px;border-radius:20px;font-size:10px;font-family:var(--mono)}
.badge-lo{background:rgba(0,255,135,.1);color:var(--lo);border:1px solid rgba(0,255,135,.2)}
.badge-hi{background:rgba(255,77,109,.1);color:var(--hi);border:1px solid rgba(255,77,109,.2)}
.badge-blue{background:rgba(77,159,255,.1);color:var(--blue);border:1px solid rgba(77,159,255,.2)}
.badge-purple{background:rgba(176,106,255,.1);color:var(--purple);border:1px solid rgba(176,106,255,.2)}
.badge-amber{background:rgba(255,140,0,.1);color:var(--hi2);border:1px solid rgba(255,140,0,.2)}

.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.grid3{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:20px}
.gap-b{margin-bottom:20px}

/* ─── TABLE ─── */
.tbl{width:100%;border-collapse:collapse}
.tbl th{font-size:10px;font-family:var(--mono);color:var(--text2);text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);letter-spacing:.5px;text-transform:uppercase}
.tbl td{padding:10px;font-size:13px;border-bottom:1px solid rgba(37,45,61,.5)}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:rgba(255,255,255,.015)}
.ch-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px}
.bar-wrap{height:4px;background:var(--ink3);border-radius:2px;overflow:hidden;margin-top:2px}
.bar-fill{height:100%;border-radius:2px;transition:width .5s ease}
.mono{font-family:var(--mono);font-size:12px}

/* ─── METRIC ROW ─── */
.mrow{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(37,45,61,.5);font-size:13px}
.mrow:last-child{border-bottom:none}
.mlbl{color:var(--text2)}
.mval{font-family:var(--mono);font-size:12px;font-weight:500}

/* ─── CHART SVG ─── */
.chart-wrap{position:relative}

/* ─── INSIGHT BOX ─── */
.insight-list{display:flex;flex-direction:column;gap:10px}
.insight{padding:12px 14px;border-radius:8px;border-left:3px solid;background:var(--ink3);font-size:13px;line-height:1.55}
.insight.pos{border-color:var(--lo)}
.insight.warn{border-color:var(--hi2)}
.insight.crit{border-color:var(--hi)}
.insight.info{border-color:var(--blue)}
.insight-tag{font-size:9px;font-family:var(--mono);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;font-weight:600}
.insight.pos .insight-tag{color:var(--lo)}
.insight.warn .insight-tag{color:var(--hi2)}
.insight.crit .insight-tag{color:var(--hi)}
.insight.info .insight-tag{color:var(--blue)}

/* ─── CHAT ─── */
.chat-area{display:flex;flex-direction:column;gap:12px;max-height:360px;overflow-y:auto;padding-right:4px;margin-bottom:14px}
.bubble{padding:12px 14px;border-radius:10px;font-size:13px;line-height:1.6;max-width:90%}
.bubble.user{background:rgba(0,255,135,.08);border:1px solid rgba(0,255,135,.15);align-self:flex-end;font-family:var(--mono);font-size:12px}
.bubble.ai{background:var(--ink3);border:1px solid var(--border);align-self:flex-start}
.bubble .ai-tag{font-size:9px;font-family:var(--mono);color:var(--lo);letter-spacing:1.5px;margin-bottom:5px}
.chat-inp-wrap{display:flex;gap:8px}
.chat-inp{
  flex:1;background:var(--ink3);border:1px solid var(--border2);border-radius:8px;
  padding:10px 14px;font-size:13px;color:var(--text);font-family:var(--body);outline:none;transition:border-color .15s;
}
.chat-inp:focus{border-color:rgba(0,255,135,.4)}
.chat-inp::placeholder{color:var(--text3)}

/* ─── HISTORY ─── */
.hist-list{display:flex;flex-direction:column;gap:6px}
.hist-item{
  display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;
  background:var(--ink3);cursor:pointer;transition:all .12s;border:1px solid transparent;
}
.hist-item:hover{border-color:var(--border2)}
.hist-item.sel{border-color:rgba(0,255,135,.3);background:rgba(0,255,135,.04)}
.hist-date{font-family:var(--mono);font-size:11px;color:var(--text2);min-width:90px}
.hist-kpi{font-size:13px;font-weight:600;flex:1}
.hist-delta{font-size:11px;font-family:var(--mono)}

/* ─── FUNNEL ─── */
.funnel{display:flex;flex-direction:column;gap:6px}
.funnel-step{display:flex;align-items:center;gap:12px}
.funnel-bar-wrap{flex:1;height:32px;background:var(--ink3);border-radius:6px;overflow:hidden;position:relative}
.funnel-bar{height:100%;display:flex;align-items:center;padding-left:10px;border-radius:6px;font-size:12px;font-weight:600;transition:width .6s ease}
.funnel-lbl{font-size:11px;color:var(--text2);min-width:80px;text-align:right;font-family:var(--mono)}
.funnel-pct{position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:11px;font-family:var(--mono);color:rgba(255,255,255,.5)}

/* ─── TABS ─── */
.tab-row{display:flex;gap:4px;background:var(--ink3);border-radius:9px;padding:4px;margin-bottom:16px}
.tab-btn{padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--text2);font-family:var(--body);transition:all .12s}
.tab-btn.on{background:var(--ink2);color:var(--lo);box-shadow:0 1px 4px rgba(0,0,0,.4)}

.divider-line{height:1px;background:var(--border);margin:16px 0}
.empty{text-align:center;padding:40px;color:var(--text2);font-size:13px}
.loading-dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--lo);margin:0 2px;animation:bop 1.2s infinite}
.loading-dots span:nth-child(2){animation-delay:.2s}
.loading-dots span:nth-child(3){animation-delay:.4s}
@keyframes bop{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
.up{color:var(--lo)}
.dn{color:var(--hi)}
.fade-in{animation:fadein .3s ease}
@keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* ─── SEGMENT ANALYSIS ─── */
.seg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
.seg-card{background:var(--ink3);border:1px solid var(--border);border-radius:10px;padding:14px}
.seg-title{font-size:11px;font-family:var(--mono);color:var(--text2);letter-spacing:.5px;margin-bottom:8px;text-transform:uppercase}
.seg-val{font-family:var(--display);font-size:24px;color:var(--text);margin-bottom:4px}
.seg-sub{font-size:11px;color:var(--text2)}

/* ─── RESPONSIVE ─── */
@media(max-width:900px){.kpi-grid{grid-template-columns:repeat(2,1fr)}.grid2,.grid3{grid-template-columns:1fr}}
@media(max-width:600px){.shell{flex-direction:column}.sidebar{width:100%;min-width:unset;flex-direction:row;overflow-x:auto}}
`;

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const CH_COLORS = { Meta: "#00ff87", Google: "#4d9fff", Kakao: "#ffb800", Naver: "#10b981", TikTok: "#ff4d6d", YouTube: "#b06aff" };

function genData(days = 30) {
  const chs = Object.keys(CH_COLORS);
  const data = [];
  let base = 8500000;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const spend = Math.round(base * 0.12 * (0.8 + Math.random() * 0.4));
    const impr = Math.round(spend * (18 + Math.random() * 10));
    const clicks = Math.round(impr * (0.02 + Math.random() * 0.03));
    const conv = Math.round(clicks * (0.04 + Math.random() * 0.06));
    const revenue = Math.round(conv * (12000 + Math.random() * 8000));
    const item = {
      date: d.toISOString().split("T")[0],
      spend, impr, clicks, conv, revenue,
      cpc: Math.round(spend / clicks),
      cpm: Math.round((spend / impr) * 1000),
      ctr: parseFloat(((clicks / impr) * 100).toFixed(2)),
      cvr: parseFloat(((conv / clicks) * 100).toFixed(2)),
      cpa: Math.round(spend / conv),
      roas: parseFloat((revenue / spend).toFixed(2)),
      acos: parseFloat(((spend / revenue) * 100).toFixed(1)),
      channels: {}
    };
    chs.forEach(ch => {
      const s = Math.round(spend * (0.08 + Math.random() * 0.35));
      const c = Math.round(s / (1200 + Math.random() * 800));
      const cv = Math.round(c * (0.03 + Math.random() * 0.07));
      const r = Math.round(cv * (10000 + Math.random() * 10000));
      item.channels[ch] = {
        spend: s, clicks: c, conv: cv, revenue: r,
        roas: parseFloat((r / s).toFixed(2)),
        ctr: parseFloat(((c / (s * 15)) * 100).toFixed(2)),
        cvr: parseFloat(((cv / c) * 100).toFixed(2)),
        cpa: Math.round(s / Math.max(cv, 1)),
        cpc: Math.round(s / Math.max(c, 1)),
      };
    });
    base *= 1.002;
    data.push(item);
  }
  return data;
}

function computeStats(data) {
  if (!data.length) return null;
  const sum = (k) => data.reduce((s, d) => s + (d[k] || 0), 0);
  const avg = (k) => sum(k) / data.length;
  const recent = data.slice(-7), prev = data.slice(-14, -7);
  const avgR = (arr, k) => arr.reduce((s, d) => s + (d[k] || 0), 0) / arr.length;

  const totalSpend = sum("spend"), totalRevenue = sum("revenue");
  const totalConv = sum("conv"), totalClicks = sum("clicks"), totalImpr = sum("impr");

  const chStats = {};
  const chs = data[0]?.channels ? Object.keys(data[0].channels) : [];
  chs.forEach(ch => {
    const sp = data.map(d => d.channels?.[ch]?.spend || 0);
    const rv = data.map(d => d.channels?.[ch]?.revenue || 0);
    const cv = data.map(d => d.channels?.[ch]?.conv || 0);
    const cl = data.map(d => d.channels?.[ch]?.clicks || 0);
    const ro = data.map(d => d.channels?.[ch]?.roas || 0);
    const ta = sp.reduce((a, b) => a + b, 0);
    chStats[ch] = {
      totalSpend: ta,
      totalRevenue: rv.reduce((a, b) => a + b, 0),
      totalConv: cv.reduce((a, b) => a + b, 0),
      totalClicks: cl.reduce((a, b) => a + b, 0),
      avgRoas: ro.reduce((a, b) => a + b, 0) / ro.length,
      spendShare: 0,
    };
  });
  const totCh = Object.values(chStats).reduce((s, c) => s + c.totalSpend, 0);
  chs.forEach(ch => { chStats[ch].spendShare = chStats[ch].totalSpend / totCh; });

  const rGrowth = ((avgR(recent, "revenue") - avgR(prev, "revenue")) / avgR(prev, "revenue")) * 100;
  const roasGrowth = ((avgR(recent, "roas") - avgR(prev, "roas")) / avgR(prev, "roas")) * 100;

  return {
    totalSpend, totalRevenue, totalConv, totalClicks, totalImpr,
    overallRoas: totalRevenue / totalSpend,
    overallCpa: totalSpend / totalConv,
    overallCpc: totalSpend / totalClicks,
    overallCtr: (totalClicks / totalImpr) * 100,
    overallCvr: (totalConv / totalClicks) * 100,
    overallCpm: (totalSpend / totalImpr) * 1000,
    overallAcos: (totalSpend / totalRevenue) * 100,
    avgDailySpend: avg("spend"),
    avgDailyRevenue: avg("revenue"),
    rGrowth, roasGrowth,
    chStats, bestCh: chs.sort((a, b) => chStats[b]?.avgRoas - chStats[a]?.avgRoas)[0],
    worstCh: chs.sort((a, b) => chStats[a]?.avgRoas - chStats[b]?.avgRoas)[0],
  };
}

function parseCSV(txt) {
  const lines = txt.trim().split("\n");
  const hdrs = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map(l => {
    const vals = l.split(","); const obj = {};
    hdrs.forEach((h, i) => { obj[h] = vals[i]?.trim() || ""; });
    return obj;
  });
}

const fmt = (n) => n >= 1e8 ? `₩${(n / 1e8).toFixed(1)}억` : n >= 1e6 ? `₩${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `₩${(n / 1e3).toFixed(0)}K` : `₩${n}`;
const fmtN = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : `${n}`;
const pct = (n) => `${n.toFixed(2)}%`;

// ─── SVG LINE CHART ───────────────────────────────────────────────────────────
function LineChart({ data, dataKey, color }) {
  if (!data?.length) return <div className="empty">데이터 없음</div>;
  const vals = data.map(d => d[dataKey] || 0);
  const min = Math.min(...vals), max = Math.max(...vals);
  const W = 500, H = 110, pad = 8;
  const pts = vals.map((v, i) => [pad + (i / (vals.length - 1)) * (W - pad * 2), pad + ((max - v) / (max - min || 1)) * (H - pad * 2)]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const area = path + ` L${pts.at(-1)[0]},${H} L${pts[0][0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 90 }}>
      <defs>
        <linearGradient id={`g${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".25" />
          <stop offset="100%" stopColor={color} stopOpacity=".01" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g${dataKey})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.slice(-1).map(([x, y]) => <circle key="e" cx={x} cy={y} r="3" fill={color} />)}
    </svg>
  );
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Spark({ vals, color }) {
  const max = Math.max(...vals) || 1;
  return (
    <div className="kpi-spark">
      {vals.map((v, i) => <div key={i} className="spark-b" style={{ height: `${(v / max) * 100}%`, background: color, opacity: .5 + (i / vals.length) * .5 }} />)}
    </div>
  );
}

// ─── AI INSIGHTS ──────────────────────────────────────────────────────────────
async function aiInsights(stats, data, q = null) {
  const ctx = `퍼포먼스 마케팅 AI 분석가입니다. 아래 실제 캠페인 데이터를 분석해주세요.

분석 기간: ${data.length}일 | 총 광고비: ${fmt(stats.totalSpend)} | 총 매출: ${fmt(stats.totalRevenue)}
ROAS: ${stats.overallRoas.toFixed(2)}x | CPA: ${fmt(Math.round(stats.overallCpa))} | CTR: ${pct(stats.overallCtr)} | CVR: ${pct(stats.overallCvr)}
CPC: ${fmt(Math.round(stats.overallCpc))} | CPM: ${fmt(Math.round(stats.overallCpm))} | ACoS: ${stats.overallAcos.toFixed(1)}%
매출 성장(7일 vs 전주): ${stats.rGrowth.toFixed(1)}% | ROAS 성장: ${stats.roasGrowth.toFixed(1)}%
최고 ROAS 채널: ${stats.bestCh} (${stats.chStats[stats.bestCh]?.avgRoas.toFixed(2)}x)
최저 ROAS 채널: ${stats.worstCh} (${stats.chStats[stats.worstCh]?.avgRoas.toFixed(2)}x)
채널별: ${Object.entries(stats.chStats).map(([ch, s]) => `${ch} 광고비 ${fmt(s.totalSpend)} ROAS ${s.avgRoas.toFixed(2)}x 점유율 ${(s.spendShare * 100).toFixed(0)}%`).join(" | ")}`;

  const msg = q ? `${ctx}\n\n질문: ${q}\n데이터 기반으로 구체적이고 실행 가능한 답변을 한국어로 해주세요.`
    : `${ctx}\n\n아래 형식의 JSON만 출력하세요(다른 텍스트 없이):\n{"insights":[{"type":"positive|warning|critical|info","title":"제목","text":"1-2문장 구체적 설명"},...4개]}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, messages: [{ role: "user", content: msg }] })
  });
  const d = await res.json();
  const txt = d.content?.[0]?.text || "";
  if (!q) { try { return JSON.parse(txt).insights || []; } catch { return []; } }
  return txt;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", role: "" });
  const [err, setErr] = useState("");

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    setErr("");
    const users = DB.get("io_users") || {};

    if (tab === "login") {
      const u = users[form.email];
      if (!u) return setErr("등록된 이메일이 없습니다.");
      if (u.password !== form.password) return setErr("비밀번호가 틀렸습니다.");
      DB.set("io_session", { email: form.email, ...u });
      onLogin({ email: form.email, ...u });
    } else {
      if (!form.name || !form.email || !form.password) return setErr("모든 필드를 입력해주세요.");
      if (form.password.length < 6) return setErr("비밀번호는 6자 이상이어야 합니다.");
      if (users[form.email]) return setErr("이미 사용중인 이메일입니다.");
      const u = { name: form.name, company: form.company, role: form.role, password: form.password, joinedAt: new Date().toISOString() };
      users[form.email] = u;
      DB.set("io_users", users);
      DB.set("io_session", { email: form.email, ...u });
      onLogin({ email: form.email, ...u });
    }
  };

  return (
    <>
      <style>{G}</style>
      <div className="auth-wrap">
      <div className="auth-glow" />
      <div className="auth-box fade-in">
        <div className="auth-logo">INSIGHT OUTPUT</div>
        <div className="auth-tagline">// PERFORMANCE ANALYTICS PLATFORM</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "on" : ""}`} onClick={() => setTab("login")}>로그인</button>
          <button className={`auth-tab ${tab === "signup" ? "on" : ""}`} onClick={() => setTab("signup")}>회원가입</button>
        </div>
        {err && <div className="auth-err">⚠ {err}</div>}
        {tab === "signup" && (
          <div className="field"><label>이름</label><input placeholder="홍길동" value={form.name} onChange={e => up("name", e.target.value)} /></div>
        )}
        <div className="field"><label>이메일</label><input type="email" placeholder="example@company.com" value={form.email} onChange={e => up("email", e.target.value)} /></div>
        <div className="field"><label>비밀번호</label><input type="password" placeholder={tab === "signup" ? "6자 이상" : "••••••••"} value={form.password} onChange={e => up("password", e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} /></div>
        {tab === "signup" && (
          <>
            <div className="field"><label>회사명 (선택)</label><input placeholder="GrowthLab Inc." value={form.company} onChange={e => up("company", e.target.value)} /></div>
            <div className="field">
              <label>직무 (선택)</label>
              <select value={form.role} onChange={e => up("role", e.target.value)} style={{ appearance: "none" }}>
                <option value="">선택하세요</option>
                <option value="PM">퍼포먼스 마케터</option>
                <option value="GA">그로스 애널리스트</option>
                <option value="MD">마케팅 디렉터</option>
                <option value="CMO">CMO</option>
                <option value="OTHER">기타</option>
              </select>
            </div>
          </>
        )}
        <button className="auth-btn" onClick={submit}>{tab === "login" ? "로그인" : "계정 만들기"}</button>
        {tab === "login" && (
          <>
            <div className="divider" />
            <button className="auth-demo-btn"
              onClick={() => { DB.set("io_session", { email: "demo@insightoutput.io", name: "데모 사용자", company: "Insight Output", role: "PM" }); onLogin({ email: "demo@insightoutput.io", name: "데모 사용자", company: "Insight Output", role: "PM" }); }}>
              <span style={{fontSize:16}}>🚀</span><span>데모 계정으로 체험하기</span>
            </button>
          </>
        )}
        <div className="auth-switch">
          {tab === "login" ? <>계정이 없으신가요? <span onClick={() => setTab("signup")}>회원가입</span></> : <>이미 계정이 있으신가요? <span onClick={() => setTab("login")}>로그인</span></>}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => DB.get("io_session"));
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [chatQ, setChatQ] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [drag, setDrag] = useState(false);
  const [selDay, setSelDay] = useState(null);
  const [chartTab, setChartTab] = useState("revenue");
  const [chTab, setChTab] = useState("roas");
  const fileRef = useRef();

  const logout = () => { DB.set("io_session", null); setUser(null); setData([]); setStats(null); };
  const loadDemo = () => {
    const d = genData(30); setData(d);
    const s = computeStats(d); setStats(s);
    loadInsights(s, d);
  };
  const loadInsights = async (s, d) => {
    setAiLoading(true); setInsights([]);
    try { setInsights(await aiInsights(s, d)); } catch {}
    setAiLoading(false);
  };
  const handleFile = (f) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = (e) => {
      try {
        const rows = parseCSV(e.target.result);
        const mapped = rows.map(r => ({
          date: r.date || r["날짜"] || "",
          revenue: +r.revenue || +r["매출"] || 0,
          spend: +r.spend || +r["광고비"] || +r.ad_spend || 0,
          conv: +r.conversions || +r["전환"] || +r.conv || 0,
          clicks: +r.clicks || +r["클릭"] || 0,
          impr: +r.impressions || +r["노출"] || 0,
          channels: {}
        }));
        setData(mapped);
        const s = computeStats(mapped); setStats(s);
        loadInsights(s, mapped);
      } catch { alert("CSV 파싱 오류"); }
    };
    r.readAsText(f);
  };
  const sendChat = async () => {
    if (!chatQ.trim() || !stats) return;
    const q = chatQ; setChatQ("");
    setChat(c => [...c, { role: "user", text: q }]);
    setChatLoad(true);
    try { const a = await aiInsights(stats, data, q); setChat(c => [...c, { role: "ai", text: a }]); }
    catch { setChat(c => [...c, { role: "ai", text: "분석 오류가 발생했습니다." }]); }
    setChatLoad(false);
  };

  if (!user) return <AuthPage onLogin={u => setUser(u)} />;

  const nav = [
    { id: "dashboard", icon: "◈", label: "대시보드" },
    { id: "channels", icon: "⊞", label: "채널 분석" },
    { id: "funnel", icon: "◫", label: "퍼널 분석" },
    { id: "history", icon: "◷", label: "일별 누적" },
    { id: "ai", icon: "◎", label: "AI 인사이트" },
    { id: "chat", icon: "◉", label: "AI 어시스턴트" },
  ];

  const recent = data.at(-1), prev2 = data.at(-2);

  return (
    <>
      <style>{G}</style>
      <div className="shell">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sb-head">
            <div className="sb-logo">INSIGHT OUTPUT</div>
            <div className="sb-sub">// PERFORMANCE ANALYTICS</div>
          </div>
          <div className="sb-user">
            <div className="sb-avatar">{user.name?.[0] || "U"}</div>
            <div>
              <div className="sb-uname">{user.name || user.email}</div>
              <div className="sb-uemail">{user.company || user.email}</div>
            </div>
          </div>
          <div className="sb-nav">
            <div className="sb-section">분석</div>
            {nav.map(n => (
              <div key={n.id} className={`nav-item ${page === n.id ? "on" : ""}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
            <div className="sb-section" style={{ marginTop: 12 }}>데이터</div>
            <div style={{ padding: "8px 10px 4px", fontSize: 11, fontFamily: "var(--mono)", color: "var(--text2)" }}>
              누적: <span style={{ color: "var(--lo)", fontSize: 16, fontWeight: 600, display: "block" }}>{data.length}일</span>
            </div>
          </div>
          <div className="sb-foot">
            <button className="logout-btn" onClick={logout}>로그아웃</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{nav.find(n => n.id === page)?.label}</div>
            <div className="topbar-right">
              {data.length > 0 && <button className="btn btn-outline" onClick={() => { setData([]); setStats(null); setInsights([]); }}>초기화</button>}
              <button className="btn btn-lo" onClick={loadDemo}>데모 데이터</button>
              <button className="btn btn-ghost" onClick={() => fileRef.current.click()}>CSV 업로드</button>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>
          </div>

          <div className="content fade-in">
            {/* ── DASHBOARD ── */}
            {page === "dashboard" && (
              !data.length ? (
                <div className={`upload-zone ${drag ? "drag" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current.click()}>
                  <div className="upload-ico">📊</div>
                  <div className="upload-t">캠페인 데이터를 업로드하세요</div>
                  <div className="upload-s">CSV 파일을 드래그하거나 클릭하여 업로드<br />퍼포먼스 마케팅 핵심 지표를 자동으로 분석합니다</div>
                  <div className="upload-hint">
                    {["ROAS", "CPA", "CTR", "CVR", "CPC", "CPM", "ACoS", "ROMI"].map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div style={{ marginTop: 28 }}>
                    <button className="btn btn-lo" style={{ fontSize: 14, padding: "10px 28px" }} onClick={e => { e.stopPropagation(); loadDemo(); }}>데모 데이터로 체험하기</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* KPI 8개 */}
                  <div className="kpi-grid">
                    {[
                      { lbl: "TOTAL ROAS", val: `${stats.overallRoas.toFixed(2)}x`, sub: "총 매출 / 총 광고비", c: "var(--lo)", sparks: data.slice(-14).map(d => d.roas) },
                      { lbl: "TOTAL REVENUE", val: fmt(stats.totalRevenue), sub: `광고비 ${fmt(stats.totalSpend)}`, c: "var(--blue)", sparks: data.slice(-14).map(d => d.revenue) },
                      { lbl: "CPA", val: fmt(Math.round(stats.overallCpa)), sub: "전환당 비용", c: "var(--purple)", sparks: data.slice(-14).map(d => d.cpa) },
                      { lbl: "CTR", val: pct(stats.overallCtr), sub: `클릭 ${fmtN(stats.totalClicks)}`, c: "var(--hi2)", sparks: data.slice(-14).map(d => d.ctr) },
                      { lbl: "CVR", val: pct(stats.overallCvr), sub: `전환 ${fmtN(stats.totalConv)}건`, c: "var(--lo)", sparks: data.slice(-14).map(d => d.cvr) },
                      { lbl: "CPC", val: fmt(Math.round(stats.overallCpc)), sub: "클릭당 비용", c: "var(--blue)", sparks: data.slice(-14).map(d => d.cpc) },
                      { lbl: "CPM", val: fmt(Math.round(stats.overallCpm)), sub: "1,000 노출당 비용", c: "var(--purple)", sparks: data.slice(-14).map(d => d.cpm) },
                      { lbl: "ACoS", val: `${stats.overallAcos.toFixed(1)}%`, sub: "광고비 / 매출 비율", c: stats.overallAcos < 15 ? "var(--lo)" : stats.overallAcos < 30 ? "var(--hi2)" : "var(--hi)", sparks: data.slice(-14).map(d => d.acos) },
                    ].map(k => (
                      <div className="kpi-card" key={k.lbl} style={{ "--kc": k.c }}>
                        <div className="kpi-lbl">{k.lbl}</div>
                        <div className="kpi-val">{k.val}</div>
                        <div className="kpi-sub">{k.sub}</div>
                        <Spark vals={k.sparks} color={k.c} />
                      </div>
                    ))}
                  </div>

                  {/* 트렌드 차트 + 일별 비교 */}
                  <div className="grid3 gap-b">
                    <div className="card">
                      <div className="card-hd">
                        <div className="card-title">트렌드 분석</div>
                        <div className="tab-row" style={{ margin: 0 }}>
                          {[["revenue", "매출"], ["spend", "광고비"], ["roas", "ROAS"], ["ctr", "CTR"]].map(([k, l]) => (
                            <button key={k} className={`tab-btn ${chartTab === k ? "on" : ""}`} onClick={() => setChartTab(k)}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <LineChart data={data} dataKey={chartTab} color={chartTab === "revenue" ? "#00ff87" : chartTab === "spend" ? "#4d9fff" : chartTab === "roas" ? "#b06aff" : "#ff8c00"} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", marginTop: 6 }}>
                        <span>{data[0]?.date}</span><span>{data.at(-1)?.date}</span>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-hd"><div className="card-title">어제 vs 그제</div><span className="badge badge-lo">DAILY</span></div>
                      {recent && prev2 && [
                        { l: "매출", a: recent.revenue, b: prev2.revenue, f: fmt },
                        { l: "광고비", a: recent.spend, b: prev2.spend, f: fmt },
                        { l: "ROAS", a: recent.roas, b: prev2.roas, f: v => `${v.toFixed(2)}x` },
                        { l: "CTR", a: recent.ctr, b: prev2.ctr, f: v => pct(v) },
                        { l: "CVR", a: recent.cvr, b: prev2.cvr, f: v => pct(v) },
                        { l: "CPA", a: recent.cpa, b: prev2.cpa, f: fmt },
                      ].map(m => {
                        const diff = ((m.a - m.b) / m.b * 100).toFixed(1);
                        return (
                          <div className="mrow" key={m.l}>
                            <span className="mlbl">{m.l}</span>
                            <div style={{ textAlign: "right" }}>
                              <div className="mval">{m.f(m.a)}</div>
                              <div style={{ fontSize: 10 }} className={diff >= 0 ? "up" : "dn"}>{diff >= 0 ? "▲" : "▼"}{Math.abs(diff)}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI 인사이트 */}
                  <div className="card gap-b">
                    <div className="card-hd">
                      <div className="card-title">AI 마케팅 인사이트</div>
                      {aiLoading ? <div className="loading-dots"><span /><span /><span /></div> : <span className="badge badge-purple">Claude 분석</span>}
                    </div>
                    {aiLoading ? <div className="empty">AI가 데이터를 분석 중입니다...</div>
                      : insights.length > 0 ? (
                        <div className="insight-list">
                          {insights.map((ins, i) => (
                            <div key={i} className={`insight ${ins.type === "positive" ? "pos" : ins.type === "warning" ? "warn" : ins.type === "critical" ? "crit" : "info"}`}>
                              <div className="insight-tag">{ins.type === "positive" ? "✓ 기회" : ins.type === "warning" ? "⚠ 주의" : ins.type === "critical" ? "✕ 위험" : "ℹ 정보"} · {ins.title}</div>
                              {ins.text}
                            </div>
                          ))}
                        </div>
                      ) : <div className="empty">AI 인사이트를 로드하는 중...</div>}
                  </div>
                </>
              )
            )}

            {/* ── CHANNELS ── */}
            {page === "channels" && (stats ? (
              <>
                <div className="kpi-grid gap-b">
                  {Object.entries(stats.chStats).map(([ch, s]) => (
                    <div className="kpi-card" key={ch} style={{ "--kc": CH_COLORS[ch] }}>
                      <div className="kpi-lbl"><span className="ch-dot" style={{ background: CH_COLORS[ch] }} />{ch}</div>
                      <div className="kpi-val">{s.avgRoas.toFixed(2)}x</div>
                      <div className="kpi-sub">ROAS</div>
                      <div className="divider-line" style={{ margin: "10px 0" }} />
                      <div className="mrow" style={{ padding: "3px 0" }}><span className="mlbl" style={{ fontSize: 11 }}>광고비</span><span className="mono">{fmt(s.totalSpend)}</span></div>
                      <div className="mrow" style={{ padding: "3px 0" }}><span className="mlbl" style={{ fontSize: 11 }}>매출</span><span className="mono">{fmt(s.totalRevenue)}</span></div>
                      <div className="mrow" style={{ padding: "3px 0", borderBottom: "none" }}><span className="mlbl" style={{ fontSize: 11 }}>점유율</span><span className="mono">{(s.spendShare * 100).toFixed(1)}%</span></div>
                    </div>
                  ))}
                </div>
                <div className="grid2">
                  <div className="card">
                    <div className="card-hd">
                      <div className="card-title">채널별 지표 비교</div>
                      <div className="tab-row" style={{ margin: 0 }}>
                        {[["roas", "ROAS"], ["ctr", "CTR"], ["cvr", "CVR"], ["cpa", "CPA"]].map(([k, l]) => (
                          <button key={k} className={`tab-btn ${chTab === k ? "on" : ""}`} onClick={() => setChTab(k)}>{l}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {Object.entries(stats.chStats).sort((a, b) => {
                        const key = chTab === "cpa" ? "cpa" : `avg${chTab.charAt(0).toUpperCase() + chTab.slice(1)}`;
                        const va = chTab === "cpa" ? a[1].totalSpend / Math.max(a[1].totalConv, 1) : a[1].avgRoas;
                        const vb = chTab === "cpa" ? b[1].totalSpend / Math.max(b[1].totalConv, 1) : b[1].avgRoas;
                        return chTab === "cpa" ? va - vb : vb - va;
                      }).map(([ch, s]) => {
                        const val = chTab === "roas" ? s.avgRoas : chTab === "ctr" ? s.totalClicks / Math.max(s.totalSpend * 0.015, 1) : chTab === "cvr" ? s.totalConv / Math.max(s.totalClicks, 1) * 100 : s.totalSpend / Math.max(s.totalConv, 1);
                        const max = chTab === "roas" ? 6 : chTab === "ctr" ? 5 : chTab === "cvr" ? 10 : 50000;
                        return (
                          <div key={ch}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                              <span><span className="ch-dot" style={{ background: CH_COLORS[ch] }} />{ch}</span>
                              <span className="mono" style={{ color: CH_COLORS[ch] }}>{chTab === "roas" ? `${val.toFixed(2)}x` : chTab === "cpa" ? fmt(Math.round(val)) : pct(val)}</span>
                            </div>
                            <div className="bar-wrap"><div className="bar-fill" style={{ width: `${Math.min((val / max) * 100, 100)}%`, background: CH_COLORS[ch] }} /></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-hd"><div className="card-title">예산 배분 현황</div><span className="badge badge-lo">광고비 점유율</span></div>
                    <table className="tbl">
                      <thead><tr><th>채널</th><th>광고비</th><th>ROAS</th><th>점유율</th></tr></thead>
                      <tbody>
                        {Object.entries(stats.chStats).sort((a, b) => b[1].totalSpend - a[1].totalSpend).map(([ch, s]) => (
                          <tr key={ch}>
                            <td><span className="ch-dot" style={{ background: CH_COLORS[ch] }} />{ch}</td>
                            <td className="mono">{fmt(s.totalSpend)}</td>
                            <td className="mono" style={{ color: CH_COLORS[ch] }}>{s.avgRoas.toFixed(2)}x</td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div className="bar-wrap" style={{ flex: 1, margin: 0 }}><div className="bar-fill" style={{ width: `${s.spendShare * 100}%`, background: CH_COLORS[ch] }} /></div>
                                <span className="mono" style={{ minWidth: 32, fontSize: 11 }}>{(s.spendShare * 100).toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : <div className="empty" style={{ padding: 80 }}>데이터를 먼저 로드하세요 <button className="btn btn-lo" onClick={loadDemo} style={{ marginLeft: 10 }}>데모 데이터</button></div>)}

            {/* ── FUNNEL ── */}
            {page === "funnel" && (stats ? (
              <>
                <div className="seg-grid gap-b">
                  {[
                    { t: "노출 → 클릭 (CTR)", v: pct(stats.overallCtr), sub: `${fmtN(stats.totalClicks)} 클릭 / ${fmtN(stats.totalImpr)} 노출` },
                    { t: "클릭 → 전환 (CVR)", v: pct(stats.overallCvr), sub: `${fmtN(stats.totalConv)} 전환 / ${fmtN(stats.totalClicks)} 클릭` },
                    { t: "광고비 대비 매출 (ROAS)", v: `${stats.overallRoas.toFixed(2)}x`, sub: `${fmt(stats.totalRevenue)} / ${fmt(stats.totalSpend)}` },
                  ].map(m => (
                    <div className="seg-card" key={m.t}>
                      <div className="seg-title">{m.t}</div>
                      <div className="seg-val">{m.v}</div>
                      <div className="seg-sub">{m.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="card gap-b">
                  <div className="card-hd"><div className="card-title">전환 퍼널</div><span className="badge badge-blue">전체 기간</span></div>
                  <div className="funnel">
                    {[
                      { l: "노출 (Impressions)", v: stats.totalImpr, pct: 100, c: "#4d9fff" },
                      { l: "클릭 (Clicks)", v: stats.totalClicks, pct: (stats.totalClicks / stats.totalImpr) * 100, c: "#00ff87" },
                      { l: "전환 (Conversions)", v: stats.totalConv, pct: (stats.totalConv / stats.totalImpr) * 100, c: "#b06aff" },
                    ].map((step, i) => (
                      <div className="funnel-step" key={i}>
                        <div className="funnel-lbl">{step.l}</div>
                        <div className="funnel-bar-wrap">
                          <div className="funnel-bar" style={{ width: `${step.pct}%`, background: step.c, color: "#000" }}>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>{fmtN(step.v)}</span>
                          </div>
                          <span className="funnel-pct">{step.pct.toFixed(2)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid2">
                  <div className="card">
                    <div className="card-hd"><div className="card-title">채널별 CVR 비교</div></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {Object.entries(stats.chStats).map(([ch, s]) => {
                        const cvr = s.totalConv / Math.max(s.totalClicks, 1) * 100;
                        return (
                          <div key={ch}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                              <span><span className="ch-dot" style={{ background: CH_COLORS[ch] }} />{ch}</span>
                              <span className="mono" style={{ color: CH_COLORS[ch] }}>{pct(cvr)}</span>
                            </div>
                            <div className="bar-wrap"><div className="bar-fill" style={{ width: `${Math.min(cvr * 10, 100)}%`, background: CH_COLORS[ch] }} /></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-hd"><div className="card-title">효율 지표 요약</div></div>
                    {[
                      { l: "총 노출", v: fmtN(stats.totalImpr) },
                      { l: "총 클릭", v: fmtN(stats.totalClicks) },
                      { l: "총 전환", v: `${fmtN(stats.totalConv)}건` },
                      { l: "CTR", v: pct(stats.overallCtr) },
                      { l: "CVR", v: pct(stats.overallCvr) },
                      { l: "CPC", v: fmt(Math.round(stats.overallCpc)) },
                      { l: "CPM", v: fmt(Math.round(stats.overallCpm)) },
                      { l: "CPA", v: fmt(Math.round(stats.overallCpa)) },
                      { l: "ACoS", v: `${stats.overallAcos.toFixed(1)}%` },
                    ].map(m => <div className="mrow" key={m.l}><span className="mlbl">{m.l}</span><span className="mval">{m.v}</span></div>)}
                  </div>
                </div>
              </>
            ) : <div className="empty" style={{ padding: 80 }}>데이터를 먼저 로드하세요 <button className="btn btn-lo" onClick={loadDemo} style={{ marginLeft: 10 }}>데모 데이터</button></div>)}

            {/* ── HISTORY ── */}
            {page === "history" && (
              <div className="grid2">
                <div className="card">
                  <div className="card-hd"><div className="card-title">일별 성과 기록</div><span className="badge badge-lo">{data.length}일 누적</span></div>
                  {!data.length ? <div className="empty">데이터를 먼저 로드하세요</div> : (
                    <div className="hist-list">
                      {[...data].reverse().map((d, i) => {
                        const p = data[data.length - i - 2];
                        const diff = p ? ((d.revenue - p.revenue) / p.revenue * 100).toFixed(1) : null;
                        return (
                          <div key={d.date} className={`hist-item ${selDay?.date === d.date ? "sel" : ""}`} onClick={() => setSelDay(d)}>
                            <div className="hist-date">{d.date}</div>
                            <div className="hist-kpi">{fmt(d.revenue)}</div>
                            <div className="mono" style={{ fontSize: 11, color: "var(--text2)" }}>ROAS {d.roas?.toFixed(2)}x</div>
                            {diff !== null && <div className={`hist-delta ${diff >= 0 ? "up" : "dn"}`}>{diff >= 0 ? "▲" : "▼"}{Math.abs(diff)}%</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="card">
                  <div className="card-hd"><div className="card-title">{selDay ? `${selDay.date} 상세` : "날짜 선택"}</div></div>
                  {selDay ? (
                    <>
                      {[
                        { l: "매출", v: fmt(selDay.revenue), c: "var(--lo)" },
                        { l: "광고비", v: fmt(selDay.spend), c: "var(--blue)" },
                        { l: "ROAS", v: `${selDay.roas?.toFixed(2)}x`, c: "var(--purple)" },
                        { l: "CTR", v: pct(selDay.ctr || 0), c: "var(--hi2)" },
                        { l: "CVR", v: pct(selDay.cvr || 0), c: "var(--lo)" },
                        { l: "전환", v: `${(selDay.conv || 0).toLocaleString()}건`, c: "var(--text)" },
                        { l: "CPA", v: fmt(selDay.cpa || 0), c: "var(--blue)" },
                        { l: "CPC", v: fmt(selDay.cpc || 0), c: "var(--purple)" },
                        { l: "ACoS", v: `${selDay.acos?.toFixed(1) || 0}%`, c: selDay.acos < 20 ? "var(--lo)" : "var(--hi)" },
                      ].map(m => <div className="mrow" key={m.l}><span className="mlbl">{m.l}</span><span className="mval" style={{ color: m.c }}>{m.v}</span></div>)}
                      {selDay.channels && Object.keys(selDay.channels).length > 0 && (
                        <>
                          <div className="divider-line" />
                          <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 8 }}>채널별</div>
                          {Object.entries(selDay.channels).map(([ch, c]) => (
                            <div className="mrow" key={ch}>
                              <span><span className="ch-dot" style={{ background: CH_COLORS[ch] }} />{ch}</span>
                              <div style={{ textAlign: "right" }}>
                                <div className="mval">{fmt(c.spend)}</div>
                                <div style={{ fontSize: 10, color: CH_COLORS[ch] }}>ROAS {c.roas}x</div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  ) : <div className="empty">← 날짜를 선택하면 상세 지표를 볼 수 있어요</div>}
                </div>
              </div>
            )}

            {/* ── AI INSIGHTS ── */}
            {page === "ai" && (
              !stats ? <div className="empty" style={{ padding: 80 }}>데이터를 먼저 로드하세요 <button className="btn btn-lo" onClick={loadDemo} style={{ marginLeft: 10 }}>데모 데이터</button></div> : (
                <>
                  <div className="card gap-b">
                    <div className="card-hd">
                      <div className="card-title">AI 자동 인사이트</div>
                      <button className="btn btn-outline" onClick={() => loadInsights(stats, data)} disabled={aiLoading}>{aiLoading ? "분석 중..." : "재분석"}</button>
                    </div>
                    {aiLoading ? <div className="empty"><div className="loading-dots"><span /><span /><span /></div><div style={{ marginTop: 10 }}>AI가 패턴을 분석 중입니다...</div></div>
                      : <div className="insight-list">{insights.map((ins, i) => (
                        <div key={i} className={`insight ${ins.type === "positive" ? "pos" : ins.type === "warning" ? "warn" : ins.type === "critical" ? "crit" : "info"}`}>
                          <div className="insight-tag">{ins.type === "positive" ? "✓ 기회" : ins.type === "warning" ? "⚠ 주의" : ins.type === "critical" ? "✕ 위험" : "ℹ 정보"} · {ins.title}</div>
                          {ins.text}
                        </div>
                      ))}</div>}
                  </div>
                  <div className="grid2">
                    <div className="card">
                      <div className="card-hd"><div className="card-title">전체 성과 요약</div></div>
                      {[
                        { l: "분석 기간", v: `${data[0]?.date} ~ ${data.at(-1)?.date}` },
                        { l: "총 광고비", v: fmt(stats.totalSpend) },
                        { l: "총 매출", v: fmt(stats.totalRevenue) },
                        { l: "전체 ROAS", v: `${stats.overallRoas.toFixed(2)}x` },
                        { l: "전체 ACoS", v: `${stats.overallAcos.toFixed(1)}%` },
                        { l: "총 전환", v: `${stats.totalConv.toLocaleString()}건` },
                        { l: "평균 CPA", v: fmt(Math.round(stats.overallCpa)) },
                        { l: "매출 성장률", v: `${stats.rGrowth.toFixed(1)}%` },
                        { l: "ROAS 성장률", v: `${stats.roasGrowth.toFixed(1)}%` },
                      ].map(m => <div className="mrow" key={m.l}><span className="mlbl">{m.l}</span><span className="mval">{m.v}</span></div>)}
                    </div>
                    <div className="card">
                      <div className="card-hd"><div className="card-title">채널 ROAS 랭킹</div><span className="badge badge-amber">효율 순위</span></div>
                      {Object.entries(stats.chStats).sort((a, b) => b[1].avgRoas - a[1].avgRoas).map(([ch, s], rank) => (
                        <div className="mrow" key={ch}>
                          <span>
                            <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", marginRight: 8 }}>#{rank + 1}</span>
                            <span className="ch-dot" style={{ background: CH_COLORS[ch] }} />{ch}
                          </span>
                          <span className="mono" style={{ color: CH_COLORS[ch] }}>{s.avgRoas.toFixed(2)}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            )}

            {/* ── CHAT ── */}
            {page === "chat" && (
              <div className="card" style={{ maxWidth: 780 }}>
                <div className="card-hd">
                  <div className="card-title">AI 마케팅 어시스턴트</div>
                  <span className="badge badge-purple">Claude 기반</span>
                </div>
                {!stats ? <div className="empty">데이터를 먼저 로드하세요</div> : (
                  <>
                    <div className="chat-area">
                      {chat.length === 0 && (
                        <div style={{ color: "var(--text2)", fontSize: 13, padding: 8 }}>
                          데이터 기반으로 마케팅 인사이트를 질문해보세요:<br />
                          • "ROAS가 낮은 채널을 어떻게 개선할 수 있을까?"<br />
                          • "다음 주 예산을 어떻게 배분하면 좋을까?"<br />
                          • "CTR은 높은데 CVR이 낮은 원인이 뭘까?"<br />
                          • "ACoS를 20% 이하로 줄이는 방법은?"
                        </div>
                      )}
                      {chat.map((m, i) => (
                        <div key={i} className={`bubble ${m.role}`}>
                          {m.role === "ai" && <div className="ai-tag">◎ AI ANALYST</div>}
                          {m.text}
                        </div>
                      ))}
                      {chatLoad && <div className="bubble ai"><div className="ai-tag">◎ AI ANALYST</div><div className="loading-dots"><span /><span /><span /></div></div>}
                    </div>
                    <div className="chat-inp-wrap">
                      <input className="chat-inp" value={chatQ} onChange={e => setChatQ(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="마케팅 데이터에 대해 질문하세요..." />
                      <button className="btn btn-lo" onClick={sendChat} disabled={chatLoad}>전송</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
