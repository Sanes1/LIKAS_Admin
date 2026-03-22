import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ── Mock applicant data (keyed by id) ──
const APPLICANTS = {
  a1: {
    id: "a1",
    name: "Juan dela Cruz",
    degree: "BS Information Technology",
    jobTitle: "Technical / Repair Technician",
    employerType: "Private Company",
    yearsExp: 6,
    aiScore: 94,
    submittedDate: "Feb 18, 2026",
    flag: "High Readiness",
    flagColor: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE" },
  },
};

// ── AI Mapping Evidence ──
const EVIDENCE_MAPPINGS = [
  {
    id: "e1",
    competency: "Systems Analysis & Design",
    subject: "BSIT Core Subject",
    units: 3,
    confidence: 97,
    status: "approved",
    evidenceType: "Certificate of Employment",
    evidenceFile: "COE_TechSupport_2019-2025.pdf",
    aiRationale:
      "Applicant's 6-year tenure as Technical Support Specialist includes documented systems troubleshooting, infrastructure review, and process documentation. Language in COE directly aligns with CHED descriptor for Systems Analysis & Design.",
    aiHighlights: [
      { text: "designed and implemented internal ticketing workflows", relevance: "high" },
      { text: "conducted root cause analysis for recurring system failures", relevance: "high" },
      { text: "produced weekly technical incident reports", relevance: "medium" },
    ],
    assessorNote: "",
    flagged: false,
  },
  {
    id: "e2",
    competency: "Computer Networks",
    subject: "BSIT Core Subject",
    units: 3,
    confidence: 94,
    status: "approved",
    evidenceType: "Certificate of Employment",
    evidenceFile: "COE_NetworkAdmin_2021-2024.pdf",
    aiRationale:
      "COE from Network Administrator role explicitly mentions LAN/WAN configuration, firewall management, and network performance monitoring. Strong match to CHED's Computer Networks competency descriptor.",
    aiHighlights: [
      { text: "configured and maintained LAN/WAN infrastructure for 3 office sites", relevance: "high" },
      { text: "managed firewall rules and VPN access for 120+ users", relevance: "high" },
      { text: "monitored network uptime and produced SLA reports", relevance: "medium" },
    ],
    assessorNote: "",
    flagged: false,
  },
  {
    id: "e3",
    competency: "IT Project Management",
    subject: "BSIT Elective",
    units: 3,
    confidence: 85,
    status: "pending",
    evidenceType: "Training Certificate",
    evidenceFile: "Cert_PMPBasics_2022.pdf",
    aiRationale:
      "Training certificate from PMP Basics course demonstrates foundational PM knowledge. However, no documentary evidence of actual project leadership was found. Confidence reduced due to lack of applied evidence.",
    aiHighlights: [
      { text: "completed 24-hour PMP Basics training program", relevance: "medium" },
      { text: "covered scope, schedule, and resource management principles", relevance: "medium" },
    ],
    assessorNote: "",
    flagged: true,
  },
  {
    id: "e4",
    competency: "Database Management",
    subject: "BSIT Core Subject",
    units: 3,
    confidence: 88,
    status: "approved",
    evidenceType: "Certificate of Employment",
    evidenceFile: "COE_TechSupport_2019-2025.pdf",
    aiRationale:
      "Work duties included daily data entry, report generation from SQL-based systems, and basic database maintenance. Evidence is consistent but lacks advanced query or schema design documentation.",
    aiHighlights: [
      { text: "managed data entry and reporting using company ERP system", relevance: "high" },
      { text: "generated weekly SQL reports for department heads", relevance: "high" },
      { text: "assisted in database cleanup and deduplication project", relevance: "medium" },
    ],
    assessorNote: "",
    flagged: false,
  },
  {
    id: "e5",
    competency: "Basic Programming Concepts",
    subject: "BSIT Core Subject",
    units: 3,
    confidence: 76,
    status: "pending",
    evidenceType: "Training Certificate",
    evidenceFile: "Cert_PythonBasics_2023.pdf",
    aiRationale:
      "Python Basics certificate shows awareness of programming concepts, but scope is introductory only. No professional application of programming was found in work documents. Supplementary evidence or exam recommended.",
    aiHighlights: [
      { text: "completed Python Basics online course (16 hours)", relevance: "medium" },
      { text: "covered variables, loops, functions, and file handling", relevance: "low" },
    ],
    assessorNote: "",
    flagged: true,
  },
  {
    id: "e6",
    competency: "Technical Documentation",
    subject: "BSIT Core Subject",
    units: 3,
    confidence: 91,
    status: "approved",
    evidenceType: "Work Portfolio",
    evidenceFile: "Portfolio_TechDocs_2020-2025.pdf",
    aiRationale:
      "Portfolio contains 12 sample technical documents including user manuals, incident reports, and network diagrams. Quality and volume of documentation strongly supports credit for Technical Documentation.",
    aiHighlights: [
      { text: "produced 12 technical documents including user manuals and network diagrams", relevance: "high" },
      { text: "wrote incident reports following ISO-aligned format", relevance: "high" },
      { text: "created onboarding guide used by 5 new technicians", relevance: "medium" },
    ],
    assessorNote: "",
    flagged: false,
  },
];

