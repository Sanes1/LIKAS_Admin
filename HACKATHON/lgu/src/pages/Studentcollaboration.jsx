import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LGUSidebar from "../components/LGUsidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { getProject, assignStudent, updateMilestone, saveGroundTruth, updateProject } from "../services/firebaseService";

const PROJECT = {
  title: "Health Center Medicine Inventory System",
  category: "Information Technology",
  deadline: "Mar 15, 2026",
  slots: 1,
  tags: ["Database Management", "Systems Analysis & Design", "Technical Documentation"],
  unitsOffered: 9,
};

const APPLICANTS = [
  {
    id: "s1",
    name: "Juan dela Cruz",
    degree: "Grade 11 STEM",
    yearsExp: 6,
    aiScore: 94,
    matchScore: 96,
    matchReason: "All 3 project tags match approved competencies in this student's gap analysis.",
    status: "active",        // active | pending | rejected
    appliedDate: "Feb 3, 2026",
    avatar: "JD",
  },
  {
    id: "s2",
    name: "Carlo Mendoza",
    degree: "Grade 12 STEM",
    yearsExp: 5,
    aiScore: 81,
    matchScore: 81,
    matchReason: "2 of 3 project tags match. Systems Analysis & Design is not in gap list.",
    status: "pending",
    appliedDate: "Feb 5, 2026",
    avatar: "CM",
  },
  {
    id: "s3",
    name: "Patricia Lim",
    degree: "Grade 12 STEM",
    yearsExp: 7,
    aiScore: 88,
    matchScore: 74,
    matchReason: "1 of 3 tags match. Strong profile but degree taxonomy differs.",
    status: "pending",
    appliedDate: "Feb 6, 2026",
    avatar: "PL",
  },
];

const MILESTONES = [
  {
    id: "m1",
    title: "Requirements Gathering & System Design",
    dueDate: "Feb 20, 2026",
    status: "done",
    studentNote: "Interviewed 3 health center staff. Created system flowchart and data schema. Shared draft with barangay contact for review.",
    lguVerified: true,
    lguNote: "Verified. Flowchart was reviewed and approved by Kagawad Rosa Dela Vega.",
  },
  {
    id: "m2",
    title: "Database Build & Core Features",
    dueDate: "Feb 28, 2026",
    status: "done",
    studentNote: "Database built using SQLite. CRUD operations for medicine entries complete. Low-stock alert logic implemented.",
    lguVerified: true,
    lguNote: "Tested by health center staff. Staff confirmed low-stock alert works correctly.",
  },
  {
    id: "m3",
    title: "User Interface & Training Materials",
    dueDate: "Mar 7, 2026",
    status: "in-progress",
    studentNote: "UI mockups submitted. User manual draft at 60% — waiting for barangay feedback on terminology.",
    lguVerified: false,
    lguNote: "",
  },
  {
    id: "m4",
    title: "Final Testing, Handover & Training Session",
    dueDate: "Mar 15, 2026",
    status: "upcoming",
    studentNote: "",
    lguVerified: false,
    lguNote: "",
  },
];

const GROUND_TRUTH_QUESTIONS = [
  { id: "gt1", question: "Did the student attend scheduled check-ins on time?",            answer: null },
  { id: "gt2", question: "Is the delivered system actually being used by barangay staff?", answer: null },
  { id: "gt3", question: "Did the student communicate problems or delays proactively?",    answer: null },
  { id: "gt4", question: "Would you accept this student for a future project?",            answer: null },
];

const MILESTONE_STYLES = {
  done:        { dot: "#2E7D32", dotBg: "#EEFAF0", label: "Done",        labelColor: "#2E7D32", labelBg: "#EEFAF0", labelBorder: "#C6E8CE" },
  "in-progress":{ dot: "#1E40AF", dotBg: "#EFF6FF", label: "In Progress", labelColor: "#1E40AF", labelBg: "#EFF6FF", labelBorder: "#BFDBFE" },
  upcoming:    { dot: "#94A3B8", dotBg: "#F1F5F9", label: "Upcoming",    labelColor: "#64748B", labelBg: "#F1F5F9", labelBorder: "#E2E8F0" },
};

