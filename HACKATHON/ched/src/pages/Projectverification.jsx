import { useState } from "react";
import { useNavigate } from "react-router-dom";

const APPLICANT = {
  name: "Juan dela Cruz",
  degree: "BS Information Technology",
  jobTitle: "Technical / Repair Technician",
};

const PROJECTS = [
  {
    id: "p1",
    title: "Barangay Tech Literacy Program",
    barangay: "Brgy. San Roque, Marikina City",
    category: "Education & Ethics",
    duration: "4 weeks",
    completedDate: "Jan 28, 2026",
    coversSubjects: ["Ethics in IT & Society", "Leadership & Management"],
    units: 6,
    status: "submitted",
    outputs: [
      { label: "Session Curriculum (4 modules)", file: "TechLiteracy_Curriculum_v2.pdf", submitted: true },
      { label: "Attendance Sheets (4 sessions)", file: "Attendance_AllSessions.pdf", submitted: true },
      { label: "Post-Session Evaluation Forms", file: "Evaluations_Jan2026.pdf", submitted: true },
      { label: "Written Ethics Reflection", file: "EthicsReflection_JuanDC.pdf", submitted: true },
      { label: "Photo Documentation", file: "Photos_Workshop.zip", submitted: true },
    ],
    barangayContact: "Kagawad Rosa Dela Vega",
    barangayEndorsement: true,
    aiSummary:
      "Applicant successfully designed and facilitated a 4-session digital literacy program for 24 barangay residents. Documentation is complete and well-organized. The ethics reflection demonstrates genuine engagement with issues of technology access and equity. Barangay endorsement letter is present and signed.",
    aiScore: 92,
    assessorDecision: null,
    assessorNote: "",
  },
  {
    id: "p2",
    title: "Livelihood Data Survey & Report",
    barangay: "Brgy. Bagong Silang, Caloocan City",
    category: "Research & Analysis",
    duration: "3 weeks",
    completedDate: "Feb 10, 2026",
    coversSubjects: ["Quantitative Methods"],
    units: 3,
    status: "submitted",
    outputs: [
      { label: "Survey Instrument (15+ indicators)", file: "SurveyForm_Livelihood.pdf", submitted: true },
      { label: "Encoded Dataset (50 households)", file: "Dataset_LivelihoodSurvey.xlsx", submitted: true },
      { label: "Statistical Summary Report", file: "Report_LivelihoodAnalysis.pdf", submitted: true },
      { label: "Barangay Assembly Presentation Deck", file: "Presentation_Assembly.pptx", submitted: false },
    ],
    barangayContact: "Secretary Rodel Manalo",
    barangayEndorsement: true,
    aiSummary:
      "Survey instrument is well-structured with 18 quantitative indicators. Dataset covers 52 households with clean encoding. Statistical report includes frequency distributions, cross-tabulations, and a bar chart summary. Presentation deck was not submitted — assessor should follow up. Barangay endorsement is present.",
    aiScore: 78,
    assessorDecision: null,
    assessorNote: "",
  },
];

