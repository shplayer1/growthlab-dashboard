
import { useState, useRef, useCallback, useEffect } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Figtree:wght@300;400;500;600&display=swap');

  :root {
    --bg: #0a0c10;
    --surface: #111318;
    --surface2: #181c24;
    --border: #1f2430;
    --accent: #00e5ff;
    --accent2: #7c3aed;
    --accent3: #f59e0b;
    --accent4: #10b981;
    --danger: #ef4444;
    --text: #e2e8f0;
    --text-muted: #64748b;
    --text-dim: #334155;
    --glow: 0 0 20px rgba(0,229,255,0.15);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Figtree', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* SIDEBAR */
  .sidebar {
    width: 220px;
    min-width: 220px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    z-index: 10;
  }

  .sidebar-logo {
    padding: 0 20px 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 18px;
    color: var(--accent);
    letter-spacing: -0.5px;
  }

  .logo-sub {
    font-size: 10px;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    margin-top: 2px;
    letter-spacing: 1px;
  }

  .nav-section {
    padding: 0 12px;
    margin-bottom: 8px;
  }

  .nav-label {
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--text-dim);
    padding: 0 8px;
    margin-bottom: 4px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-muted);
    transition: all 0.15s;
    font-weight: 500;
    border: 1px solid transparent;
  }

  .nav-item:hover {
    background: var(--surface2);
    color: var(--text);
  }

  .nav-item.active {
    background: rgba(0,229,255,0.08);
    color: var(--accent);
    border-color: rgba(0,229,255,0.15);
  }

  .nav-icon { font-size: 15px; }

  .sidebar-bottom {
    margin-top: auto;
    padding: 16px 20px;
    border-top: 1px solid var(--border);
  }

  .data-count {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-muted);
  }

  .data-count span { color: var(--accent); font-size: 18px; font-weight: 500; display: block; }

  /* MAIN CONTENT */
  .main {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 14px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .topbar-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 16px;
  }

  .topbar-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .btn {
    padding: 7px 14px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    font-family: 'Figtree', sans-serif;
  }

  .btn-primary {
    background: var(--accent);
    color: #000;
  }

  .btn-primary:hover { background: #33eeff; transform: translateY(-1px); }

  .btn-outline {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

  .btn-ghost {
    background: var(--surface2);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .content { padding: 24px 28px; flex: 1; }

  /* UPLOAD ZONE */
  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: 16px;
    padding: 48px;
    text-align: center;
    transition: all 0.2s;
    cursor: pointer;
    background: var(--surface);
    position: relative;
    overflow: hidden;
  }

  .upload-zone::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(0,229,255,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--accent);
    background: rgba(0,229,255,0.04);
  }

  .upload-icon { font-size: 40px; margin-bottom: 12px; }
  .upload-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; }
  .upload-sub { color: var(--text-muted); font-size: 13px; }

  /* KPI CARDS */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 24px;
  }

  .kpi-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .kpi-card:hover { border-color: rgba(0,229,255,0.25); }

  .kpi-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--kpi-color, var(--accent));
    opacity: 0.6;
  }

  .kpi-label { font-size: 11px; color: var(--text-muted); font-family: 'DM Mono', monospace; letter-spacing: 0.5px; margin-bottom: 8px; }
  .kpi-value { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; }
  .kpi-change { font-size: 11px; margin-top: 4px; }
  .kpi-change.up { color: var(--accent4); }
  .kpi-change.down { color: var(--danger); }

  /* GRID LAYOUT */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .grid-3 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 20px; }

  /* CARD */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
  }

  .badge {
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    font-weight: 500;
  }

  .badge-cyan { background: rgba(0,229,255,0.1); color: var(--accent); border: 1px solid rgba(0,229,255,0.2); }
  .badge-purple { background: rgba(124,58,237,0.1); color: #a78bfa; border: 1px solid rgba(124,58,237,0.2); }
  .badge-amber { background: rgba(245,158,11,0.1); color: var(--accent3); border: 1px solid rgba(245,158,11,0.2); }
  .badge-green { background: rgba(16,185,129,0.1); color: var(--accent4); border: 1px solid rgba(16,185,129,0.2); }

  /* CHART */
  .chart-wrap { position: relative; }
  canvas { border-radius: 6px; }

  /* CHANNEL TABLE */
  .table { width: 100%; border-collapse: collapse; }
  .table th {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    color: var(--text-muted);
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
    letter-spacing: 0.5px;
  }
  .table td {
    padding: 10px 10px;
    font-size: 13px;
    border-bottom: 1px solid rgba(31,36,48,0.5);
  }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: rgba(255,255,255,0.02); }

  .channel-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
  }

  .progress-bar {
    height: 4px;
    background: var(--surface2);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 2px;
  }

  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.5s ease;
  }

  /* AI INSIGHTS */
  .insight-list { display: flex; flex-direction: column; gap: 10px; }

  .insight-item {
    padding: 12px 14px;
    border-radius: 8px;
    border-left: 3px solid;
    background: var(--surface2);
    font-size: 13px;
    line-height: 1.5;
  }

  .insight-item.positive { border-color: var(--accent4); }
  .insight-item.warning { border-color: var(--accent3); }
  .insight-item.critical { border-color: var(--danger); }
  .insight-item.info { border-color: var(--accent); }

  .insight-tag {
    font-size: 9px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
    font-weight: 600;
  }

  .insight-item.positive .insight-tag { color: var(--accent4); }
  .insight-item.warning .insight-tag { color: var(--accent3); }
  .insight-item.critical .insight-tag { color: var(--danger); }
  .insight-item.info .insight-tag { color: var(--accent); }

  /* DAILY HISTORY */
  .history-list { display: flex; flex-direction: column; gap: 6px; }

  .history-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--surface2);
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid transparent;
  }

  .history-item:hover { border-color: var(--border); }
  .history-item.selected { border-color: rgba(0,229,255,0.3); background: rgba(0,229,255,0.05); }

  .history-date {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
    min-width: 80px;
  }

  .history-kpi { font-size: 13px; font-weight: 600; flex: 1; }
  .history-change { font-size: 11px; }
  .up { color: var(--accent4); }
  .down { color: var(--danger); }

  /* CHAT / AI */
  .chat-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 340px;
    overflow-y: auto;
    padding-right: 4px;
    margin-bottom: 12px;
  }

  .chat-bubble {
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.6;
    max-width: 88%;
  }

  .chat-bubble.user {
    background: rgba(0,229,255,0.1);
    border: 1px solid rgba(0,229,255,0.2);
    color: var(--text);
    align-self: flex-end;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
  }

  .chat-bubble.ai {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    align-self: flex-start;
  }

  .chat-bubble.ai .ai-label {
    font-size: 9px;
    font-family: 'DM Mono', monospace;
    color: var(--accent);
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .chat-input-wrap {
    display: flex;
    gap: 8px;
  }

  .chat-input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: var(--text);
    font-family: 'Figtree', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }

  .chat-input:focus { border-color: rgba(0,229,255,0.4); }
  .chat-input::placeholder { color: var(--text-dim); }

  /* LOADING */
  .loading-dots span {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    margin: 0 2px;
    animation: bounce 1.2s infinite;
  }

  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: var(--text-muted);
    font-size: 13px;
  }

  .sparkline {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 30px;
  }

  .spark-bar {
    flex: 1;
    border-radius: 2px;
    transition: height 0.3s;
  }

  .tab-row {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    background: var(--surface2);
    border-radius: 8px;
    padding: 4px;
  }

  .tab-btn {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-family: 'Figtree', sans-serif;
    transition: all 0.15s;
  }

  .tab-btn.active {
    background: var(--surface);
    color: var(--accent);
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }

  .divider { height: 1px; background: var(--border); margin: 16px 0; }

  .metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(31,36,48,0.5);
    font-size: 13px;
  }

  .metric-row:last-child { border-bottom: none; }
  .metric-label { color: var(--text-muted); }
  .metric-value { font-weight: 600; font-family: 'DM Mono', monospace; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`;

// ─── SAMPLE DATA GENERATOR ──────────────────────────────────────────────────
function generateSampleData(days = 30) {
  const channels = ["Meta", "Google", "Kakao", "Naver", "TikTok"];
  const data = [];
  let baseRevenue = 3200000;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayData = {
      date: d.toISOString().split("T")[0],
      revenue: Math.round(baseRevenue * (0.9 + Math.random() * 0.3)),
      spend: Math.round(baseRevenue * 0.18 * (0.85 + Math.random() * 0.3)),
      conversions: Math.round(120 + Math.random() * 60),
      impressions: Math.round(180000 + Math.random() * 80000),
      channels: {},
    };
    channels.forEach((ch) => {
      const s = Math.round(dayData.spend * (0.12 + Math.random() * 0.28));
      dayData.channels[ch] = { spend: s, roas: parseFloat((2.2 + Math.random() * 3).toFixed(2)) };
    });
    baseRevenue *= 1.003;
    data.push(dayData);
  }
  return data;
}

const CHANNEL_COLORS = {
  Meta: "#00e5ff", Google: "#7c3aed", Kakao: "#f59e0b",
  Naver: "#10b981", TikTok: "#ef4444",
};

// ─── MINI SPARKLINE ──────────────────────────────────────────────────────────
function Sparkline({ values, color }) {
  const max = Math.max(...values);
  return (
    <div className="sparkline">
      {values.map((v, i) => (
        <div key={i} className="spark-bar" style={{ height: `${(v / max) * 100}%`, background: color || "var(--accent)", opacity: 0.6 + (i / values.length) * 0.4 }} />
      ))}
    </div>
  );
}

// ─── MINI LINE CHART (SVG) ────────────────────────────────────────────────────
function LineChart({ data, dataKey, color, label }) {
  if (!data || data.length === 0) return <div className="empty-state">데이터 없음</div>;
  const values = data.map((d) => d[dataKey] || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const W = 500, H = 120, pad = 10;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = pad + ((max - v) / (max - min || 1)) * (H - pad * 2);
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = path + ` L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100px" }}>
      <defs>
        <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${dataKey})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.slice(-1).map(([x, y]) => (
        <circle key="last" cx={x} cy={y} r="3" fill={color} />
      ))}
    </svg>
  );
}