function ConfidenceRing({ score, size = 38 }) {
  const stroke = 3.2, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const color = score >= 90 ? "#2E7D32" : score >= 80 ? "#1E40AF" : "#B45309";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "9px", fontWeight: "600", color }}>{score}</span>
      </div>
    </div>
  );
}

export default function StudentCollaboration() {
  const navigate = useNavigate();
  const location = useLocation();

  const [projectId, setProjectId] = useState(null);
  const [project, setProject] = useState(PROJECT);
  const [applicants, setApplicants] = useState(APPLICANTS);
  const [milestones, setMilestones] = useState(MILESTONES);
  const [groundTruth, setGroundTruth] = useState(GROUND_TRUTH_QUESTIONS);
  const [expandedMilestone, setExpandedMilestone] = useState("m3");
  const [lguNoteInputs, setLguNoteInputs] = useState({});
  const [activeTab, setActiveTab] = useState("progress");
  const [overallRating, setOverallRating] = useState(0);
  const [overallNote, setOverallNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      const projId = location.state?.projectId;
      
      if (projId) {
        try {
          const firebaseProject = await getProject(projId);
          if (firebaseProject) {
            setProjectId(projId);
            setProject({
              title: firebaseProject.title || PROJECT.title,
              category: firebaseProject.category || PROJECT.category,
              deadline: firebaseProject.deadline || PROJECT.deadline,
              slots: firebaseProject.slots || PROJECT.slots,
              tags: firebaseProject.tags || PROJECT.tags,
              unitsOffered: firebaseProject.unitsOffered || PROJECT.unitsOffered,
            });
            
            // Load applicants, milestones, ground truth from Firebase if available
            if (firebaseProject.applicants) {
              // Ensure applicants is an array
              const applicantsArray = Array.isArray(firebaseProject.applicants) 
                ? firebaseProject.applicants 
                : Object.values(firebaseProject.applicants);
              setApplicants(applicantsArray);
            }
            if (firebaseProject.milestones) {
              // Ensure milestones is an array
              const milestonesArray = Array.isArray(firebaseProject.milestones)
                ? firebaseProject.milestones
                : Object.values(firebaseProject.milestones);
              setMilestones(milestonesArray);
            }
            if (firebaseProject.groundTruth) {
              // Ensure groundTruth is an array
              const groundTruthArray = Array.isArray(firebaseProject.groundTruth)
                ? firebaseProject.groundTruth
                : firebaseProject.groundTruth.questions || Object.values(firebaseProject.groundTruth);
              setGroundTruth(groundTruthArray);
            }
          }
        } catch (error) {
          console.error("Failed to load project from Firebase:", error);
        }
      }
      
      setIsLoading(false);
    };

    loadProject();
  }, [location.state]);

  const activeStudent = applicants.find(a => a.status === "active");
  const pendingApplicants = applicants.filter(a => a.status === "pending");
  const doneCount = milestones.filter(m => m.status === "done").length;
  const progressPct = Math.round((doneCount / milestones.length) * 100);
  const gtAnswered = groundTruth.filter(q => q.answer !== null).length;
  const gtAllDone  = gtAnswered === groundTruth.length;

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Inter', sans-serif" }}>
        <LGUSidebar activePath="/lgu/collaboration" />
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "860px", width: "100%" }}>
            <LoadingSpinner message="Loading collaboration data..." />
          </div>
        </main>
      </div>
    );
  }

  const acceptApplicant = async (id) => {
    const updatedApplicants = applicants.map(a =>
      a.id === id ? { ...a, status: "active" } :
      a.status === "active" ? { ...a, status: "rejected" } : a
    );
    setApplicants(updatedApplicants);
    
    // Save to Firebase
    if (projectId) {
      try {
        const activeStudent = updatedApplicants.find(a => a.status === "active");
        if (activeStudent) {
          await assignStudent(projectId, activeStudent);
        }
        await updateProject(projectId, { applicants: updatedApplicants });
      } catch (error) {
        console.error("Failed to accept applicant in Firebase:", error);
      }
    }
  };

  const rejectApplicant = async (id) => {
    const updatedApplicants = applicants.map(a => a.id === id ? { ...a, status: "rejected" } : a);
    setApplicants(updatedApplicants);
    
    // Save to Firebase
    if (projectId) {
      try {
        await updateProject(projectId, { applicants: updatedApplicants });
      } catch (error) {
        console.error("Failed to reject applicant in Firebase:", error);
      }
    }
  };

  const verifyMilestone = async (mid) => {
    const note = lguNoteInputs[mid] || "";
    const updatedMilestones = milestones.map(m => m.id === mid ? { ...m, lguVerified: true, lguNote: note } : m);
    setMilestones(updatedMilestones);
    
    // Save to Firebase
    if (projectId) {
      try {
        await updateMilestone(projectId, mid, { lguVerified: true, lguNote: note });
      } catch (error) {
        console.error("Failed to verify milestone in Firebase:", error);
      }
    }
  };

  const answerGT = async (qid, answer) => {
    const updatedGroundTruth = groundTruth.map(q => q.id === qid ? { ...q, answer } : q);
    setGroundTruth(updatedGroundTruth);
    
    // Save to Firebase
    if (projectId) {
      try {
        await saveGroundTruth(projectId, { questions: updatedGroundTruth });
      } catch (error) {
        console.error("Failed to save ground truth in Firebase:", error);
      }
    }
  };

  const TABS = [
    { id: "applicants",  label: "Student Applicants", badge: pendingApplicants.length || null },
    { id: "progress",    label: "Project Progress" },
    { id: "groundtruth", label: "Ground Truth", badge: !gtAllDone ? `${gtAnswered}/${groundTruth.length}` : null },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input, textarea { font-family: inherit; cursor: pointer; }
        input:focus, textarea:focus { outline: none; }
        .btn-primary:hover { background: #1E40AF !important; }
        .tab-btn:hover     { background: #F1F5F9 !important; }
        .gt-btn:hover      { opacity: 0.8 !important; }
        .star-btn:hover    { transform: scale(1.15) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0);   } }
        @keyframes slideIn    { from { opacity:0; transform:translateX(10px); } to { opacity:1; transform:translateX(0);   } }
        @keyframes expandDown { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0);   } }
        @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <LGUSidebar activePath="/lgu/collaboration" />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "860px", width: "100%" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => navigate("/lgu")}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#64748B", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dashboard
              </button>
              <span style={{ color: "#CBD5E1" }}>/</span>
              <span style={{ fontSize: "12px", color: "#1E293B", fontWeight: "500" }}>Student Collaboration</span>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <NotificationBell />
              <span style={{ fontSize: "11px", color: "#B0AAA0", letterSpacing: "0.05em" }}>Screen 4 of 5</span>
            </div>
          </div>

          {/* Page heading */}
          <div style={{ marginBottom: "24px", animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Student Collaboration & Monitoring</p>
            <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display',Georgia,serif", fontWeight: "400", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "6px" }}>
              {project.title}
            </h1>
            <p style={{ fontSize: "13px", color: "#64748B" }}>
              {project.category} · Due {project.deadline} · {project.unitsOffered} units at stake
            </p>
          </div>

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px", animation: "fadeUp 0.3s 0.05s ease both" }}>
            {[
              { label: "Active Student",   value: activeStudent ? "1"  : "None", sub: activeStudent?.name || "No match yet", cardBg: activeStudent ? "#EFF6FF" : "#fff", cardBorder: activeStudent ? "#BFDBFE" : "#E2E8F0", valueColor: activeStudent ? "#1E40AF" : "#64748B" },
              { label: "Applicants",       value: applicants.length, sub: `${pendingApplicants.length} pending review` },
              { label: "Progress",         value: `${progressPct}%`, sub: `${doneCount} of ${milestones.length} milestones`, cardBg: progressPct === 100 ? "#EEFAF0" : "#fff", cardBorder: progressPct === 100 ? "#C6E8CE" : "#E2E8F0", valueColor: progressPct === 100 ? "#2E7D32" : "#0F172A" },
              { label: "Ground Truth",     value: `${gtAnswered}/${groundTruth.length}`, sub: "questions answered", cardBg: gtAllDone ? "#EEFAF0" : "#fff", cardBorder: gtAllDone ? "#C6E8CE" : "#E2E8F0", valueColor: gtAllDone ? "#2E7D32" : "#0F172A" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.cardBg || "#fff", border: `1px solid ${s.cardBorder || "#E2E8F0"}`, borderRadius: "10px", padding: "18px 20px" }}>
                <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "10px" }}>{s.label}</div>
                <div style={{ fontSize: "26px", fontFamily: "'DM Serif Display',Georgia,serif", color: s.valueColor || "#0F172A", lineHeight: "1", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Tags strip */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "28px", animation: "fadeUp 0.3s 0.08s ease both" }}>
            <span style={{ fontSize: "10px", color: "#64748B", alignSelf: "center", marginRight: "2px" }}>Required tags:</span>
            {project.tags.map((tag, idx) => (
              <span key={`tag-${idx}`} style={{ fontSize: "11px", color: "#0F172A", background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "3px 10px", borderRadius: "99px" }}>{typeof tag === 'string' ? tag : tag.competency}</span>
            ))}
          </div>

          {/* ── TABS ── */}
          <div style={{ display: "flex", gap: "2px", marginBottom: "20px", background: "#F1F5F9", borderRadius: "8px", padding: "4px", animation: "fadeUp 0.3s 0.1s ease both" }}>
            {TABS.map(tab => (
              <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, padding: "9px 14px", borderRadius: "6px", background: activeTab === tab.id ? "#fff" : "transparent", border: "none", fontSize: "12px", fontWeight: activeTab === tab.id ? "500" : "400", color: activeTab === tab.id ? "#0F172A" : "#475569", transition: "background 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                {tab.label}
                {tab.badge && (
                  <span style={{ fontSize: "9px", fontWeight: "600", color: activeTab === tab.id ? "#B45309" : "#64748B", background: activeTab === tab.id ? "#FFF8F0" : "#E2E8F0", border: activeTab === tab.id ? "1px solid #FDE8C8" : "none", padding: "1px 6px", borderRadius: "99px" }}>{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* ══ TAB: APPLICANTS ══ */}
          {activeTab === "applicants" && (
            <div style={{ animation: "fadeUp 0.2s ease both" }}>
              {applicants.map((a, i) => {
                const isActive   = a.status === "active";
                const isPending  = a.status === "pending";
                const isRejected = a.status === "rejected";
                return (
                  <div key={a.id}
                    style={{ background: "#fff", border: `1.5px solid ${isActive ? "#BFDBFE" : isRejected ? "#F1F5F9" : "#E2E8F0"}`, borderRadius: "10px", padding: "18px 20px", marginBottom: "10px", opacity: isRejected ? 0.55 : 1, animation: `slideIn 0.25s ${i*0.05}s ease both` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>

                      {/* Avatar + ring */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: isActive ? "#EFF6FF" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: isActive ? "#1E40AF" : "#475569" }}>{a.avatar}</span>
                        </div>
                        {isActive && (
                          <div style={{ position: "absolute", bottom: 0, right: 0, width: "12px", height: "12px", borderRadius: "50%", background: "#2E7D32", border: "2px solid #fff", animation: "pulse 2s infinite" }} />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>{a.name}</span>
                          {isActive && <span style={{ fontSize: "9px", fontWeight: "600", color: "#1E40AF", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "2px 8px", borderRadius: "99px" }}>ACTIVE</span>}
                          {isRejected && <span style={{ fontSize: "9px", fontWeight: "500", color: "#64748B", background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "2px 8px", borderRadius: "99px" }}>PASSED</span>}
                        </div>
                        <div style={{ fontSize: "12px", color: "#475569", marginBottom: "8px" }}>{a.degree} · {a.yearsExp} yrs exp</div>

                        {/* Match reason */}
                        <div style={{ padding: "8px 12px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "5px", display: "flex", gap: "7px", marginBottom: "12px" }}>
                          <svg style={{ flexShrink: 0, marginTop: "2px" }} width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1l.8 2.6H9L6.7 5.3l.8 2.7-2-1.5-2 1.5.8-2.7L2 3.6h2.7z" stroke="#64748B" strokeWidth="1" strokeLinejoin="round"/></svg>
                          <span style={{ fontSize: "11px", color: "#475569", lineHeight: "1.6" }}>{a.matchReason}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <div style={{ display: "flex", gap: "16px" }}>
                            <div>
                              <div style={{ fontSize: "9px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>AI Score</div>
                              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <ConfidenceRing score={a.aiScore} />
                                <span style={{ fontSize: "11px", color: "#475569" }}>overall</span>
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: "9px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>Project Match</div>
                              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <ConfidenceRing score={a.matchScore} />
                                <span style={{ fontSize: "11px", color: "#475569" }}>to this project</span>
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: "9px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Applied</div>
                              <div style={{ fontSize: "11px", color: "#475569" }}>{a.appliedDate}</div>
                            </div>
                          </div>

                          {isPending && (
                            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                              <button onClick={() => rejectApplicant(a.id)}
                                style={{ padding: "8px 14px", background: "#fff", border: "1px solid #CBD5E1", color: "#64748B", borderRadius: "6px", fontSize: "12px", fontWeight: "500" }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "#C62828"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "#CBD5E1"}>
                                Pass
                              </button>
                              <button onClick={() => acceptApplicant(a.id)}
                                style={{ padding: "8px 14px", background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "500" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#1E40AF"}
                                onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}>
                                Accept
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ TAB: PROJECT PROGRESS ══ */}
          {activeTab === "progress" && (
            <div style={{ animation: "fadeUp 0.2s ease both" }}>

              {/* Active student strip */}
              {activeStudent && (
                <div style={{ padding: "14px 18px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#1E40AF" }}>{activeStudent.avatar}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "#1E40AF", marginBottom: "1px" }}>{activeStudent.name}</div>
                    <div style={{ fontSize: "11px", color: "#3B82F6" }}>{activeStudent.degree} · Accepted {activeStudent.appliedDate}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "22px", fontFamily: "'DM Serif Display',Georgia,serif", color: "#1E40AF", lineHeight: "1" }}>{progressPct}%</div>
                    <div style={{ fontSize: "10px", color: "#3B82F6" }}>complete</div>
                  </div>
                </div>
              )}

              {/* Simple milestone list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {milestones.map((m, i) => {
                  const ms = MILESTONE_STYLES[m.status];
                  return (
                    <div key={m.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "16px 18px", animation: `slideIn 0.25s ${i * 0.05}s ease both` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: ms.dotBg, border: `2px solid ${ms.dot}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {m.status === "done" && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5 5.5-5.5" stroke={ms.dot} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          {m.status === "in-progress" && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: ms.dot, animation: "pulse 1.5s infinite" }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "14px", fontWeight: "500", color: "#0F172A" }}>{m.title}</span>
                            <span style={{ fontSize: "10px", fontWeight: "500", color: ms.labelColor, background: ms.labelBg, border: `1px solid ${ms.labelBorder}`, padding: "2px 8px", borderRadius: "99px" }}>{ms.label}</span>
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748B" }}>Due {m.dueDate}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ TAB: GROUND TRUTH ══ */}
          {activeTab === "groundtruth" && (
            <div style={{ animation: "fadeUp 0.2s ease both" }}>
              <div style={{ padding: "14px 18px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "8px", marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.75" }}>
                  Ground Truth is <strong style={{ color: "#0F172A", fontWeight: "500" }}>your perspective as the LGU</strong> on whether the student's work actually helped your community. These answers will be submitted to the assessor along with the completion certificate and override any self-reported data from the student.
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {groundTruth.map((q, i) => (
                  <div key={q.id} style={{ background: "#fff", border: `1px solid ${q.answer !== null ? "#C6E8CE" : "#E2E8F0"}`, borderRadius: "8px", padding: "18px 20px", animation: `slideIn 0.25s ${i*0.05}s ease both` }}>
                    <p style={{ fontSize: "13px", fontWeight: "500", color: "#0F172A", lineHeight: "1.6", marginBottom: "14px" }}>{i + 1}. {q.question}</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { val: true,  label: "Yes", color: "#2E7D32", bg: "#EEFAF0", border: "#C6E8CE" },
                        { val: false, label: "No",  color: "#C62828", bg: "#FFF0F0", border: "#FECDCA" },
                      ].map(opt => {
                        const isActive = q.answer === opt.val;
                        return (
                          <button key={String(opt.val)} className="gt-btn"
                            onClick={() => answerGT(q.id, opt.val)}
                            style={{ padding: "9px 24px", border: `1.5px solid ${isActive ? opt.border : "#CBD5E1"}`, borderRadius: "6px", background: isActive ? opt.bg : "#fff", color: isActive ? opt.color : "#64748B", fontSize: "13px", fontWeight: isActive ? "600" : "400", transition: "all 0.15s" }}>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall rating */}
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "14px 18px", background: "#F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "11px", fontWeight: "500", color: "#0F172A" }}>Overall Performance Rating</span>
                </div>
                <div style={{ padding: "20px 18px" }}>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
                    {[1,2,3,4,5].map(star => (
                      <button key={star} className="star-btn"
                        onClick={() => setOverallRating(star)}
                        style={{ fontSize: "28px", background: "none", border: "none", padding: "2px", transition: "transform 0.15s", transform: "scale(1)", color: star <= overallRating ? "#B45309" : "#CBD5E1" }}>
                        ★
                      </button>
                    ))}
                    {overallRating > 0 && (
                      <span style={{ fontSize: "12px", color: "#64748B", alignSelf: "center", marginLeft: "6px" }}>
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][overallRating]}
                      </span>
                    )}
                  </div>
                  <textarea
                    value={overallNote}
                    onChange={e => setOverallNote(e.target.value)}
                    placeholder="Optional: share any additional feedback about the student's work and community impact…"
                    rows={3}
                    style={{ width: "100%", padding: "10px 13px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "12px", color: "#0F172A", resize: "none", lineHeight: "1.65" }}
                  />
                </div>
              </div>

              {gtAllDone && (
                <div style={{ padding: "13px 16px", background: "#EEFAF0", border: "1px solid #C6E8CE", borderRadius: "6px", display: "flex", gap: "8px", alignItems: "center" }}>
                  <svg style={{ flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#2E7D32" strokeWidth="1.2"/><path d="M4.5 7l2 2 3-4" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p style={{ fontSize: "12px", color: "#2E7D32", margin: 0, fontWeight: "500" }}>
                    All ground truth questions answered. You're ready to sign the completion certificate.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "32px", borderTop: "1px solid #E2E8F0", marginTop: "32px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#0F172A", marginBottom: "3px" }}>Project Monitoring</div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>Track student progress and verify milestones as they complete the project.</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => navigate("/lgu/tagging")}
                style={{ padding: "11px 18px", background: "#fff", border: "1px solid #CBD5E1", color: "#475569", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                ← Back to Tagging
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