const DECISION_STYLES = {
  verified: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE", label: "Verified" },
  conditional: { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8", label: "Conditional Pass" },
  rejected: { bg: "#FFF0F0", text: "#C62828", border: "#FECDCA", label: "Rejected" },
};

function AssessorSidebar({ navigate, activeNav }) {
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

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {[
          { label: "Dashboard", path: "/assessor", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg> },
          { label: "AI Audit", path: "/assessor/audit/a1", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.3 4h4.2L9 7.5l1.5 4.5L7 9.5l-3.5 2.5L5 7.5 1.5 5h4.2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
          { label: "Project Verification", path: "/assessor/projects", active: activeNav === "projects", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { label: "Interview Scripts", path: "/assessor/interview", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 2H4a1 1 0 00-1 1v7a1 1 0 001 1h1l2 2 2-2h3a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
          { label: "Accreditation", path: "/assessor/accreditation", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
        ].map((item) => (
          <button key={item.label} onClick={() => navigate(item.path)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "6px", background: item.active ? "rgba(247,246,243,0.09)" : "transparent", border: "none", transition: "background 0.15s", textAlign: "left", width: "100%", cursor: "pointer" }}
            onMouseEnter={e => !item.active && (e.currentTarget.style.background = "rgba(247,246,243,0.07)")}
            onMouseLeave={e => !item.active && (e.currentTarget.style.background = "transparent")}>
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
  );
}

export default function ProjectVerification() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(PROJECTS);
  const [expanded, setExpanded] = useState("p1");
  const [notes, setNotes] = useState({});

  const setDecision = (pid, decision) => {
    setProjects(ps => ps.map(p => p.id === pid ? { ...p, assessorDecision: decision } : p));
  };

  const setNote = (pid, val) => setNotes(n => ({ ...n, [pid]: val }));

  const verifiedCount = projects.filter(p => p.assessorDecision === "verified").length;
  const pendingCount = projects.filter(p => !p.assessorDecision).length;
  const totalUnitsVerified = projects
    .filter(p => p.assessorDecision === "verified" || p.assessorDecision === "conditional")
    .reduce((s, p) => s + p.units, 0);

  const allDecided = projects.every(p => p.assessorDecision !== null);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, textarea { font-family: inherit; cursor: pointer; }
        textarea:focus { outline: none; }
        .btn-primary:hover { background: #2C2925 !important; }
        .btn-ghost:hover { color: #1A1814 !important; }
        .project-card:hover { border-color: #C4BFB6 !important; }
        .decision-btn:hover { opacity: 0.82 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD8D0; border-radius: 99px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes expandDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <AssessorSidebar navigate={navigate} activeNav="projects" />

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
              <span style={{ fontSize: "12px", color: "#4A4540", fontWeight: "500" }}>Project Verification · {APPLICANT.name}</span>
            </div>
            <span style={{ fontSize: "11px", color: "#B0AAA0", letterSpacing: "0.05em" }}>Screen 3 of 5</span>
          </div>

          {/* Page heading */}
          <div style={{ marginBottom: "28px", animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: "11px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Project Verification</p>
            <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#1A1814", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "8px" }}>
              Review community project outputs.
            </h1>
            <p style={{ fontSize: "13px", color: "#6E685F", lineHeight: "1.75", maxWidth: "520px" }}>
              {APPLICANT.name} completed {PROJECTS.length} Barangay Missions. Verify each project's submitted outputs and barangay endorsement before proceeding to the interview.
            </p>
          </div>

          {/* Summary strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px", animation: "fadeUp 0.3s 0.05s ease both" }}>
            {[
              { label: "Projects Submitted", value: projects.length, sub: "by applicant" },
              { label: "Verified", value: verifiedCount, sub: "decisions made", cardBg: verifiedCount > 0 ? "#EEFAF0" : "#fff", cardBorder: verifiedCount > 0 ? "#C6E8CE" : "#EAE7E2", valueColor: verifiedCount > 0 ? "#2E7D32" : "#1A1814" },
              { label: "Units Cleared", value: totalUnitsVerified, sub: "from missions", cardBg: totalUnitsVerified > 0 ? "#F0EDE8" : "#fff" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.cardBg || "#fff", border: `1px solid ${s.cardBorder || "#EAE7E2"}`, borderRadius: "10px", padding: "18px 20px" }}>
                <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "10px" }}>{s.label}</div>
                <div style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", color: s.valueColor || "#1A1814", lineHeight: "1", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#A09990" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Project cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
            {projects.map((proj, i) => {
              const isOpen = expanded === proj.id;
              const dec = proj.assessorDecision;
              const decStyle = dec ? DECISION_STYLES[dec] : null;
              const missingOutputs = proj.outputs.filter(o => !o.submitted).length;

              return (
                <div key={proj.id} className="project-card"
                  style={{ background: "#fff", border: `1px solid ${dec === "verified" ? "#C6E8CE" : dec === "rejected" ? "#FECDCA" : "#EAE7E2"}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.2s", animation: `slideIn 0.25s ${i * 0.06}s ease both` }}>

                  {/* Card header row */}
                  <div style={{ padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "14px" }}
                    onClick={() => setExpanded(isOpen ? null : proj.id)}>

                    {/* Score badge */}
                    <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: proj.aiScore >= 85 ? "#EEFAF0" : "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, flexDirection: "column" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: proj.aiScore >= 85 ? "#2E7D32" : "#B45309", lineHeight: "1" }}>{proj.aiScore}</span>
                      <span style={{ fontSize: "8px", color: proj.aiScore >= 85 ? "#2E7D32" : "#B45309", opacity: 0.7 }}>AI</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#1A1814" }}>{proj.title}</span>
                        {missingOutputs > 0 && (
                          <span style={{ fontSize: "9px", fontWeight: "500", color: "#B45309", background: "#FFF8F0", border: "1px solid #FDE8C8", padding: "2px 7px", borderRadius: "99px" }}>
                            ⚠ {missingOutputs} missing output{missingOutputs > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="4.5" r="2" stroke="#A09990" strokeWidth="1.1"/><path d="M5.5 10S2 7 2 4.5a3.5 3.5 0 017 0C9 7 5.5 10 5.5 10z" stroke="#A09990" strokeWidth="1.1"/></svg>
                        <span style={{ fontSize: "11px", color: "#A09990" }}>{proj.barangay}</span>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {proj.coversSubjects.map(s => (
                          <span key={s} style={{ fontSize: "10px", color: "#6E685F", background: "#F0EDE8", border: "1px solid #E0DCD5", padding: "2px 8px", borderRadius: "99px" }}>{s}</span>
                        ))}
                        <span style={{ fontSize: "10px", color: "#A09990", background: "#F5F3F0", padding: "2px 8px", borderRadius: "99px" }}>✓ Completed {proj.completedDate}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                      {decStyle ? (
                        <span style={{ fontSize: "10px", fontWeight: "500", color: decStyle.text, background: decStyle.bg, border: `1px solid ${decStyle.border}`, padding: "3px 9px", borderRadius: "99px" }}>{decStyle.label}</span>
                      ) : (
                        <span style={{ fontSize: "10px", color: "#A09990", background: "#F5F3F0", padding: "3px 9px", borderRadius: "99px" }}>Awaiting Review</span>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ fontSize: "11px", color: "#C4BFB6" }}>{proj.units} units</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#C4BFB6" }}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded section */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #F0EDE8", animation: "expandDown 0.2s ease both" }}>

                      {/* AI Summary */}
                      <div style={{ padding: "16px 20px", background: "#FAFAF8", borderBottom: "1px solid #F0EDE8" }}>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                          <svg style={{ flexShrink: 0, marginTop: "2px" }} width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.1 3.4H11L8.2 6.6l1.1 3.4-2.8-2-2.8 2 1.1-3.4L1 4.4h3.4z" stroke="#B45309" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "5px" }}>AI Review Summary</div>
                            <p style={{ fontSize: "12px", color: "#4A4540", lineHeight: "1.75" }}>{proj.aiSummary}</p>
                          </div>
                        </div>

                        {/* Outputs checklist */}
                        <div style={{ marginLeft: "21px" }}>
                          <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "8px" }}>Required Outputs</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {proj.outputs.map((o, oi) => (
                              <div key={oi} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: o.submitted ? "#EEFAF0" : "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  {o.submitted
                                    ? <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l1.5 1.5 3.5-3" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 2l4 4M6 2L2 6" stroke="#C62828" strokeWidth="1.2" strokeLinecap="round"/></svg>
                                  }
                                </div>
                                <span style={{ fontSize: "12px", color: o.submitted ? "#4A4540" : "#C62828", flex: 1 }}>{o.label}</span>
                                <span style={{ fontSize: "10px", color: "#C4BFB6" }}>{o.file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Barangay endorsement */}
                      <div style={{ padding: "12px 20px", background: proj.barangayEndorsement ? "#EEFAF0" : "#FFF0F0", borderBottom: "1px solid #F0EDE8", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: proj.barangayEndorsement ? "#C6E8CE" : "#FECDCA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {proj.barangayEndorsement
                            ? <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="#2E7D32" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M2.5 2.5l4 4M6.5 2.5l-4 4" stroke="#C62828" strokeWidth="1.3" strokeLinecap="round"/></svg>
                          }
                        </div>
                        <span style={{ fontSize: "12px", color: proj.barangayEndorsement ? "#2E7D32" : "#C62828", fontWeight: "500" }}>
                          {proj.barangayEndorsement ? "Barangay Endorsement Letter Present" : "Barangay Endorsement Missing"}
                        </span>
                        <span style={{ fontSize: "11px", color: "#A09990", marginLeft: "4px" }}>· Contact: {proj.barangayContact}</span>
                      </div>

                      {/* Assessor decision area */}
                      <div style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "220px" }}>
                          <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "6px" }}>Assessor Note</div>
                          <textarea
                            value={notes[proj.id] || ""}
                            onChange={e => setNote(proj.id, e.target.value)}
                            placeholder="Add verification notes or follow-up requirements…"
                            rows={2}
                            style={{ width: "100%", padding: "9px 12px", background: "#fff", border: "1px solid #DDD8D0", borderRadius: "6px", fontSize: "12px", color: "#1A1814", resize: "none", lineHeight: "1.6" }}
                          />
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "8px" }}>Verification Decision</div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {["verified", "conditional", "rejected"].map(d => {
                              const ds = DECISION_STYLES[d];
                              const isActive = proj.assessorDecision === d;
                              return (
                                <button key={d} className="decision-btn"
                                  onClick={() => setDecision(proj.id, isActive ? null : d)}
                                  style={{ padding: "8px 14px", border: `1px solid ${isActive ? ds.border : "#DDD8D0"}`, borderRadius: "6px", background: isActive ? ds.bg : "#fff", color: isActive ? ds.text : "#A09990", fontSize: "11px", fontWeight: isActive ? "600" : "400", transition: "all 0.15s" }}>
                                  {ds.label}
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

          {/* Completion callout */}
          {allDecided && (
            <div style={{ padding: "16px 20px", background: "#EEFAF0", border: "1px solid #C6E8CE", borderRadius: "8px", display: "flex", gap: "10px", marginBottom: "32px", animation: "fadeUp 0.3s ease both" }}>
              <svg style={{ flexShrink: 0, marginTop: "1px" }} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#2E7D32" strokeWidth="1.2"/><path d="M4.5 7l2 2 3-4" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p style={{ fontSize: "12px", color: "#2E7D32", lineHeight: "1.7", margin: 0 }}>
                All projects reviewed. <strong style={{ fontWeight: "600" }}>{totalUnitsVerified} units</strong> cleared from community missions. Proceed to generate the AI interview script for remaining gap subjects.
              </p>
            </div>
          )}

          {/* Footer CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "32px", borderTop: "1px solid #EAE7E2" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1A1814", marginBottom: "3px" }}>Next: Interview Script Generator</div>
              <div style={{ fontSize: "12px", color: "#A09990" }}>AI generates custom questions for each remaining gap subject.</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => navigate("/assessor/audit/a1")}
                style={{ padding: "11px 18px", background: "#fff", border: "1px solid #DDD8D0", color: "#6E685F", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                ← Back to AI Audit
              </button>
              <button className="btn-primary" onClick={() => navigate("/assessor/interview")}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 22px", background: "#1A1814", color: "#F7F6F3", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s", cursor: "pointer" }}>
                Generate Interview Script
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}