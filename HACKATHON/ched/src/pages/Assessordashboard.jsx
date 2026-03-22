import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ASSESSOR = {
  name: "Dr. Maria Santos",
  institution: "Polytechnic University of the Philippines",
  role: "ETEEAP Assessor",
};

const APPLICANTS = [
  {
    id: "a1",
    name: "Juan dela Cruz",
    degree: "BS Information Technology",
    jobTitle: "Technical / Repair Technician",
    yearsExp: 6,
    docsSubmitted: 5,
    aiScore: 94,
    gapCount: 2,
    status: "ready",
    submittedDate: "Feb 18, 2026",
    flag: "High Readiness",
    flagColor: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE" },
  },
  {
    id: "a2",
    name: "Maria Reyes",
    degree: "BS Business Administration",
    jobTitle: "Salesperson / Agent",
    yearsExp: 8,
    docsSubmitted: 4,
    aiScore: 81,
    gapCount: 4,
    status: "review",
    submittedDate: "Feb 17, 2026",
    flag: "Needs Review",
    flagColor: { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8" },
  },
  {
    id: "a3",
    name: "Roberto Magsino",
    degree: "BS Criminology",
    jobTitle: "Security Guard",
    yearsExp: 11,
    docsSubmitted: 6,
    aiScore: 89,
    gapCount: 3,
    status: "ready",
    submittedDate: "Feb 16, 2026",
    flag: "High Readiness",
    flagColor: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE" },
  },
  {
    id: "a4",
    name: "Lorna Valdez",
    degree: "BS Nursing",
    jobTitle: "Barangay Health Worker",
    yearsExp: 7,
    docsSubmitted: 3,
    aiScore: 67,
    gapCount: 6,
    status: "incomplete",
    submittedDate: "Feb 15, 2026",
    flag: "Incomplete Docs",
    flagColor: { bg: "#FFF0F0", text: "#C62828", border: "#FECDCA" },
  },
  {
    id: "a5",
    name: "Dennis Castillo",
    degree: "BS Hospitality Management",
    jobTitle: "Driver / Transport",
    yearsExp: 5,
    docsSubmitted: 4,
    aiScore: 75,
    gapCount: 5,
    status: "review",
    submittedDate: "Feb 14, 2026",
    flag: "Needs Review",
    flagColor: { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8" },
  },
  {
    id: "a6",
    name: "Ana Bautista",
    degree: "BS Education",
    jobTitle: "Barangay Health Worker",
    yearsExp: 9,
    docsSubmitted: 5,
    aiScore: 91,
    gapCount: 2,
    status: "ready",
    submittedDate: "Feb 13, 2026",
    flag: "High Readiness",
    flagColor: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE" },
  },
];

function ScoreRing({ score, size = 46 }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 85 ? "#2E7D32" : score >= 70 ? "#B45309" : "#C62828";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0EDE8" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", color }}>{score}</span>
      </div>
    </div>
  );
}