const GAP_SUBJECTS = [
  { label: "Ethics in IT & Society", units: 3, priority: "high" },
  { label: "Leadership & Management", units: 3, priority: "high" },
  { label: "Capstone Project I", units: 3, priority: "medium" },
  { label: "Capstone Project II", units: 3, priority: "medium" },
];

const CONFIDENCE_COLOR = (c) =>
  c >= 90 ? "#2E7D32" : c >= 80 ? "#1A1814" : "#B45309";

const STATUS_STYLES = {
  approved: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE", label: "Approved" },
  pending: { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8", label: "Pending Review" },
  rejected: { bg: "#FFF0F0", text: "#C62828", border: "#FECDCA", label: "Rejected" },
};

const PRIORITY_COLORS = {
  high: { bg: "#FFF0F0", text: "#C62828", border: "#FECDCA" },
  medium: { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8" },
};

export default function AIAssistedAudit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const applicant = APPLICANTS[id] || APPLICANTS["a1"];

  const [mappings, setMappings] = useState(EVIDENCE_MAPPINGS);
  const [expanded, setExpanded] = useState(null);
  const [notes, setNotes] = useState({});
  const [activeTab, setActiveTab] = useState("evidence");

  const updateStatus = (eid, status) => {
    setMappings(m => m.map(e => e.id === eid ? { ...e, status } : e));
  };

  const updateNote = (eid, val) => {
    setNotes(n => ({ ...n, [eid]: val }));
  };

  const approvedCount = mappings.filter(m => m.status === "approved").length;
  const pendingCount = mappings.filter(m => m.status === "pending").length;
  const flaggedCount = mappings.filter(m => m.flagged).length;
  const totalUnits = mappings.filter(m => m.status === "approved").reduce((s, m) => s + m.units, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, textarea { font-family: inherit; }
        textarea:focus { outline: none; }
        .btn-primary:hover { background: #2C2925 !important; }
        .nav-item:hover { background: rgba(247,246,243,0.07) !important; }
        .evidence-card:hover { border-color: #C4BFB6 !important; }
        .status-btn:hover { opacity: 0.8 !important; }
        .tab-btn:hover { color: #1A1814 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD8D0; border-radius: 99px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes expandDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: "256px", background: "#1A1814", padding: "36px 28px", display: "flex", flexDirection: "column", flexShrink: 0, position: "fixed", top: 0, left: 0, height: "100vh", overflowY: "auto", zIndex: 10 }}>
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

        <div style={{ padding: "14px 16px", background: "rgba(247,246,243,0.04)", border: "1px solid #252219", borderRadius: "8px", marginBottom: "28px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#2E2B27", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#F7F6F3" }}>MS</span>
          </div>
          <div style={{ fontSize: "12px", fontWeight: "500", color: "#F7F6F3", marginBottom: "2px" }}>Dr. Maria Santos</div>
          <div style={{ fontSize: "10px", color: "#6E685F", marginBottom: "2px" }}>ETEEAP Assessor</div>
          <div style={{ fontSize: "10px", color: "#3A3631" }}>PUP</div>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {[
            { label: "Dashboard", path: "/assessor", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg> },
            { label: "AI Audit", path: `/assessor/audit/${id}`, active: true, icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.3 4h4.2L9 7.5l1.5 4.5L7 9.5l-3.5 2.5L5 7.5 1.5 5h4.2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
            { label: "Project Verification", path: "/assessor/projects", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { label: "Interview Scripts", path: "/assessor/interview", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 2H4a1 1 0 00-1 1v7a1 1 0 001 1h1l2 2 2-2h3a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
            { label: "Accreditation", path: "/assessor/accreditation", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          ].map((item) => (
            <button key={item.label} className="nav-item" onClick={() => navigate(item.path)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "6px", background: item.active ? "rgba(247,246,243,0.09)" : "transparent", border: "none", transition: "background 0.15s", textAlign: "left", width: "100%", cursor: "pointer" }}>
              <span style={{ color: item.active ? "#F7F6F3" : "#3A3631", display: "flex", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: "12px", fontWeight: item.active ? "500" : "400", color: item.active ? "#F7F6F3" : "#3A3631" }}>{item.label}</span>
              {item.active && <div style={{ marginLeft: "auto", width: "4px", height: "4px", borderRadius: "50%", background: "#F7F6F3", flexShrink: 0 }} />}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid #252219", borderRadius: "6px", marginTop: "20px" }}>
          <div style={{ fontSize: "9px", color: "#2E2B27", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontWeight: "500" }}>Legal Basis</div>
          <div style={{ fontSize: "11px", color: "#4A4540", lineHeight: "1.5" }}>Republic Act 12124</div>
          <div style={{ fontSize: "10px", color: "#2E2B27" }}>ETEEAP Act · 2025</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 72px" , marginLeft: "256px" }}>
        <div style={{ maxWidth: "860px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => navigate("/assessor")}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#A09990", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Dashboard
              </button>
              <span style={{ color: "#DDD8D0", fontSize: "12px" }}>/</span>
              <span style={{ fontSize: "12px", color: "#4A4540", fontWeight: "500" }}>AI Audit · {applicant.name}</span>
            </div>
            <span style={{ fontSize: "11px", color: "#B0AAA0", letterSpacing: "0.05em" }}>Screen 2 of 5</span>
          </div>

          {/* Applicant header card */}
          <div style={{ background: "#1A1814", borderRadius: "10px", padding: "24px 28px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", animation: "fadeUp 0.3s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#2E2B27", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "16px", fontWeight: "600", color: "#F7F6F3" }}>
                  {applicant.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div>
                <div style={{ fontSize: "18px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#F7F6F3", marginBottom: "4px" }}>{applicant.name}</div>
                <div style={{ fontSize: "12px", color: "#6E685F" }}>{applicant.degree} · {applicant.jobTitle} · {applicant.yearsExp} yrs exp</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px", flexShrink: 0 }}>
              {[
                { label: "AI Score", value: `${applicant.aiScore}%` },
                { label: "Approved", value: approvedCount },
                { label: "Pending", value: pendingCount },
                { label: "Units Credited", value: totalUnits },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#F7F6F3", lineHeight: "1" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "#3A3631", marginTop: "3px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI flag banner */}
          {flaggedCount > 0 && (
            <div style={{ padding: "13px 16px", background: "#FFF8F0", border: "1px solid #FDE8C8", borderRadius: "6px", display: "flex", gap: "10px", marginBottom: "24px", animation: "fadeUp 0.3s 0.05s ease both" }}>
              <svg style={{ flexShrink: 0, marginTop: "1px" }} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#B45309" strokeWidth="1.2"/><path d="M7 4.5v3.5M7 9.5v.5" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <p style={{ fontSize: "12px", color: "#92400E", lineHeight: "1.7", margin: 0 }}>
                AI has flagged <strong style={{ fontWeight: "600" }}>{flaggedCount} competencies</strong> with low confidence or insufficient evidence. Review highlighted items before proceeding.
              </p>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #EAE7E2", marginBottom: "24px", animation: "fadeUp 0.3s 0.08s ease both" }}>
            {[
              { id: "evidence", label: `Evidence Mappings (${mappings.length})` },
              { id: "gaps", label: `Gap Subjects (${GAP_SUBJECTS.length})` },
            ].map(tab => (
              <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)}
                style={{ padding: "10px 20px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "#1A1814" : "transparent"}`, color: activeTab === tab.id ? "#1A1814" : "#A09990", fontSize: "13px", fontWeight: activeTab === tab.id ? "500" : "400", cursor: "pointer", transition: "all 0.18s", marginBottom: "-1px" }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── EVIDENCE TAB ── */}
          {activeTab === "evidence" && (
            <div style={{ animation: "slideIn 0.25s ease both" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
                {mappings.map((m, i) => {
                  const ss = STATUS_STYLES[m.status];
                  const isOpen = expanded === m.id;
                  const cc = CONFIDENCE_COLOR(m.confidence);

                  return (
                    <div key={m.id} className="evidence-card"
                      style={{ background: "#fff", border: `1px solid ${m.flagged && m.status === "pending" ? "#FDE8C8" : "#EAE7E2"}`, borderRadius: "8px", overflow: "hidden", transition: "border-color 0.2s", animation: `slideIn 0.25s ${i * 0.04}s ease both` }}>

                      {/* Row */}
                      <div style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px" }}
                        onClick={() => setExpanded(isOpen ? null : m.id)}>

                        {/* Confidence ring */}
                        <div style={{ position: "relative", width: "38px", height: "38px", flexShrink: 0 }}>
                          <svg width="38" height="38" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="19" cy="19" r="15" fill="none" stroke="#F0EDE8" strokeWidth="3.5" />
                            <circle cx="19" cy="19" r="15" fill="none" stroke={cc} strokeWidth="3.5"
                              strokeDasharray={`${(m.confidence / 100) * (2 * Math.PI * 15)} ${2 * Math.PI * 15}`}
                              strokeLinecap="round" />
                          </svg>
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: "9px", fontWeight: "600", color: cc }}>{m.confidence}</span>
                          </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "13px", fontWeight: "500", color: "#1A1814" }}>{m.competency}</span>
                            {m.flagged && (
                              <span style={{ fontSize: "9px", fontWeight: "500", color: "#B45309", background: "#FFF8F0", border: "1px solid #FDE8C8", padding: "1px 6px", borderRadius: "99px" }}>⚠ AI Flag</span>
                            )}
                          </div>
                          <div style={{ fontSize: "11px", color: "#A09990" }}>{m.evidenceType} · {m.evidenceFile}</div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                          <span style={{ fontSize: "11px", color: "#C4BFB6" }}>{m.units} units</span>
                          <span style={{ fontSize: "10px", fontWeight: "500", color: ss.text, background: ss.bg, border: `1px solid ${ss.border}`, padding: "3px 9px", borderRadius: "99px" }}>{ss.label}</span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#C4BFB6" }}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isOpen && (
                        <div style={{ borderTop: "1px solid #F0EDE8", animation: "expandDown 0.2s ease both" }}>

                          {/* AI Rationale */}
                          <div style={{ padding: "16px 18px", background: "#FAFAF8", borderBottom: "1px solid #F0EDE8" }}>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                              <svg style={{ flexShrink: 0, marginTop: "1px" }} width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.1 3.4H11L8.2 6.6l1.1 3.4-2.8-2-2.8 2 1.1-3.4L1 4.4h3.4z" stroke="#B45309" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                              <div>
                                <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "5px" }}>AI Rationale</div>
                                <p style={{ fontSize: "12px", color: "#4A4540", lineHeight: "1.75" }}>{m.aiRationale}</p>
                              </div>
                            </div>

                            {/* Highlighted evidence */}
                            <div style={{ marginLeft: "21px" }}>
                              <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "8px" }}>Evidence Highlights</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                {m.aiHighlights.map((h, hi) => (
                                  <div key={hi} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, marginTop: "5px", background: h.relevance === "high" ? "#2E7D32" : h.relevance === "medium" ? "#B45309" : "#C4BFB6" }} />
                                    <span style={{ fontSize: "12px", color: "#4A4540", lineHeight: "1.6", fontStyle: "italic" }}>"{h.text}"</span>
                                    <span style={{ fontSize: "10px", color: h.relevance === "high" ? "#2E7D32" : h.relevance === "medium" ? "#B45309" : "#C4BFB6", fontWeight: "500", flexShrink: 0, marginTop: "2px" }}>{h.relevance}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Assessor actions */}
                          <div style={{ padding: "14px 18px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: "220px" }}>
                              <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "6px" }}>Assessor Note</div>
                              <textarea
                                value={notes[m.id] || ""}
                                onChange={e => updateNote(m.id, e.target.value)}
                                placeholder="Add a note for this competency…"
                                rows={2}
                                style={{ width: "100%", padding: "9px 12px", background: "#fff", border: "1px solid #DDD8D0", borderRadius: "6px", fontSize: "12px", color: "#1A1814", resize: "none", lineHeight: "1.6" }}
                              />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                              <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "2px" }}>Decision</div>
                              <div style={{ display: "flex", gap: "6px" }}>
                                {["approved", "pending", "rejected"].map(s => {
                                  const sty = STATUS_STYLES[s];
                                  const isActive = m.status === s;
                                  return (
                                    <button key={s} className="status-btn" onClick={() => updateStatus(m.id, s)}
                                      style={{ padding: "7px 14px", border: `1px solid ${isActive ? sty.border : "#DDD8D0"}`, borderRadius: "6px", background: isActive ? sty.bg : "#fff", color: isActive ? sty.text : "#A09990", fontSize: "11px", fontWeight: isActive ? "500" : "400", cursor: "pointer", transition: "all 0.15s" }}>
                                      {sty.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── GAPS TAB ── */}
          {activeTab === "gaps" && (
            <div style={{ animation: "slideIn 0.25s ease both" }}>
              <div style={{ background: "#fff", border: "1px solid #EAE7E2", borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
                <div style={{ padding: "12px 18px", background: "#FAFAF8", borderBottom: "1px solid #F0EDE8" }}>
                  <span style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500" }}>Subjects with no matching evidence</span>
                </div>
                {GAP_SUBJECTS.map((g, i) => {
                  const pc = PRIORITY_COLORS[g.priority];
                  return (
                    <div key={g.label} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderBottom: i < GAP_SUBJECTS.length - 1 ? "1px solid #F5F3F0" : "none" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2.5v3M5 7v.5" stroke="#C62828" strokeWidth="1.4" strokeLinecap="round" /></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "500", color: "#1A1814", marginBottom: "2px" }}>{g.label}</div>
                        <div style={{ fontSize: "11px", color: "#A09990" }}>No evidence submitted · {g.units} units required</div>
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: "500", color: pc.text, background: pc.bg, border: `1px solid ${pc.border}`, padding: "3px 9px", borderRadius: "99px" }}>
                        {g.priority === "high" ? "High Priority" : "Medium"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "13px 16px", background: "#FFF8F0", border: "1px solid #FDE8C8", borderRadius: "6px", display: "flex", gap: "10px" }}>
                <svg style={{ flexShrink: 0, marginTop: "1px" }} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#B45309" strokeWidth="1.2"/><path d="M7 4.5v3.5M7 9.5v.5" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <p style={{ fontSize: "12px", color: "#92400E", lineHeight: "1.7", margin: 0 }}>
                  These subjects will require <strong style={{ fontWeight: "600" }}>interview-based assessment</strong>. An AI-generated interview script will be produced for each gap subject in the next step.
                </p>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "32px", borderTop: "1px solid #EAE7E2", marginTop: "8px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1A1814", marginBottom: "3px" }}>Next: Project Verification</div>
              <div style={{ fontSize: "12px", color: "#A09990" }}>Review completed barangay missions for this applicant.</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => navigate("/assessor")}
                style={{ padding: "11px 18px", background: "#fff", border: "1px solid #DDD8D0", color: "#6E685F", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                Back to Dashboard
              </button>
              <button className="btn-primary" onClick={() => navigate("/assessor/projects")}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 22px", background: "#1A1814", color: "#F7F6F3", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s", cursor: "pointer" }}>
                Go to Project Verification
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}