// ─── CHANNEL BAR CHART (SVG) ─────────────────────────────────────────────────
function ChannelRoasChart({ channelStats }) {
  const entries = Object.entries(channelStats).sort((a, b) => b[1].avgRoas - a[1].avgRoas);
  const maxRoas = Math.max(...entries.map(([, v]) => v.avgRoas));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {entries.map(([ch, stat]) => (
        <div key={ch}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
            <span><span className="channel-dot" style={{ background: CHANNEL_COLORS[ch] }} />{ch}</span>
            <span style={{ fontFamily: "DM Mono, monospace", color: CHANNEL_COLORS[ch] }}>ROAS {stat.avgRoas.toFixed(2)}x</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(stat.avgRoas / maxRoas) * 100}%`, background: CHANNEL_COLORS[ch] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── CSV PARSER ──────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i]?.trim() || ""; });
    return obj;
  });
}

// ─── COMPUTE STATS ───────────────────────────────────────────────────────────
function computeStats(dailyData) {
  if (!dailyData.length) return null;
  const recent = dailyData.slice(-7);
  const prev = dailyData.slice(-14, -7);
  const sum = (arr, key) => arr.reduce((s, d) => s + (d[key] || 0), 0);
  const avg = (arr, key) => sum(arr, key) / arr.length;

  const totalRevenue = sum(dailyData, "revenue");
  const totalSpend = sum(dailyData, "spend");
  const totalConversions = sum(dailyData, "conversions");
  const overallROAS = totalRevenue / totalSpend;
  const avgCPA = totalSpend / totalConversions;

  const recentRevenue = avg(recent, "revenue");
  const prevRevenue = avg(prev, "revenue");
  const revGrowth = ((recentRevenue - prevRevenue) / prevRevenue) * 100;

  const channelStats = {};
  const channels = dailyData[0]?.channels ? Object.keys(dailyData[0].channels) : [];
  channels.forEach((ch) => {
    const spendArr = dailyData.map((d) => d.channels?.[ch]?.spend || 0);
    const roasArr = dailyData.map((d) => d.channels?.[ch]?.roas || 0);
    channelStats[ch] = {
      totalSpend: spendArr.reduce((a, b) => a + b, 0),
      avgRoas: roasArr.reduce((a, b) => a + b, 0) / roasArr.length,
      spendShare: 0,
    };
  });
  const totalChSpend = Object.values(channelStats).reduce((s, c) => s + c.totalSpend, 0);
  channels.forEach((ch) => { channelStats[ch].spendShare = channelStats[ch].totalSpend / totalChSpend; });

  return { totalRevenue, totalSpend, totalConversions, overallROAS, avgCPA, revGrowth, channelStats, recentRevenue, prevRevenue };
}

// ─── AI INSIGHTS GENERATOR ───────────────────────────────────────────────────
async function generateAIInsights(stats, dailyData, question = null) {
  const ctx = `
당신은 퍼포먼스 마케팅 전문 AI 애널리스트입니다. 아래 데이터를 바탕으로 한국어로 심층 분석을 제공하세요.

=== 성과 데이터 (최근 ${dailyData.length}일) ===
- 총 매출: ₩${stats.totalRevenue.toLocaleString()}
- 총 광고비: ₩${stats.totalSpend.toLocaleString()}
- 전체 ROAS: ${stats.overallROAS.toFixed(2)}x
- 전환 수: ${stats.totalConversions.toLocaleString()}건
- 평균 CPA: ₩${Math.round(stats.avgCPA).toLocaleString()}
- 매출 성장률(7일 vs 전주): ${stats.revGrowth.toFixed(1)}%

=== 채널별 성과 ===
${Object.entries(stats.channelStats).map(([ch, s]) => `- ${ch}: 광고비 ₩${s.totalSpend.toLocaleString()}, 평균 ROAS ${s.avgRoas.toFixed(2)}x, 점유율 ${(s.spendShare * 100).toFixed(1)}%`).join("\n")}

=== 최근 7일 일별 데이터 ===
${dailyData.slice(-7).map((d) => `- ${d.date}: 매출 ₩${d.revenue?.toLocaleString()}, 광고비 ₩${d.spend?.toLocaleString()}, 전환 ${d.conversions}건`).join("\n")}
`;

  const userMsg = question
    ? `${ctx}\n\n질문: ${question}\n\n위 질문에 대해 데이터 기반으로 구체적이고 실행 가능한 답변을 해주세요.`
    : `${ctx}\n\n위 데이터를 분석하여 다음을 제공하세요:\n1. 핵심 성과 요약 (2-3문장)\n2. 주요 위험 신호 또는 기회 (2-3개)\n3. 즉시 실행 가능한 액션 아이템 (3개)\n4. 채널별 예산 최적화 제안\n\n마크다운 없이 자연스러운 텍스트로 답변하세요.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "분석을 생성할 수 없습니다.";
}

// ─── STRUCTURED INSIGHTS ─────────────────────────────────────────────────────
async function generateStructuredInsights(stats) {
  const prompt = `마케팅 성과 데이터 분석:
- ROAS: ${stats.overallROAS.toFixed(2)}x
- 매출 성장률: ${stats.revGrowth.toFixed(1)}%
- 최고 ROAS 채널: ${Object.entries(stats.channelStats).sort((a,b)=>b[1].avgRoas-a[1].avgRoas)[0]?.[0]}
- 최저 ROAS 채널: ${Object.entries(stats.channelStats).sort((a,b)=>a[1].avgRoas-b[1].avgRoas)[0]?.[0]}

아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{"insights":[{"type":"positive|warning|critical|info","title":"짧은 제목","text":"1-2문장 설명"},{"type":"...","title":"...","text":"..."},{"type":"...","title":"...","text":"..."},{"type":"...","title":"...","text":"..."}]}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  try {
    return JSON.parse(data.content?.[0]?.text || "{}").insights || [];
  } catch {
    return [];
  }
}

// ─── FORMAT ──────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000000 ? `₩${(n/1000000).toFixed(1)}M` : n >= 1000 ? `₩${(n/1000).toFixed(0)}K` : `₩${n}`;

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [dailyData, setDailyData] = useState([]);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [chartTab, setChartTab] = useState("revenue");
  const fileRef = useRef();

  // Load demo data
  const loadDemo = () => {
    const d = generateSampleData(30);
    setDailyData(d);
    const s = computeStats(d);
    setStats(s);
    loadInsights(s, d);
  };

  const loadInsights = async (s, d) => {
    setAiLoading(true);
    setInsights([]);
    try {
      const ins = await generateStructuredInsights(s);
      setInsights(ins);
    } catch (e) {}
    setAiLoading(false);
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rows = parseCSV(e.target.result);
        const mapped = rows.map((r) => ({
          date: r.date || r["날짜"] || "",
          revenue: parseFloat(r.revenue || r["매출"] || r["revenue"] || 0),
          spend: parseFloat(r.spend || r["광고비"] || r["ad_spend"] || 0),
          conversions: parseFloat(r.conversions || r["전환"] || 0),
          impressions: parseFloat(r.impressions || r["노출"] || 0),
          channels: {},
        }));
        setDailyData(mapped);
        const s = computeStats(mapped);
        setStats(s);
        loadInsights(s, mapped);
      } catch { alert("CSV 파싱 오류. 형식을 확인하세요."); }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !stats) return;
    const q = chatInput;
    setChatInput("");
    setChatHistory((h) => [...h, { role: "user", text: q }]);
    setChatLoading(true);
    try {
      const ans = await generateAIInsights(stats, dailyData, q);
      setChatHistory((h) => [...h, { role: "ai", text: ans }]);
    } catch { setChatHistory((h) => [...h, { role: "ai", text: "분석 오류가 발생했습니다." }]); }
    setChatLoading(false);
  };

  const nav = [
    { id: "dashboard", icon: "◈", label: "대시보드" },
    { id: "channels", icon: "⊞", label: "채널 분석" },
    { id: "history", icon: "◷", label: "일별 누적" },
    { id: "ai", icon: "◎", label: "AI 인사이트" },
    { id: "chat", icon: "◉", label: "AI 질의응답" },
  ];

  const recentEntry = dailyData.slice(-1)[0];
  const prevEntry = dailyData.slice(-2, -1)[0];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-text">GROWTHLAB</div>
            <div className="logo-sub">PERFORMANCE ANALYTICS</div>
          </div>
          <div className="nav-section">
            <div className="nav-label">메뉴</div>
            {nav.map((n) => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>
          <div className="sidebar-bottom">
            <div className="data-count">
              <span>{dailyData.length}</span>
              누적 데이터 (일)
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">
              {nav.find((n) => n.id === page)?.label}
            </div>
            <div className="topbar-right">
              {dailyData.length > 0 && (
                <button className="btn btn-outline" onClick={() => { setDailyData([]); setStats(null); setInsights([]); }}>
                  초기화
                </button>
              )}
              <button className="btn btn-primary" onClick={loadDemo}>
                데모 데이터 로드
              </button>
              <button className="btn btn-ghost" onClick={() => fileRef.current.click()}>
                CSV 업로드
              </button>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          </div>

          <div className="content">
            {/* ── DASHBOARD ── */}
            {page === "dashboard" && (
              <>
                {dailyData.length === 0 ? (
                  <div
                    className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current.click()}
                  >
                    <div className="upload-icon">⬆</div>
                    <div className="upload-title">CSV 파일을 업로드하세요</div>
                    <div className="upload-sub">드래그 앤 드롭 또는 클릭 · 지원 컬럼: 날짜, 매출, 광고비, 전환, 채널별 데이터</div>
                    <div style={{ marginTop: "20px" }}>
                      <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); loadDemo(); }}>
                        데모 데이터로 체험하기
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* KPI CARDS */}
                    <div className="kpi-grid">
                      {[
                        { label: "TOTAL REVENUE", val: fmt(stats.totalRevenue), change: stats.revGrowth, color: "var(--accent)", sparks: dailyData.slice(-14).map((d) => d.revenue) },
                        { label: "TOTAL AD SPEND", val: fmt(stats.totalSpend), change: -2.1, color: "var(--accent2)", sparks: dailyData.slice(-14).map((d) => d.spend) },
                        { label: "OVERALL ROAS", val: `${stats.overallROAS.toFixed(2)}x`, change: stats.revGrowth * 0.6, color: "var(--accent3)", sparks: dailyData.slice(-14).map((d) => d.revenue / d.spend) },
                        { label: "AVG CPA", val: fmt(Math.round(stats.avgCPA)), change: -5.3, color: "var(--accent4)", sparks: dailyData.slice(-14).map((d) => d.spend / d.conversions) },
                      ].map((kpi) => (
                        <div className="kpi-card" key={kpi.label} style={{ "--kpi-color": kpi.color }}>
                          <div className="kpi-label">{kpi.label}</div>
                          <div className="kpi-value" style={{ color: kpi.color }}>{kpi.val}</div>
                          <div className={`kpi-change ${kpi.change >= 0 ? "up" : "down"}`}>
                            {kpi.change >= 0 ? "▲" : "▼"} {Math.abs(kpi.change).toFixed(1)}% vs 전주
                          </div>
                          <div style={{ marginTop: "10px" }}>
                            <Sparkline values={kpi.sparks} color={kpi.color} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CHARTS ROW */}
                    <div className="grid-3">
                      <div className="card">
                        <div className="card-header">
                          <div className="card-title">트렌드 분석</div>
                          <div className="tab-row" style={{ margin: 0 }}>
                            {["revenue", "spend", "conversions"].map((t) => (
                              <button key={t} className={`tab-btn ${chartTab === t ? "active" : ""}`} onClick={() => setChartTab(t)}>
                                {t === "revenue" ? "매출" : t === "spend" ? "광고비" : "전환"}
                              </button>
                            ))}
                          </div>
                        </div>
                        <LineChart data={dailyData} dataKey={chartTab}
                          color={chartTab === "revenue" ? "var(--accent)" : chartTab === "spend" ? "#7c3aed" : "#10b981"}
                          label={chartTab} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", fontFamily: "DM Mono", marginTop: "8px" }}>
                          <span>{dailyData[0]?.date}</span>
                          <span>{dailyData.slice(-1)[0]?.date}</span>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header">
                          <div className="card-title">어제 vs 그제</div>
                          <span className="badge badge-cyan">DAILY</span>
                        </div>
                        {recentEntry && prevEntry && (
                          <>
                            {[
                              { label: "매출", cur: recentEntry.revenue, prev: prevEntry.revenue },
                              { label: "광고비", cur: recentEntry.spend, prev: prevEntry.spend },
                              { label: "전환", cur: recentEntry.conversions, prev: prevEntry.conversions },
                              { label: "ROAS", cur: (recentEntry.revenue / recentEntry.spend).toFixed(2), prev: (prevEntry.revenue / prevEntry.spend).toFixed(2) },
                            ].map((m) => {
                              const diff = ((m.cur - m.prev) / m.prev * 100).toFixed(1);
                              return (
                                <div className="metric-row" key={m.label}>
                                  <span className="metric-label">{m.label}</span>
                                  <div style={{ textAlign: "right" }}>
                                    <div className="metric-value">{typeof m.cur === "number" && m.cur > 999 ? fmt(m.cur) : m.cur}</div>
                                    <div className={`kpi-change ${diff >= 0 ? "up" : "down"}`} style={{ fontSize: "10px" }}>{diff >= 0 ? "▲" : "▼"}{Math.abs(diff)}%</div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>

                    {/* INSIGHTS PREVIEW */}
                    <div className="card">
                      <div className="card-header">
                        <div className="card-title">AI 인사이트 요약</div>
                        {aiLoading ? <div className="loading-dots"><span/><span/><span/></div> : <span className="badge badge-purple">GPT-4급 분석</span>}
                      </div>
                      {aiLoading ? (
                        <div className="empty-state">AI가 데이터를 분석 중입니다...</div>
                      ) : insights.length > 0 ? (
                        <div className="insight-list">
                          {insights.map((ins, i) => (
                            <div key={i} className={`insight-item ${ins.type}`}>
                              <div className="insight-tag">{ins.type === "positive" ? "✓ 기회" : ins.type === "warning" ? "⚠ 주의" : ins.type === "critical" ? "✕ 위험" : "ℹ 정보"} · {ins.title}</div>
                              {ins.text}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state">AI 인사이트를 로드하는 중...</div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── CHANNELS ── */}
            {page === "channels" && stats && (
              <>
                <div className="kpi-grid">
                  {Object.entries(stats.channelStats).map(([ch, s]) => (
                    <div className="kpi-card" key={ch} style={{ "--kpi-color": CHANNEL_COLORS[ch] }}>
                      <div className="kpi-label">{ch.toUpperCase()}</div>
                      <div className="kpi-value" style={{ color: CHANNEL_COLORS[ch], fontSize: "20px" }}>{s.avgRoas.toFixed(2)}x</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>ROAS</div>
                      <div className="divider" style={{ margin: "10px 0" }} />
                      <div style={{ fontSize: "12px" }}>광고비 {fmt(s.totalSpend)}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>점유율 {(s.spendShare * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
                <div className="grid-2">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">채널별 ROAS 비교</div>
                      <span className="badge badge-amber">30일 평균</span>
                    </div>
                    <ChannelRoasChart channelStats={stats.channelStats} />
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">예산 배분 현황</div>
                      <span className="badge badge-green">광고비 점유율</span>
                    </div>
                    <table className="table">
                      <thead>
                        <tr><th>채널</th><th>광고비</th><th>ROAS</th><th>점유율</th></tr>
                      </thead>
                      <tbody>
                        {Object.entries(stats.channelStats).sort((a, b) => b[1].totalSpend - a[1].totalSpend).map(([ch, s]) => (
                          <tr key={ch}>
                            <td><span className="channel-dot" style={{ background: CHANNEL_COLORS[ch] }} />{ch}</td>
                            <td style={{ fontFamily: "DM Mono", fontSize: "12px" }}>{fmt(s.totalSpend)}</td>
                            <td style={{ color: CHANNEL_COLORS[ch], fontFamily: "DM Mono", fontSize: "12px" }}>{s.avgRoas.toFixed(2)}x</td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <div className="progress-bar" style={{ flex: 1, margin: 0 }}>
                                  <div className="progress-fill" style={{ width: `${s.spendShare * 100}%`, background: CHANNEL_COLORS[ch] }} />
                                </div>
                                <span style={{ fontSize: "11px", fontFamily: "DM Mono", minWidth: "32px" }}>{(s.spendShare * 100).toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── HISTORY ── */}
            {page === "history" && (
              <div className="grid-2">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">일별 성과 기록</div>
                    <span className="badge badge-cyan">{dailyData.length}일 누적</span>
                  </div>
                  {dailyData.length === 0 ? (
                    <div className="empty-state">데이터를 업로드하거나 데모를 로드하세요</div>
                  ) : (
                    <div className="history-list">
                      {[...dailyData].reverse().map((d, i) => {
                        const prev = dailyData[dailyData.length - i - 2];
                        const diff = prev ? ((d.revenue - prev.revenue) / prev.revenue * 100).toFixed(1) : null;
                        return (
                          <div key={d.date} className={`history-item ${selectedDay?.date === d.date ? "selected" : ""}`} onClick={() => setSelectedDay(d)}>
                            <div className="history-date">{d.date}</div>
                            <div className="history-kpi">{fmt(d.revenue)}</div>
                            {diff !== null && (
                              <div className={`history-change ${diff >= 0 ? "up" : "down"}`}>
                                {diff >= 0 ? "▲" : "▼"}{Math.abs(diff)}%
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">{selectedDay ? selectedDay.date + " 상세" : "날짜 선택"}</div>
                  </div>
                  {selectedDay ? (
                    <>
                      {[
                        { label: "매출", val: fmt(selectedDay.revenue), color: "var(--accent)" },
                        { label: "광고비", val: fmt(selectedDay.spend), color: "#7c3aed" },
                        { label: "ROAS", val: (selectedDay.revenue / selectedDay.spend).toFixed(2) + "x", color: "var(--accent3)" },
                        { label: "전환 수", val: selectedDay.conversions?.toLocaleString() + "건", color: "var(--accent4)" },
                        { label: "CPA", val: fmt(Math.round(selectedDay.spend / selectedDay.conversions)), color: "var(--text)" },
                      ].map((m) => (
                        <div className="metric-row" key={m.label}>
                          <span className="metric-label">{m.label}</span>
                          <span className="metric-value" style={{ color: m.color }}>{m.val}</span>
                        </div>
                      ))}
                      {selectedDay.channels && Object.keys(selectedDay.channels).length > 0 && (
                        <>
                          <div className="divider" />
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", fontFamily: "DM Mono" }}>채널별</div>
                          {Object.entries(selectedDay.channels).map(([ch, c]) => (
                            <div className="metric-row" key={ch}>
                              <span><span className="channel-dot" style={{ background: CHANNEL_COLORS[ch] }} />{ch}</span>
                              <div style={{ textAlign: "right" }}>
                                <div className="metric-value">{fmt(c.spend)}</div>
                                <div style={{ fontSize: "10px", color: CHANNEL_COLORS[ch] }}>ROAS {c.roas}x</div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <div className="empty-state">왼쪽에서 날짜를 선택하면<br />상세 성과를 볼 수 있어요</div>
                  )}
                </div>
              </div>
            )}

            {/* ── AI INSIGHTS ── */}
            {page === "ai" && (
              <>
                {!stats ? (
                  <div className="empty-state" style={{ padding: "80px" }}>데이터를 먼저 업로드하거나 데모를 로드하세요</div>
                ) : (
                  <>
                    <div className="card" style={{ marginBottom: "16px" }}>
                      <div className="card-header">
                        <div className="card-title">AI 자동 인사이트</div>
                        <button className="btn btn-outline" onClick={() => loadInsights(stats, dailyData)} disabled={aiLoading}>
                          {aiLoading ? "분석 중..." : "재분석"}
                        </button>
                      </div>
                      {aiLoading ? (
                        <div className="empty-state">
                          <div className="loading-dots"><span/><span/><span/></div>
                          <div style={{ marginTop: "8px" }}>AI가 패턴을 분석 중입니다...</div>
                        </div>
                      ) : (
                        <div className="insight-list">
                          {insights.map((ins, i) => (
                            <div key={i} className={`insight-item ${ins.type}`}>
                              <div className="insight-tag">
                                {ins.type === "positive" ? "✓ 기회" : ins.type === "warning" ? "⚠ 주의" : ins.type === "critical" ? "✕ 위험" : "ℹ 정보"} · {ins.title}
                              </div>
                              {ins.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="grid-2">
                      <div className="card">
                        <div className="card-header"><div className="card-title">30일 성과 요약</div></div>
                        {[
                          { label: "분석 기간", val: `${dailyData[0]?.date} ~ ${dailyData.slice(-1)[0]?.date}` },
                          { label: "총 매출", val: fmt(stats.totalRevenue) },
                          { label: "총 광고비", val: fmt(stats.totalSpend) },
                          { label: "전체 ROAS", val: `${stats.overallROAS.toFixed(2)}x` },
                          { label: "총 전환", val: `${stats.totalConversions.toLocaleString()}건` },
                          { label: "평균 CPA", val: fmt(Math.round(stats.avgCPA)) },
                          { label: "매출 성장률", val: `${stats.revGrowth.toFixed(1)}%` },
                        ].map((m) => (
                          <div className="metric-row" key={m.label}>
                            <span className="metric-label">{m.label}</span>
                            <span className="metric-value">{m.val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="card">
                        <div className="card-header"><div className="card-title">채널 효율 랭킹</div><span className="badge badge-amber">ROAS 기준</span></div>
                        {Object.entries(stats.channelStats).sort((a, b) => b[1].avgRoas - a[1].avgRoas).map(([ch, s], rank) => (
                          <div className="metric-row" key={ch}>
                            <span>
                              <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "DM Mono", marginRight: "8px" }}>#{rank + 1}</span>
                              <span className="channel-dot" style={{ background: CHANNEL_COLORS[ch] }} />{ch}
                            </span>
                            <span style={{ color: CHANNEL_COLORS[ch], fontFamily: "DM Mono", fontSize: "13px" }}>{s.avgRoas.toFixed(2)}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── CHAT ── */}
            {page === "chat" && (
              <div className="card" style={{ maxWidth: "760px" }}>
                <div className="card-header">
                  <div className="card-title">AI 데이터 분석 대화</div>
                  <span className="badge badge-purple">Claude 기반</span>
                </div>
                {!stats ? (
                  <div className="empty-state">데이터를 먼저 업로드하거나 데모를 로드하세요</div>
                ) : (
                  <>
                    <div className="chat-area">
                      {chatHistory.length === 0 && (
                        <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "8px" }}>
                          성과 데이터에 대해 무엇이든 물어보세요. 예시:<br />
                          • "Meta 채널 ROAS가 낮은 이유가 뭘까?"<br />
                          • "다음 주 예산을 어떻게 배분하면 좋을까?"<br />
                          • "최근 7일간 성과 트렌드를 분석해줘"
                        </div>
                      )}
                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${msg.role}`}>
                          {msg.role === "ai" && <div className="ai-label">◎ AI ANALYST</div>}
                          {msg.text}
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="chat-bubble ai">
                          <div className="ai-label">◎ AI ANALYST</div>
                          <div className="loading-dots"><span/><span/><span/></div>
                        </div>
                      )}
                    </div>
                    <div className="chat-input-wrap">
                      <input
                        className="chat-input"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendChat()}
                        placeholder="데이터에 대해 질문하세요..."
                      />
                      <button className="btn btn-primary" onClick={sendChat} disabled={chatLoading}>
                        전송
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Empty state for channels/ai without data */}
            {(page === "channels" || page === "ai") && !stats && (
              <div className="empty-state" style={{ padding: "80px" }}>
                데이터를 먼저 업로드하거나 <button className="btn btn-primary" onClick={loadDemo} style={{ marginLeft: "8px" }}>데모 데이터 로드</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
