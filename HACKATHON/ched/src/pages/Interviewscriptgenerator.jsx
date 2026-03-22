import { useState } from "react";
import { useNavigate } from "react-router-dom";

const APPLICANT = {
  name: "Juan dela Cruz",
  degree: "BS Information Technology",
  jobTitle: "Technical / Repair Technician",
  yearsExp: 6,
  barangayMission: "Barangay Tech Literacy Program",
};

const GAP_SUBJECTS = [
  {
    id: "ethics",
    subject: "Ethics in IT & Society",
    units: 3,
    priority: "high",
    context:
      "Applicant facilitated a tech literacy program for barangay residents. No formal ethics training found in work documents.",
    questions: [
      {
        id: "q1",
        type: "Conceptual",
        difficulty: "Core",
        question:
          "In your tech literacy program, some residents were hesitant to share personal information online. How did you address their concerns, and what ethical principles guided your approach?",
        probes: [
          "What is data privacy, and why does it matter to ordinary users?",
          "How would you handle a situation where a company asks you to collect user data without their knowledge?",
        ],
        rationale:
          "Tests applied understanding of privacy ethics drawn directly from the applicant's barangay mission experience.",
      },
      {
        id: "q2",
        type: "Scenario",
        difficulty: "Core",
        question:
          "A coworker asks you to use a cracked version of software to save the company money. Walk us through how you would respond and why.",
        probes: [
          "What are the legal and ethical consequences of software piracy?",
          "How do you weigh cost savings against ethical obligations?",
        ],
        rationale:
          "Assesses awareness of intellectual property ethics, a key competency in the CHED BSIT PSG for this subject.",
      },
      {
        id: "q3",
        type: "Reflective",
        difficulty: "Supplementary",
        question:
          "During your workshop, did you encounter any situation where technology caused harm or exclusion to a participant? How did you respond?",
        probes: [
          "What does 'digital equity' mean to you?",
          "How can IT professionals contribute to reducing the digital divide?",
        ],
        rationale:
          "Evaluates reflective capacity and lived experience as a proxy for formal ethics instruction.",
      },
    ],
  },
  {
    id: "leadership",
    subject: "Leadership & Management",
    units: 3,
    priority: "high",
    context:
      "No supervisory or managerial experience detected in work documents. Applicant led a small volunteer team in the barangay mission.",
    questions: [
      {
        id: "q4",
        type: "Behavioral",
        difficulty: "Core",
        question:
          "You led a team of volunteers during the Barangay Tech Literacy Program. Describe a specific challenge you faced managing the team and how you resolved it.",
        probes: [
          "How did you assign tasks and motivate your volunteers?",
          "What would you do differently if you led the same team again?",
        ],
        rationale:
          "Directly references the applicant's documented barangay mission to assess real-world leadership application.",
      },
      {
        id: "q5",
        type: "Conceptual",
        difficulty: "Core",
        question:
          "What is the difference between a manager and a leader? Give an example from your own work experience where you had to act as one or both.",
        probes: [
          "Can a person be a good manager but a poor leader? Explain.",
          "What leadership style do you naturally gravitate toward?",
        ],
        rationale:
          "Tests conceptual grounding in management theory against the applicant's 6-year professional background.",
      },
      {
        id: "q6",
        type: "Scenario",
        difficulty: "Supplementary",
        question:
          "A team member is consistently underperforming and affecting group morale. As the team lead, what steps would you take?",
        probes: [
          "How do you balance accountability with empathy?",
          "At what point would you escalate the issue to upper management?",
        ],
        rationale:
          "Evaluates conflict resolution and people management skills as a supplementary leadership indicator.",
      },
    ],
  },
  {
    id: "capstone1",
    subject: "Capstone Project I",
    units: 3,
    priority: "medium",
    context:
      "Capstone requires documented project with measurable outcomes. Health Records Digitization mission partially fulfills this requirement.",
    questions: [
      {
        id: "q7",
        type: "Technical",
        difficulty: "Core",
        question:
          "Walk us through a project you have completed end-to-end — from identifying the problem to delivering a solution. What was your process?",
        probes: [
          "How did you define the project scope and success criteria?",
          "What tools or methodologies did you use to manage the project lifecycle?",
        ],
        rationale:
          "Assesses project management fundamentals and ability to articulate a structured development process.",
      },
      {
        id: "q8",
        type: "Reflective",
        difficulty: "Supplementary",
        question:
          "What was the most significant technical or organizational challenge you faced in any project, and how did you overcome it?",
        probes: [
          "How did you handle unexpected changes in requirements?",
          "What would you do differently in hindsight?",
        ],
        rationale:
          "Tests metacognitive awareness and problem-solving maturity relevant to capstone-level work.",
      },
    ],
  },
  {
    id: "capstone2",
    subject: "Capstone Project II",
    units: 3,
    priority: "medium",
    context:
      "Requires a second documented project with stakeholder presentation and measurable impact.",
    questions: [
      {
        id: "q9",
        type: "Technical",
        difficulty: "Core",
        question:
          "Describe a project where you had to present findings or outcomes to a non-technical audience. How did you communicate complex information clearly?",
        probes: [
          "What visual aids or tools did you use?",
          "How did you measure whether your audience understood the key points?",
        ],
        rationale:
          "Evaluates communication and presentation skills required for Capstone II stakeholder deliverable.",
      },
    ],
  },
];