export default function AssessorDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");

  const filtered = APPLICANTS
    .filter(a => filter === "All" || a.status === filter)
    .filter(a => !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.degree.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "score" ? b.aiScore - a.aiScore :
      sortBy === "gaps" ? a.gapCount - b.gapCount :
      0
    );

  const readyCount = APPLICANTS.filter(a => a.status === "ready").length;
  const reviewCount = APPLICANTS.filter(a => a.status === "review").length;
  const avgScore = Math.round(APPLICANTS.reduce((s, a) => s + a.aiScore, 0) / APPLICANTS.length);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input, select { font-family: inherit; cursor: pointer; }
        input:focus, select:focus { outline: none; }
        .btn-primary:hover { background: #2C2925 !important; }
        .btn-outline:hover { background: #F5F3F0 !important; }
        .nav-item:hover { background: rgba(247,246,243,0.07) !important; }
        .applicant-row:hover { background: #FAFAF8 !important; border-color: #C4BFB6 !important; }
        .filter-chip:hover { border-color: #1A1814 !important; color: #1A1814 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD8D0; border-radius: 99px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: "256px", background: "#1A1814", padding: "36px 28px", display: "flex", flexDirection: "column", flexShrink: 0, position: "fixed", top: 0, left: 0, height: "100vh", overflowY: "auto", zIndex: 10 }}>
        {/* Brand */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "4px" }}>
            <div style={{ width: "24px", height: "24px", background: "#F7F6F3", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <rect x="1" y="1" width="5" height="5" fill="#1A1814" />
                <rect x="7.5" y="1" width="4.5" height="4.5" fill="#1A1814" />
                <rect x="1" y="7.5" width="4.5" height="4.5" fill="#1A1814" />
                <rect x="7.5" y="7.5" width="4.5" height="4.5" fill="#1A1814" opacity="0.3" />
              </svg>
            </div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#F7F6F3", letterSpacing: "0.04em" }}>SKILLSET</span>
          </div>
          <p style={{ fontSize: "9px", color: "#2E2B27", letterSpacing: "0.1em", textTransform: "uppercase", paddingLeft: "33px" }}>Assessor Portal</p>
        </div>

        {/* Assessor card */}
        <div style={{ padding: "14px 16px", background: "rgba(247,246,243,0.04)", border: "1px solid #252219", borderRadius: "8px", marginBottom: "28px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#2E2B27", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#F7F6F3" }}>MS</span>
          </div>
          <div style={{ fontSize: "12px", fontWeight: "500", color: "#F7F6F3", marginBottom: "2px" }}>{ASSESSOR.name}</div>
          <div style={{ fontSize: "10px", color: "#6E685F", marginBottom: "2px" }}>{ASSESSOR.role}</div>
          <div style={{ fontSize: "10px", color: "#3A3631" }}>PUP</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {[
            { label: "Dashboard", active: true, path: "/assessor", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg> },
            { label: "AI Audit", active: false, path: "/assessor/audit/a1", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.3 4h4.2L9 7.5l1.5 4.5L7 9.5l-3.5 2.5L5 7.5 1.5 5h4.2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
            { label: "Project Verification", active: false, path: "/assessor/projects", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { label: "Interview Scripts", active: false, path: "/assessor/interview", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 2H4a1 1 0 00-1 1v7a1 1 0 001 1h1l2 2 2-2h3a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
            { label: "Accreditation", active: false, path: "/assessor/accreditation", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          ].map((item) => (
            <button key={item.label} className="nav-item" onClick={() => navigate(item.path)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "6px", background: item.active ? "rgba(247,246,243,0.09)" : "transparent", border: "none", transition: "background 0.15s", textAlign: "left", width: "100%" }}>
              <span style={{ color: item.active ? "#F7F6F3" : "#3A3631", display: "flex", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: "12px", fontWeight: item.active ? "500" : "400", color: item.active ? "#F7F6F3" : "#3A3631" }}>{item.label}</span>
              {item.active && <div style={{ marginLeft: "auto", width: "4px", height: "4px", borderRadius: "50%", background: "#F7F6F3", flexShrink: 0 }} />}
            </button>
          ))}
        </nav>

        {/* Legal footer */}
        <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid #252219", borderRadius: "6px", marginTop: "20px" }}>
          <div style={{ fontSize: "9px", color: "#2E2B27", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontWeight: "500" }}>Legal Basis</div>
          <div style={{ fontSize: "11px", color: "#4A4540", lineHeight: "1.5" }}>Republic Act 12124</div>
          <div style={{ fontSize: "10px", color: "#2E2B27" }}>ETEEAP Act · 2025</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 72px" , marginLeft: "256px" }}>
        <div style={{ maxWidth: "900px" }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px", animation: "fadeUp 0.3s ease both" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Assessor Dashboard</p>
              <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#1A1814", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "6px" }}>
                Good morning, Dr. Santos.
              </h1>
              <p style={{ fontSize: "13px", color: "#A09990" }}>
                {APPLICANTS.length} applicants pending · Batch February 2026
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button className="btn-outline"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: "#fff", border: "1px solid #DDD8D0", borderRadius: "6px", fontSize: "12px", color: "#4A4540", fontWeight: "500", transition: "background 0.15s" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 9l3-3 2 2 3-4" stroke="#A09990" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="#A09990" strokeWidth="1.2"/></svg>
                Export Report
              </button>
              <button className="btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: "#1A1814", color: "#F7F6F3", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "500", transition: "background 0.2s" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.2 3.6H11L8 6.9l1.2 3.6L6 8.2l-3.2 2.3L4 6.9 1 4.6h3.8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                Run AI Audit
              </button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
            {[
              { label: "Total Applicants", value: APPLICANTS.length, sub: "this batch" },
              { label: "High Readiness", value: readyCount, sub: "ready for interview", cardBg: "#EEFAF0", cardBorder: "#C6E8CE", valueColor: "#2E7D32" },
              { label: "Needs Review", value: reviewCount, sub: "require attention", cardBg: "#FFF8F0", cardBorder: "#FDE8C8", valueColor: "#B45309" },
              { label: "Avg AI Score", value: `${avgScore}%`, sub: "across all applicants" },
            ].map((stat, i) => (
              <div key={i} style={{ background: stat.cardBg || "#fff", border: `1px solid ${stat.cardBorder || "#EAE7E2"}`, borderRadius: "10px", padding: "20px", animation: `fadeUp 0.3s ${0.05 + i * 0.05}s ease both` }}>
                <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "14px" }}>{stat.label}</div>
                <div style={{ fontSize: "32px", fontFamily: "'DM Serif Display', Georgia, serif", color: stat.valueColor || "#1A1814", lineHeight: "1", marginBottom: "5px" }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "#A09990" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* ── APPLICANT TABLE ── */}
          <div style={{ background: "#fff", border: "1px solid #EAE7E2", borderRadius: "10px", overflow: "hidden", animation: "fadeUp 0.3s 0.2s ease both" }}>

            {/* Toolbar */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0EDE8", background: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { val: "All", label: "All", count: APPLICANTS.length },
                  { val: "ready", label: "High Readiness", count: readyCount },
                  { val: "review", label: "Needs Review", count: reviewCount },
                  { val: "incomplete", label: "Incomplete", count: APPLICANTS.filter(a => a.status === "incomplete").length },
                ].map(f => (
                  <button key={f.val} className="filter-chip" onClick={() => setFilter(f.val)}
                    style={{ padding: "5px 12px", border: `1px solid ${filter === f.val ? "#1A1814" : "#DDD8D0"}`, borderRadius: "99px", background: filter === f.val ? "#1A1814" : "#fff", color: filter === f.val ? "#F7F6F3" : "#6E685F", fontSize: "11px", fontWeight: filter === f.val ? "500" : "400", transition: "all 0.15s" }}>
                    {f.label} <span style={{ opacity: 0.55, marginLeft: "3px" }}>{f.count}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="#C4BFB6" strokeWidth="1.2"/><path d="M8 8l2.5 2.5" stroke="#C4BFB6" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applicant…"
                    style={{ padding: "7px 12px 7px 28px", background: "#fff", border: "1px solid #DDD8D0", borderRadius: "6px", fontSize: "12px", color: "#1A1814", width: "180px" }} />
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ padding: "7px 10px", background: "#fff", border: "1px solid #DDD8D0", borderRadius: "6px", fontSize: "12px", color: "#4A4540" }}>
                  <option value="score">Sort: AI Score</option>
                  <option value="gaps">Sort: Gap Count</option>
                </select>
              </div>
            </div>

            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 70px 70px 70px 110px 130px", padding: "10px 20px", borderBottom: "1px solid #F0EDE8", gap: "8px" }}>
              {["Applicant", "Degree Program", "Exp.", "Docs", "Gaps", "AI Score", "Status"].map(h => (
                <span key={h} style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((a, i) => (
              <div key={a.id} className="applicant-row"
                onClick={() => navigate(`/assessor/audit/${a.id}`)}
                style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 70px 70px 70px 110px 130px", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #F5F3F0" : "none", transition: "all 0.15s", alignItems: "center", gap: "8px", animation: `slideIn 0.25s ${i * 0.04}s ease both` }}>

                {/* Applicant */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1A1814", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#F7F6F3" }}>
                      {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "#1A1814", marginBottom: "1px" }}>{a.name}</div>
                    <div style={{ fontSize: "10px", color: "#A09990" }}>{a.jobTitle}</div>
                  </div>
                </div>

                {/* Degree */}
                <div style={{ fontSize: "12px", color: "#4A4540" }}>{a.degree.replace("BS ", "")}</div>

                {/* Exp */}
                <div style={{ fontSize: "12px", fontWeight: "500", color: "#1A1814" }}>{a.yearsExp} yrs</div>

                {/* Docs */}
                <div>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: "#1A1814" }}>{a.docsSubmitted}</span>
                  <span style={{ fontSize: "10px", color: "#C4BFB6", marginLeft: "3px" }}>docs</span>
                </div>

                {/* Gaps */}
                <div>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: a.gapCount <= 2 ? "#2E7D32" : a.gapCount <= 4 ? "#B45309" : "#C62828" }}>{a.gapCount}</span>
                  <span style={{ fontSize: "10px", color: "#C4BFB6", marginLeft: "3px" }}>gaps</span>
                </div>

                {/* Score ring */}
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <ScoreRing score={a.aiScore} />
                  <span style={{ fontSize: "10px", color: "#C4BFB6" }}>/ 100</span>
                </div>

                {/* Status + arrow */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "10px", fontWeight: "500", color: a.flagColor.text, background: a.flagColor.bg, border: `1px solid ${a.flagColor.border}`, padding: "3px 8px", borderRadius: "99px", whiteSpace: "nowrap" }}>
                    {a.flag}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="#C4BFB6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: "56px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "#A09990" }}>No applicants match this filter.</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "14px", textAlign: "right" }}>
            <span style={{ fontSize: "11px", color: "#C4BFB6" }}>Click any row to open AI-Assisted Audit →</span>
          </div>

        </div>
      </main>
    </div>
  );
}