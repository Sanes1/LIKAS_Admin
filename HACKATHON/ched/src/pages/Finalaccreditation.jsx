import { useState } from "react";
import { useNavigate } from "react-router-dom";

const APPLICANT = {
  id: "a1",
  name: "Juan dela Cruz",
  degree: "BS Information Technology",
  jobTitle: "Technical / Repair Technician",
  yearsExp: 6,
  submittedDate: "Feb 18, 2026",
  aiScore: 94,
};

const REVIEW_SUMMARY = {
  evidenceMappings: { total: 6, approved: 5, pending: 1, rejected: 0 },
  unitsFromEvidence: 15,
  projectsVerified: 2,
  unitsFromMissions: 9,
  totalUnitsCredited: 24,
  totalUnitsRequired: 132,
  gapSubjectsResolved: 4,
  gapSubjectsRemaining: 0,
  interviewCompleted: true,
  questionsAsked: 7,
};

const CHECKLIST = [
  { id: "c1", label: "Eligibility confirmed (Age ≥ 23, Experience ≥ 5 years)", done: true },
  { id: "c2", label: "Work evidence uploaded and AI-mapped", done: true },
  { id: "c3", label: "AI-assisted audit reviewed by assessor", done: true },
  { id: "c4", label: "Barangay missions verified with endorsement letters", done: true },
  { id: "c5", label: "Interview script generated and used", done: true },
  { id: "c6", label: "Panel interview conducted", done: true },
  { id: "c7", label: "All gap subjects addressed or deferred with justification", done: true },
];

const CREDIT_BREAKDOWN = [
  { source: "Systems Analysis & Design", type: "Work Evidence", units: 3, status: "approved" },
  { source: "Computer Networks", type: "Work Evidence", units: 3, status: "approved" },
  { source: "Technical Documentation", type: "Work Portfolio", units: 3, status: "approved" },
  { source: "Database Management", type: "Work Evidence", units: 3, status: "approved" },
  { source: "Customer Support Systems", type: "Work Evidence", units: 3, status: "approved" },
  { source: "Ethics in IT & Society", type: "Barangay Mission", units: 3, status: "approved" },
  { source: "Leadership & Management", type: "Barangay Mission", units: 3, status: "approved" },
  { source: "Capstone Project I", type: "Barangay Mission", units: 3, status: "approved" },
  { source: "Basic Programming Concepts", type: "Work Evidence", units: 3, status: "conditional" },
];