const TYPE_COLORS = {
  Conceptual: { bg: "#F0F4FF", text: "#1E40AF", border: "#C7D7FD" },
  Scenario: { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8" },
  Behavioral: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE" },
  Reflective: { bg: "#F5F3F0", text: "#4A4540", border: "#DDD8D0" },
  Technical: { bg: "#FFF0F0", text: "#C62828", border: "#FECDCA" },
};

const DIFFICULTY_COLORS = {
  Core: { bg: "#1A1814", text: "#F7F6F3" },
  Supplementary: { bg: "#F0EDE8", text: "#6E685F" },
};

const PRIORITY_COLORS = {
  high: { bg: "#FFF0F0", text: "#C62828", border: "#FECDCA" },
  medium: { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8" },
};

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

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {[
          { label: "Dashboard", path: "/assessor", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg> },
          { label: "AI Audit", path: "/assessor/audit/a1", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.3 4h4.2L9 7.5l1.5 4.5L7 9.5l-3.5 2.5L5 7.5 1.5 5h4.2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
          { label: "Project Verification", path: "/assessor/projects", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { label: "Interview Scripts", path: "/assessor/interview", active: true, icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 2H4a1 1 0 00-1 1v7a1 1 0 001 1h1l2 2 2-2h3a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
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

export default function InterviewScriptGenerator() {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState(GAP_SUBJECTS[0].id);
  const [usedQuestions, setUsedQuestions] = useState({});
  const [customNotes, setCustomNotes] = useState({});
  const [printed, setPrinted] = useState(false);

  const toggleUsed = (qid) => {
    setUsedQuestions(u => ({ ...u, [qid]: !u[qid] }));
  };

  const currentSubject = GAP_SUBJECTS.find(g => g.id === activeSubject);
  const totalQuestions = GAP_SUBJECTS.reduce((s, g) => s + g.questions.length, 0);
  const usedCount = Object.values(usedQuestions).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, textarea { font-family: inherit; cursor: pointer; }
        textarea:focus { outline: none; }
        .btn-primary:hover { background: #2C2925 !important; }
        .subject-tab:hover { background: rgba(247,246,243,0.06) !important; }
        .question-card:hover { border-color: #C4BFB6 !important; }
        .mark-btn:hover { opacity: 0.8 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD8D0; border-radius: 99px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <AssessorSidebar navigate={navigate} />

      {/* ── SUBJECT PANEL (middle column) ── */}
      <div style={{ width: "220px", minHeight: "100vh", background: "#F0EDE8", borderRight: "1px solid #DDD8D0", padding: "36px 20px", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", marginLeft: "256px" }}>
        <div style={{ fontSize: "9px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "16px" }}>Gap Subjects</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {GAP_SUBJECTS.map(g => {
            const isActive = activeSubject === g.id;
            const pc = PRIORITY_COLORS[g.priority];
            const subjectUsed = g.questions.filter(q => usedQuestions[q.id]).length;
            return (
              <button key={g.id} className="subject-tab" onClick={() => setActiveSubject(g.id)}
                style={{ padding: "10px 12px", borderRadius: "6px", background: isActive ? "#1A1814" : "transparent", border: "none", textAlign: "left", width: "100%", transition: "background 0.15s" }}>
                <div style={{ fontSize: "11px", fontWeight: isActive ? "500" : "400", color: isActive ? "#F7F6F3" : "#4A4540", marginBottom: "4px", lineHeight: "1.3" }}>{g.subject}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "9px", fontWeight: "500", color: isActive ? "rgba(247,246,243,0.5)" : pc.text, background: isActive ? "rgba(247,246,243,0.1)" : pc.bg, border: `1px solid ${isActive ? "transparent" : pc.border}`, padding: "1px 6px", borderRadius: "99px" }}>
                    {g.priority === "high" ? "High" : "Medium"}
                  </span>
                  <span style={{ fontSize: "9px", color: isActive ? "rgba(247,246,243,0.4)" : "#A09990" }}>
                    {subjectUsed}/{g.questions.length} asked
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #DDD8D0" }}>
          <div style={{ fontSize: "9px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Interview Progress</div>
          <div style={{ fontSize: "20px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1814", marginBottom: "4px" }}>
            {usedCount} <span style={{ fontSize: "12px", color: "#A09990", fontFamily: "Inter, sans-serif" }}>/ {totalQuestions}</span>
          </div>
          <div style={{ fontSize: "10px", color: "#A09990", marginBottom: "8px" }}>questions asked</div>
          <div style={{ height: "3px", background: "#DDD8D0", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(usedCount / totalQuestions) * 100}%`, background: "#1A1814", borderRadius: "99px", transition: "width 0.4s" }} />
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 48px 72px" }}>
        <div style={{ maxWidth: "720px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => navigate("/assessor")}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#A09990", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Dashboard
              </button>
              <span style={{ color: "#DDD8D0", fontSize: "12px" }}>/</span>
              <span style={{ fontSize: "12px", color: "#4A4540", fontWeight: "500" }}>Interview Script · {APPLICANT.name}</span>
            </div>
            <span style={{ fontSize: "11px", color: "#B0AAA0", letterSpacing: "0.05em" }}>Screen 4 of 5</span>
          </div>

          {/* Page heading */}
          <div style={{ marginBottom: "24px", animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: "11px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>AI Interview Script Generator</p>
            <h1 style={{ fontSize: "26px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#1A1814", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "8px" }}>
              Custom questions for {APPLICANT.name}.
            </h1>
            <p style={{ fontSize: "13px", color: "#6E685F", lineHeight: "1.75" }}>
              AI has generated questions tailored to this applicant's work background, barangay mission, and specific gap subjects. Mark questions as asked during the live interview.
            </p>
          </div>

          {/* Applicant context strip */}
          <div style={{ padding: "12px 16px", background: "#1A1814", borderRadius: "8px", display: "flex", gap: "20px", marginBottom: "24px", flexWrap: "wrap", animation: "fadeUp 0.3s 0.05s ease both" }}>
            {[
              { label: "Applicant", value: APPLICANT.name },
              { label: "Degree", value: APPLICANT.degree.replace("BS ", "") },
              { label: "Experience", value: `${APPLICANT.yearsExp} yrs · ${APPLICANT.jobTitle}` },
              { label: "Mission", value: APPLICANT.barangayMission },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: "9px", color: "#3A3631", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "2px" }}>{item.label}</div>
                <div style={{ fontSize: "11px", color: "#F7F6F3" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Subject header */}
          {currentSubject && (
            <div key={activeSubject} style={{ animation: "slideIn 0.25s ease both" }}>
              <div style={{ padding: "16px 18px", background: "#fff", border: "1px solid #EAE7E2", borderRadius: "8px 8px 0 0", borderBottom: "none", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#1A1814" }}>{currentSubject.subject}</h2>
                    <span style={{ fontSize: "10px", fontWeight: "500", color: PRIORITY_COLORS[currentSubject.priority].text, background: PRIORITY_COLORS[currentSubject.priority].bg, border: `1px solid ${PRIORITY_COLORS[currentSubject.priority].border}`, padding: "2px 7px", borderRadius: "99px" }}>
                      {currentSubject.priority === "high" ? "High Priority" : "Medium"}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6E685F", lineHeight: "1.6" }}>{currentSubject.context}</p>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <div style={{ fontSize: "20px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1814", lineHeight: "1" }}>{currentSubject.questions.length}</div>
                  <div style={{ fontSize: "10px", color: "#A09990" }}>questions</div>
                </div>
              </div>

              {/* Questions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {currentSubject.questions.map((q, qi) => {
                  const isUsed = usedQuestions[q.id];
                  const tc = TYPE_COLORS[q.type] || TYPE_COLORS.Conceptual;
                  const dc = DIFFICULTY_COLORS[q.difficulty];

                  return (
                    <div key={q.id} className="question-card"
                      style={{ background: isUsed ? "#FAFAF8" : "#fff", border: "1px solid #EAE7E2", borderTop: "none", borderRadius: qi === currentSubject.questions.length - 1 ? "0 0 8px 8px" : "0", padding: "18px 18px", transition: "all 0.2s", opacity: isUsed ? 0.7 : 1 }}>

                      {/* Question header */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                        {/* Number */}
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: isUsed ? "#C6E8CE" : "#F0EDE8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                          {isUsed
                            ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#2E7D32" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <span style={{ fontSize: "10px", fontWeight: "600", color: "#6E685F" }}>{qi + 1}</span>
                          }
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: "5px", marginBottom: "7px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "10px", fontWeight: "500", color: tc.text, background: tc.bg, border: `1px solid ${tc.border}`, padding: "2px 7px", borderRadius: "99px" }}>{q.type}</span>
                            <span style={{ fontSize: "10px", fontWeight: "500", color: dc.text, background: dc.bg, padding: "2px 7px", borderRadius: "99px" }}>{q.difficulty}</span>
                          </div>
                          <p style={{ fontSize: "14px", color: "#1A1814", lineHeight: "1.7", fontWeight: "500" }}>{q.question}</p>
                        </div>

                        <button className="mark-btn" onClick={() => toggleUsed(q.id)}
                          style={{ flexShrink: 0, padding: "6px 12px", border: `1px solid ${isUsed ? "#C6E8CE" : "#DDD8D0"}`, borderRadius: "5px", background: isUsed ? "#EEFAF0" : "#fff", color: isUsed ? "#2E7D32" : "#A09990", fontSize: "11px", fontWeight: isUsed ? "500" : "400", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                          {isUsed ? "✓ Asked" : "Mark Asked"}
                        </button>
                      </div>

                      {/* Probe questions */}
                      <div style={{ marginLeft: "36px", marginBottom: "10px" }}>
                        <div style={{ fontSize: "10px", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "6px" }}>Follow-up Probes</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {q.probes.map((probe, pi) => (
                            <div key={pi} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                              <span style={{ fontSize: "12px", color: "#C4BFB6", flexShrink: 0, marginTop: "1px" }}>→</span>
                              <span style={{ fontSize: "12px", color: "#6E685F", lineHeight: "1.6" }}>{probe}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Rationale */}
                      <div style={{ marginLeft: "36px", padding: "9px 12px", background: "#F5F3F0", borderRadius: "5px", display: "flex", gap: "7px" }}>
                        <svg style={{ flexShrink: 0, marginTop: "2px" }} width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1l.9 2.8H9L6.8 5.4l.9 2.8-2.2-1.6-2.2 1.6.9-2.8L2 3.8h2.6z" stroke="#A09990" strokeWidth="1" strokeLinejoin="round"/></svg>
                        <span style={{ fontSize: "11px", color: "#6E685F", lineHeight: "1.6" }}>{q.rationale}</span>
                      </div>

                      {/* Assessor note per question */}
                      <div style={{ marginLeft: "36px", marginTop: "10px" }}>
                        <textarea
                          value={customNotes[q.id] || ""}
                          onChange={e => setCustomNotes(n => ({ ...n, [q.id]: e.target.value }))}
                          placeholder="Note applicant's response here…"
                          rows={2}
                          style={{ width: "100%", padding: "8px 11px", background: "#fff", border: "1px solid #EAE7E2", borderRadius: "5px", fontSize: "11px", color: "#1A1814", resize: "none", lineHeight: "1.6" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subject navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
                {(() => {
                  const idx = GAP_SUBJECTS.findIndex(g => g.id === activeSubject);
                  const prev = GAP_SUBJECTS[idx - 1];
                  const next = GAP_SUBJECTS[idx + 1];
                  return (
                    <>
                      <div>
                        {prev && (
                          <button onClick={() => setActiveSubject(prev.id)}
                            style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#A09990", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3.5 6 7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {prev.subject.split(" ").slice(0, 3).join(" ")}…
                          </button>
                        )}
                      </div>
                      <div>
                        {next && (
                          <button onClick={() => setActiveSubject(next.id)}
                            style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#A09990", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                            {next.subject.split(" ").slice(0, 3).join(" ")}…
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 2l3.5 4L5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "36px", borderTop: "1px solid #EAE7E2", marginTop: "32px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1A1814", marginBottom: "3px" }}>Next: Final Accreditation</div>
              <div style={{ fontSize: "12px", color: "#A09990" }}>Approve or defer the applicant after the interview.</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setPrinted(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "11px 18px", background: printed ? "#EEFAF0" : "#fff", border: `1px solid ${printed ? "#C6E8CE" : "#DDD8D0"}`, color: printed ? "#2E7D32" : "#6E685F", borderRadius: "6px", fontSize: "13px", fontWeight: printed ? "500" : "400", transition: "all 0.2s" }}>
                {printed
                  ? <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="#2E7D32" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> Script Saved</>
                  : <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8V9.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V8M6 1v6M3.5 4.5L6 7l2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Save Script</>
                }
              </button>
              <button className="btn-primary" onClick={() => navigate("/assessor/accreditation")}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 22px", background: "#1A1814", color: "#F7F6F3", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s", cursor: "pointer" }}>
                Proceed to Accreditation
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}