function AssessorSidebar({ navigate }) {
  return (
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

      {/* Journey progress — all steps done */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0" }}>
        {[
          { label: "Dashboard", path: "/assessor", done: true },
          { label: "AI Audit", path: "/assessor/audit/a1", done: true },
          { label: "Project Verification", path: "/assessor/projects", done: true },
          { label: "Interview Scripts", path: "/assessor/interview", done: true },
          { label: "Accreditation", path: "/assessor/accreditation", active: true },
        ].map((item, i, arr) => (
          <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "8px 12px", borderRadius: "6px", background: item.active ? "rgba(247,246,243,0.09)" : "transparent" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `1.5px solid ${item.done || item.active ? "#F7F6F3" : "#2E2B27"}`, background: item.done ? "#F7F6F3" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>
                {item.done
                  ? <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M2 4.5l1.5 1.5 3.5-3.5" stroke="#1A1814" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#F7F6F3" }} />
                }
              </div>
              {i < arr.length - 1 && <div style={{ width: "1px", height: "22px", marginTop: "4px", background: item.done ? "#3A3631" : "#1E1C19" }} />}
            </div>
            <button onClick={() => navigate(item.path)}
              style={{ background: "none", border: "none", padding: "1px 0", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: "12px", fontWeight: item.active ? "500" : "400", color: item.active ? "#F7F6F3" : item.done ? "#6E685F" : "#2E2B27" }}>{item.label}</span>
            </button>
          </div>
        ))}
      </nav>

      <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid #252219", borderRadius: "6px", marginTop: "20px" }}>
        <div style={{ fontSize: "9px", color: "#2E2B27", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontWeight: "500" }}>Legal Basis</div>
        <div style={{ fontSize: "11px", color: "#4A4540", lineHeight: "1.5" }}>Republic Act 12124</div>
        <div style={{ fontSize: "10px", color: "#2E2B27" }}>ETEEAP Act · 2025</div>
      </div>
    </aside>
  );
}

export default function FinalAccreditation() {
  const navigate = useNavigate();
  const [decision, setDecision] = useState(null); // "accredited" | "conditional" | "deferred"
  const [remarks, setRemarks] = useState("");
  const [conditions, setConditions] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [checklistExpanded, setChecklistExpanded] = useState(true);
  const [creditsExpanded, setCreditsExpanded] = useState(true);

  const creditPct = Math.round((REVIEW_SUMMARY.totalUnitsCredited / REVIEW_SUMMARY.totalUnitsRequired) * 100);

  const handleConfirm = () => {
    if (!decision || !remarks.trim()) return;
    setConfirmed(true);
  };

  const DECISION_OPTIONS = [
    {
      id: "accredited",
      label: "Accredit",
      sub: "Applicant meets all requirements",
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#2E7D32" strokeWidth="1.4"/><path d="M5.5 9l2.5 2.5L12.5 7" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      activeStyle: { bg: "#EEFAF0", border: "#C6E8CE", text: "#2E7D32" },
    },
    {
      id: "conditional",
      label: "Conditional Accreditation",
      sub: "Pending one or more requirements",
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#B45309" strokeWidth="1.4"/><path d="M9 6v4M9 12v.5" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round"/></svg>,
      activeStyle: { bg: "#FFF8F0", border: "#FDE8C8", text: "#B45309" },
    },
    {
      id: "deferred",
      label: "Defer",
      sub: "Return for additional evidence",
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#C62828" strokeWidth="1.4"/><path d="M6 9h6M9 6l3 3-3 3" stroke="#C62828" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      activeStyle: { bg: "#FFF0F0", border: "#FECDCA", text: "#C62828" },
    },
  ];

  if (confirmed) {
    const ds = DECISION_OPTIONS.find(d => d.id === decision);
    return (
      <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        <AssessorSidebar navigate={navigate} />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" , marginLeft: "256px" }}>
          <div style={{ maxWidth: "520px", width: "100%", textAlign: "center", animation: "scaleIn 0.4s cubic-bezier(0.4,0,0.2,1) both" }}>
            {/* Decision icon */}
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: ds.activeStyle.bg, border: `2px solid ${ds.activeStyle.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              {ds.icon}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: ds.activeStyle.bg, border: `1px solid ${ds.activeStyle.border}`, borderRadius: "99px", marginBottom: "18px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ds.activeStyle.text }} />
              <span style={{ fontSize: "11px", fontWeight: "500", color: ds.activeStyle.text }}>{ds.label}</span>
            </div>
            <h1 style={{ fontSize: "30px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1814", letterSpacing: "-0.5px", marginBottom: "10px", lineHeight: "1.2" }}>
              {decision === "accredited" ? `${APPLICANT.name} is accredited.` : decision === "conditional" ? "Conditional accreditation issued." : "Application deferred."}
            </h1>
            <p style={{ fontSize: "14px", color: "#6E685F", lineHeight: "1.75", marginBottom: "32px" }}>
              {decision === "accredited"
                ? `${REVIEW_SUMMARY.totalUnitsCredited} units have been officially credited toward ${APPLICANT.degree}. The applicant will be notified and enrolled in the remaining subjects.`
                : decision === "conditional"
                ? "Accreditation is subject to completion of stated conditions. The applicant has been notified of requirements."
                : "The applicant has been notified to submit additional evidence before re-applying for assessment."}
            </p>

            {/* Summary card */}
            <div style={{ background: "#fff", border: "1px solid #EAE7E2", borderRadius: "10px", overflow: "hidden", marginBottom: "28px", textAlign: "left", animation: "fadeUp 0.4s 0.1s ease both" }}>
              <div style={{ padding: "12px 18px", background: "#FAFAF8", borderBottom: "1px solid #F0EDE8" }}>
                <span style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500" }}>Accreditation Summary</span>
              </div>
              {[
                { label: "Applicant", value: APPLICANT.name },
                { label: "Program", value: APPLICANT.degree },
                { label: "Units Credited", value: `${REVIEW_SUMMARY.totalUnitsCredited} of ${REVIEW_SUMMARY.totalUnitsRequired}` },
                { label: "Decision", value: ds.label },
                { label: "Assessed by", value: "Dr. Maria Santos · PUP" },
                { label: "Date", value: new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 18px", borderBottom: i < arr.length - 1 ? "1px solid #F5F3F0" : "none" }}>
                  <span style={{ fontSize: "12px", color: "#A09990" }}>{row.label}</span>
                  <span style={{ fontSize: "12px", color: "#1A1814", fontWeight: "500" }}>{row.value}</span>
                </div>
              ))}
              {remarks && (
                <div style={{ padding: "12px 18px", background: "#FAFAF8", borderTop: "1px solid #F0EDE8" }}>
                  <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "4px" }}>Assessor Remarks</div>
                  <p style={{ fontSize: "12px", color: "#4A4540", lineHeight: "1.6" }}>{remarks}</p>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => navigate("/assessor")}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "11px 20px", background: "#fff", border: "1px solid #DDD8D0", color: "#6E685F", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                Back to Dashboard
              </button>
              <button
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "11px 20px", background: "#1A1814", color: "#F7F6F3", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8V9.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V8M6 1v6M3.5 4.5L6 7l2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Download Certificate
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, textarea { font-family: inherit; cursor: pointer; }
        textarea:focus { outline: none; }
        .btn-primary:hover { background: #2C2925 !important; }
        .btn-ghost:hover { color: #1A1814 !important; }
        .decision-card:hover { border-color: #C4BFB6 !important; box-shadow: 0 2px 12px rgba(26,24,20,0.06) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD8D0; border-radius: 99px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <AssessorSidebar navigate={navigate} />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 72px" , marginLeft: "256px" }}>
        <div style={{ maxWidth: "820px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => navigate("/assessor")}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#A09990", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Dashboard
              </button>
              <span style={{ color: "#DDD8D0", fontSize: "12px" }}>/</span>
              <span style={{ fontSize: "12px", color: "#4A4540", fontWeight: "500" }}>Final Accreditation · {APPLICANT.name}</span>
            </div>
            <span style={{ fontSize: "11px", color: "#B0AAA0", letterSpacing: "0.05em" }}>Screen 5 of 5</span>
          </div>

          {/* Page heading */}
          <div style={{ marginBottom: "28px", animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: "11px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Final Accreditation</p>
            <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#1A1814", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "8px" }}>
              Ready to make a decision.
            </h1>
            <p style={{ fontSize: "13px", color: "#6E685F", lineHeight: "1.75", maxWidth: "520px" }}>
              Review the complete assessment summary for {APPLICANT.name}, then issue your official accreditation decision under RA 12124.
            </p>
          </div>

          {/* ── APPLICANT HEADER ── */}
          <div style={{ background: "#1A1814", borderRadius: "10px", padding: "22px 28px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", animation: "fadeUp 0.3s 0.05s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#2E2B27", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#F7F6F3" }}>JD</span>
              </div>
              <div>
                <div style={{ fontSize: "16px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#F7F6F3", marginBottom: "3px" }}>{APPLICANT.name}</div>
                <div style={{ fontSize: "11px", color: "#6E685F" }}>{APPLICANT.degree} · {APPLICANT.jobTitle} · {APPLICANT.yearsExp} yrs</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              {[
                { label: "AI Score", value: `${APPLICANT.aiScore}%` },
                { label: "Units Credited", value: REVIEW_SUMMARY.totalUnitsCredited },
                { label: "Coverage", value: `${creditPct}%` },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#F7F6F3", lineHeight: "1" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "#3A3631", marginTop: "3px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ASSESSMENT SUMMARY GRID ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "20px", animation: "fadeUp 0.3s 0.08s ease both" }}>
            {[
              { label: "Evidence Approved", value: `${REVIEW_SUMMARY.evidenceMappings.approved}/${REVIEW_SUMMARY.evidenceMappings.total}`, sub: "competencies" },
              { label: "Missions Verified", value: REVIEW_SUMMARY.projectsVerified, sub: "community projects", cardBg: "#EEFAF0", cardBorder: "#C6E8CE", valueColor: "#2E7D32" },
              { label: "Gaps Resolved", value: `${REVIEW_SUMMARY.gapSubjectsResolved}/${REVIEW_SUMMARY.gapSubjectsResolved + REVIEW_SUMMARY.gapSubjectsRemaining}`, sub: "via interview & missions" },
              { label: "Interview", value: REVIEW_SUMMARY.interviewCompleted ? "Done" : "Pending", sub: `${REVIEW_SUMMARY.questionsAsked} questions asked`, cardBg: REVIEW_SUMMARY.interviewCompleted ? "#EEFAF0" : "#FFF0F0", cardBorder: REVIEW_SUMMARY.interviewCompleted ? "#C6E8CE" : "#FECDCA", valueColor: REVIEW_SUMMARY.interviewCompleted ? "#2E7D32" : "#C62828" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.cardBg || "#fff", border: `1px solid ${s.cardBorder || "#EAE7E2"}`, borderRadius: "8px", padding: "16px 18px" }}>
                <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "8px" }}>{s.label}</div>
                <div style={{ fontSize: "24px", fontFamily: "'DM Serif Display', Georgia, serif", color: s.valueColor || "#1A1814", lineHeight: "1", marginBottom: "3px" }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "#A09990" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── CHECKLIST ── */}
          <div style={{ background: "#fff", border: "1px solid #EAE7E2", borderRadius: "8px", overflow: "hidden", marginBottom: "14px", animation: "fadeUp 0.3s 0.1s ease both" }}>
            <div style={{ padding: "12px 18px", background: "#FAFAF8", borderBottom: checklistExpanded ? "1px solid #F0EDE8" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              onClick={() => setChecklistExpanded(e => !e)}>
              <span style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500" }}>
                CHED Compliance Checklist · {CHECKLIST.filter(c => c.done).length}/{CHECKLIST.length} complete
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: checklistExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#C4BFB6" }}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            {checklistExpanded && CHECKLIST.map((item, i) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 18px", borderBottom: i < CHECKLIST.length - 1 ? "1px solid #F5F3F0" : "none" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: item.done ? "#EEFAF0" : "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.done
                    ? <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 3.5-3.5" stroke="#2E7D32" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 2l4 4M6 2L2 6" stroke="#C62828" strokeWidth="1.2" strokeLinecap="round" /></svg>
                  }
                </div>
                <span style={{ fontSize: "12px", color: item.done ? "#4A4540" : "#C62828" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* ── CREDIT BREAKDOWN ── */}
          <div style={{ background: "#fff", border: "1px solid #EAE7E2", borderRadius: "8px", overflow: "hidden", marginBottom: "24px", animation: "fadeUp 0.3s 0.12s ease both" }}>
            <div style={{ padding: "12px 18px", background: "#FAFAF8", borderBottom: creditsExpanded ? "1px solid #F0EDE8" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              onClick={() => setCreditsExpanded(e => !e)}>
              <span style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500" }}>
                Credit Breakdown · {REVIEW_SUMMARY.totalUnitsCredited} units total
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: creditsExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#C4BFB6" }}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            {creditsExpanded && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 80px 100px", padding: "8px 18px", borderBottom: "1px solid #F0EDE8", gap: "8px" }}>
                  {["Subject", "Source", "Units", "Status"].map(h => (
                    <span key={h} style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: "500" }}>{h}</span>
                  ))}
                </div>
                {CREDIT_BREAKDOWN.map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 80px 100px", padding: "11px 18px", borderBottom: i < CREDIT_BREAKDOWN.length - 1 ? "1px solid #F5F3F0" : "none", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#1A1814", fontWeight: "500" }}>{row.source}</span>
                    <span style={{ fontSize: "11px", color: "#6E685F" }}>{row.type}</span>
                    <span style={{ fontSize: "12px", color: "#1A1814", fontWeight: "500" }}>{row.units} units</span>
                    <span style={{ fontSize: "10px", fontWeight: "500", color: row.status === "approved" ? "#2E7D32" : "#B45309", background: row.status === "approved" ? "#EEFAF0" : "#FFF8F0", border: `1px solid ${row.status === "approved" ? "#C6E8CE" : "#FDE8C8"}`, padding: "2px 8px", borderRadius: "99px" }}>
                      {row.status === "approved" ? "Approved" : "Conditional"}
                    </span>
                  </div>
                ))}
                {/* Total row */}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", background: "#FAFAF8", borderTop: "1px solid #F0EDE8" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1A1814" }}>Total Units Credited</span>
                  <span style={{ fontSize: "14px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1814" }}>{REVIEW_SUMMARY.totalUnitsCredited} / {REVIEW_SUMMARY.totalUnitsRequired}</span>
                </div>
              </>
            )}
          </div>

          {/* ── DECISION ── */}
          <div style={{ marginBottom: "20px", animation: "fadeUp 0.3s 0.14s ease both" }}>
            <div style={{ fontSize: "11px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "12px" }}>Accreditation Decision</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {DECISION_OPTIONS.map(opt => {
                const isActive = decision === opt.id;
                return (
                  <button key={opt.id} className="decision-card" onClick={() => setDecision(isActive ? null : opt.id)}
                    style={{ padding: "18px", background: isActive ? opt.activeStyle.bg : "#fff", border: `1.5px solid ${isActive ? opt.activeStyle.border : "#EAE7E2"}`, borderRadius: "8px", textAlign: "left", transition: "all 0.18s", boxShadow: isActive ? `0 0 0 3px ${opt.activeStyle.border}` : "none" }}>
                    <div style={{ marginBottom: "10px" }}>{opt.icon}</div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: isActive ? opt.activeStyle.text : "#1A1814", marginBottom: "3px" }}>{opt.label}</div>
                    <div style={{ fontSize: "11px", color: isActive ? opt.activeStyle.text : "#A09990", opacity: isActive ? 0.8 : 1 }}>{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional fields */}
          {decision === "conditional" && (
            <div style={{ marginBottom: "16px", animation: "fadeUp 0.2s ease both" }}>
              <label style={{ display: "block", fontSize: "11px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "8px" }}>
                Conditions Required
              </label>
              <textarea value={conditions} onChange={e => setConditions(e.target.value)} rows={3}
                placeholder="Specify what the applicant must complete before full accreditation is granted…"
                style={{ width: "100%", padding: "11px 14px", background: "#fff", border: "1px solid #FDE8C8", borderRadius: "6px", fontSize: "13px", color: "#1A1814", resize: "none", lineHeight: "1.6" }} />
            </div>
          )}

          {decision === "deferred" && (
            <div style={{ marginBottom: "16px", animation: "fadeUp 0.2s ease both" }}>
              <label style={{ display: "block", fontSize: "11px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "8px" }}>
                Reason for Deferral
              </label>
              <textarea value={conditions} onChange={e => setConditions(e.target.value)} rows={3}
                placeholder="Explain what evidence or requirements are missing before the applicant can reapply…"
                style={{ width: "100%", padding: "11px 14px", background: "#fff", border: "1px solid #FECDCA", borderRadius: "6px", fontSize: "13px", color: "#1A1814", resize: "none", lineHeight: "1.6" }} />
            </div>
          )}

          {/* Assessor remarks */}
          {decision && (
            <div style={{ marginBottom: "28px", animation: "fadeUp 0.2s ease both" }}>
              <label style={{ display: "block", fontSize: "11px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "8px" }}>
                Official Assessor Remarks <span style={{ color: "#C62828" }}>*</span>
              </label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={4}
                placeholder="Provide your official written remarks for this accreditation decision. This will be included in the applicant's ETEEAP record…"
                style={{ width: "100%", padding: "11px 14px", background: "#fff", border: `1px solid ${remarks ? "#DDD8D0" : "#EAE7E2"}`, borderRadius: "6px", fontSize: "13px", color: "#1A1814", resize: "none", lineHeight: "1.6" }} />
              {!remarks && <p style={{ fontSize: "11px", color: "#C4BFB6", marginTop: "5px" }}>Required before confirming decision.</p>}
            </div>
          )}

          {/* Confirm button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "28px", borderTop: "1px solid #EAE7E2" }}>
            <button onClick={() => navigate("/assessor/interview")}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#A09990", fontSize: "13px", cursor: "pointer", padding: 0, fontWeight: "500" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3.5 6 7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back to Interview Script
            </button>
            <button className="btn-primary"
              onClick={handleConfirm}
              disabled={!decision || !remarks.trim()}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: decision && remarks.trim() ? "#1A1814" : "#EAE7E2", color: decision && remarks.trim() ? "#F7F6F3" : "#A09990", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s", cursor: decision && remarks.trim() ? "pointer" : "not-allowed" }}>
              Confirm Accreditation Decision
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}