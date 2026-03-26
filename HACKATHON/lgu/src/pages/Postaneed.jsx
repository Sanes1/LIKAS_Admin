import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LGUSidebar from "../components/LGUsidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import { analyzeCompetency } from "../utils/aiService";
import { createProject, saveAnalysis } from "../services/firebaseService"; 

const SUBJECTS = [
  "Biology",
  "Chemistry",
  "Earth and Space Science",
  "Finite Mathematics",
  "Physics",
];

const URGENCY_LEVELS = [
  { id: "low",    label: "Low",    sub: "Within 6 months" },
  { id: "medium", label: "Medium", sub: "Within 3 months" },
  { id: "high",   label: "High",   sub: "Within 1 month"  },
];

const MISSION_TIERS = [
  { id: "beginner",     label: "Beginner",     tokensRequired: 0,   sub: "Open to all students", color: "#2E7D32", bg: "#EEFAF0", border: "#C6E8CE" },
  { id: "intermediate", label: "Intermediate", tokensRequired: 50,  sub: "Requires 50 tokens",   color: "#1E40AF", bg: "#EFF6FF", border: "#BFDBFE" },
  { id: "advanced",     label: "Advanced",     tokensRequired: 100, sub: "Requires 100 tokens",  color: "#B45309", bg: "#FFF8F0", border: "#FDE8C8" },
];

const EXAMPLE_PROBLEMS = [
  {
    title: "Automated inventory for our Health Center's medicine supply",
    category: "Biology",
    description: "Our barangay health center currently tracks medicine stocks using a physical logbook. Medicines expire unnoticed and restocking is always delayed. We need a simple digital system that records incoming and outgoing medicines, alerts staff when a medicine is low, and generates a monthly report.",
    impact: "24 monthly patients directly affected by medicine shortages. Manual tracking causes 3–5 days of delay per restock cycle.",
    outputs: "Working inventory application, user manual, staff training session",
  },
  {
    title: "Digital blotter system to replace handwritten records",
    category: "Finite Mathematics",
    description: "All incident reports filed at the barangay hall are handwritten and stored in folders. Retrieving old records takes hours. We need a searchable digital blotter that allows staff to log incidents, search by date or name, and generate monthly summaries.",
    impact: "Avg. 40 blotter entries per month. Manual retrieval averages 45 minutes per record request.",
    outputs: "Digital blotter system, data migration of past 12 months of records, printed user guide",
  },
];

export default function PostANeed() {
  const navigate = useNavigate();

  const [title,       setTitle]       = useState("");
  const [category,    setCategory]    = useState("");
  const [description, setDescription] = useState("");
  const [impact,      setImpact]      = useState("");
  const [outputs,     setOutputs]     = useState("");
  const [urgency,     setUrgency]     = useState("medium");
  const [tier,        setTier]        = useState("beginner");
  const [slots,       setSlots]       = useState(1);
  const [duration,    setDuration]    = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  
  // Load user data from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem("lguUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setContactName(user.name || "");
        setContactRole(user.position || "LGU Staff");
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);
  

  // --- AI STATES ---
  const [isAnalyzing, setIsAnalyzing]         = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analyzeText, setAnalyzeText]         = useState("");
  const [aiRejection, setAiRejection]         = useState(null); 
  
  // 🔥 NEW: We need a place to hold the AI's success data so we can pass it to the next page!
  const [aiData, setAiData]                   = useState(null);
  // -----------------

  const [exampleOpen, setExampleOpen] = useState(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [errors,      setErrors]      = useState({});
  const [projectId,   setProjectId]   = useState(null);

  const filled = [title, category, description, impact, outputs, duration].filter(Boolean).length;
  const total  = 6;
  const pct    = Math.round((filled / total) * 100);

  const applyExample = (ex) => {
    setTitle(ex.title);
    setCategory(ex.category);
    setDescription(ex.description);
    setImpact(ex.impact);
    setOutputs(ex.outputs);
    setExampleOpen(null);
    setAiRejection(null); // Clear any previous errors
  };

  const validate = () => {
    const e = {};
    if (!title.trim())       e.title       = "Required";
    if (!category)           e.category    = "Required";
    if (!description.trim()) e.description = "Required";
    if (!impact.trim())      e.impact      = "Required";
    if (!outputs.trim())     e.outputs     = "Required";
    if (!duration.trim())    e.duration    = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setAiRejection(null);
      setIsAnalyzing(true);
      setAnalyzeProgress(0);
      setAnalyzeText("Validating project details...");
      
      const projectData = { title, category, description, impact, outputs, urgency, tier, duration, slots, contactName, contactRole };
      
      const progressInterval = setInterval(() => {
        setAnalyzeProgress(prev => {
          if (prev < 30) {
            setAnalyzeText("Checking project feasibility...");
            return prev + Math.floor(Math.random() * 15) + 5;
          } else if (prev < 65) {
            setAnalyzeText("Matching academic competencies...");
            return prev + Math.floor(Math.random() * 10) + 5;
          } else if (prev < 90) {
            setAnalyzeText("Finalizing tags...");
            return prev + Math.floor(Math.random() * 5) + 2;
          } else {
            return 90; 
          }
        });
      }, 600);
      
      try {
        console.log("Starting AI analysis...");
        const aiResponse = await analyzeCompetency(projectData);
        console.log("AI analysis complete:", aiResponse);
        
        clearInterval(progressInterval);
        setAnalyzeProgress(100);

        const isProjectValid = aiResponse.isValid === true || aiResponse.isValid === "true";

        if (!isProjectValid) {
          setTimeout(() => {
            setIsAnalyzing(false);
            setAiRejection(aiResponse.reason || "The AI determined this is not a valid or realistic community project. Please revise.");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 600);
          return;
        }

        setAnalyzeText("Project validated successfully!");
        
        setTimeout(async () => {
          try {
            console.log("Starting Firebase save...");
            
            // Create project in Firebase
            const newProjectId = await createProject({
              ...projectData,
              tags: aiResponse.tags || [],
              curriculum: aiResponse.curriculum,
              department: aiResponse.department,
              tokensReward: tier === "advanced" ? 15 : tier === "intermediate" ? 10 : 5,
              status: 'matching',
              slotsRemaining: slots,
              assignedStudents: [],
              completedStudents: [],
              // Backup original data to prevent loss when students complete missions
              originalData: {
                title: title,
                description: description,
                tags: aiResponse.tags || [],
                postedBy: projectData.postedBy,
                category: category,
                impact: impact,
                outputs: outputs
              }
            });

            console.log("Project created with ID:", newProjectId);

            // Save AI analysis data
            await saveAnalysis(newProjectId, aiResponse);

            console.log("Analysis saved successfully");

            setProjectId(newProjectId);
            setAiData(aiResponse);
            setIsAnalyzing(false);
            setSubmitted(true);
          } catch (error) {
            console.error("Firebase save failed:", error);
            setIsAnalyzing(false);
            setAiRejection(`Failed to save project: ${error.message}. Please check console for details.`);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 800);

      } catch (error) {
        clearInterval(progressInterval);
        console.error("AI Analysis failed:", error);
        setIsAnalyzing(false);
        setAnalyzeProgress(0);
        setAiRejection(`AI analysis failed: ${error.message}. Please try again.`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const resetForm = () => {
    setTitle(""); setCategory(""); setDescription("");
    setImpact(""); setOutputs(""); setDuration("");
    setSubmitted(false); setErrors({}); setAiRejection(null); setAiData(null); setProjectId(null);
  };

  // ── SUCCESS STATE ──
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          button { font-family: inherit; cursor: pointer; }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.93); } to { opacity: 1; transform: scale(1); } }
          @keyframes fadeUp  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        <LGUSidebar activePath="/lgu/post" />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", marginLeft: "256px" }}>
          <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", animation: "scaleIn 0.35s cubic-bezier(0.4,0,0.2,1) both" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#EEFAF0", border: "2px solid #C6E8CE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 7" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 style={{ fontSize: "26px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#0F172A", marginBottom: "10px", letterSpacing: "-0.3px" }}>
              Need posted successfully.
            </h1>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.75", marginBottom: "32px" }}>
              <strong style={{ color: "#0F172A", fontWeight: "500" }}>"{title}"</strong> has been submitted to the SKILLSET directory. AI will now tag it with relevant academic competencies and surface it to matching students.
            </p>

            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "18px 20px", marginBottom: "28px", textAlign: "left", animation: "fadeUp 0.3s 0.1s ease both" }}>
              {[
                { label: "Next Step",     value: "AI Competency Tagging" },
                { label: "Subject",       value: category },
                { label: "Mission Tier",  value: MISSION_TIERS.find(t => t.id === tier)?.label },
                { label: "Urgency",       value: URGENCY_LEVELS.find(u => u.id === urgency)?.label },
                { label: "Student Slots", value: slots },
                { label: "Duration",      value: duration },
                { label: "Contact",       value: `${contactName} · ${contactRole}` },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>{row.label}</span>
                  <span style={{ fontSize: "12px", color: "#0F172A", fontWeight: "500" }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button onClick={resetForm}
                style={{ padding: "10px 18px", background: "#fff", border: "1px solid #CBD5E1", color: "#475569", borderRadius: "6px", fontSize: "13px", fontWeight: "500" }}>
                Post Another
              </button>
              
              <button onClick={() => navigate("/lgu/tagging", { 
                  state: { 
                    projectId: projectId,
                    project: { title, category, description, impact, outputs, urgency, tier, duration, slots, contactName, contactRole }, 
                    analysis: aiData 
                  } 
                })}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 20px", background: "#0F172A", color: "#F8FAFC", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500" }}>
                Go to Competency Tagging
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── FORM ──
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input, select, textarea { font-family: inherit; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #0F172A !important; }
        .btn-primary:hover   { background: #1E40AF !important; }
        .example-card:hover  { border-color: #94A3B8 !important; }
        .urgency-btn:hover   { border-color: #0F172A !important; }
        ::-webkit-scrollbar  { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        @keyframes fadeUp     { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0);  } }
        @keyframes expandDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0);  } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
      `}</style>

      {/* LOADING OVERLAY */}
      {isAnalyzing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(247, 246, 243, 0.85)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ width: "320px", background: "#fff", padding: "32px 28px", borderRadius: "14px", border: "1px solid #E2E8F0", boxShadow: "0 12px 40px rgba(0,0,0,0.06)", textAlign: "center", animation: "slideUpFade 0.3s ease both" }}>
            <div style={{ width: "24px", height: "24px", border: "2px solid #CBD5E1", borderTopColor: "#0F172A", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Progress</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>{analyzeProgress}%</span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ height: "100%", width: `${analyzeProgress}%`, background: "#0F172A", borderRadius: "99px", transition: "width 0.5s ease-out" }} />
            </div>
            <p style={{ fontSize: "13px", color: "#475569", fontWeight: "500", margin: 0, transition: "opacity 0.2s" }}>{analyzeText}</p>
          </div>
        </div>
      )}

      <LGUSidebar activePath="/lgu/post" />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px" , marginLeft: "256px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "700px", width: "100%" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => navigate("/lgu")}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#64748B", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dashboard
              </button>
              <span style={{ color: "#CBD5E1", fontSize: "12px" }}>/</span>
              <span style={{ fontSize: "12px", color: "#1E293B", fontWeight: "500" }}>Post a Community Need</span>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <NotificationBell />
              <span style={{ fontSize: "11px", color: "#B0AAA0", letterSpacing: "0.05em" }}>Screen 2 of 5</span>
            </div>
          </div>

          {/* Page heading */}
          <div style={{ marginBottom: "28px", animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Post a Community Need</p>
            <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "8px" }}>
              What does your barangay need?
            </h1>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.75", maxWidth: "520px" }}>
              Describe a real problem your community faces. The more detail you give, the better SKILLSET can match the right student to your need.
            </p>
          </div>

          {/* Form completion progress bar */}
          <div style={{ marginBottom: "28px", animation: "fadeUp 0.3s 0.04s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "#64748B" }}>Form completion</span>
              <span style={{ fontSize: "11px", fontWeight: "500", color: pct === 100 ? "#2E7D32" : "#0F172A" }}>{pct}%</span>
            </div>
            <div style={{ height: "3px", background: "#E2E8F0", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#2E7D32" : "#0F172A", borderRadius: "99px", transition: "width 0.4s ease" }} />
            </div>
          </div>

          {/* WARNING BANNER */}
          {aiRejection && (
            <div style={{ marginBottom: "24px", padding: "16px 20px", background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "flex-start", animation: "shake 0.4s ease both" }}>
              <svg style={{ flexShrink: 0, marginTop: "2px" }} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="#D32F2F"/></svg>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#B71C1C", marginBottom: "4px" }}>Submission Rejected by AI</h4>
                <p style={{ fontSize: "13px", color: "#C62828", lineHeight: "1.6", margin: 0 }}>{aiRejection}</p>
              </div>
            </div>
          )}

          {/* Example prompts */}
          <div style={{ marginBottom: "28px", animation: "fadeUp 0.3s 0.06s ease both" }}>
            <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "10px" }}>
              Need inspiration? Use an example
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {EXAMPLE_PROBLEMS.map((ex, i) => (
                <div key={i}>
                  <div className="example-card" onClick={() => setExampleOpen(exampleOpen === i ? null : i)}
                    style={{ padding: "12px 16px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: exampleOpen === i ? "7px 7px 0 0" : "7px", cursor: "pointer", transition: "border-color 0.15s", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "500", color: "#0F172A", marginBottom: "2px" }}>{ex.title}</div>
                      <div style={{ fontSize: "10px", color: "#64748B" }}>{ex.category}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                      <button onClick={e => { e.stopPropagation(); applyExample(ex); }}
                        style={{ padding: "5px 11px", background: "#0F172A", color: "#F8FAFC", border: "none", borderRadius: "5px", fontSize: "11px", fontWeight: "500", cursor: "pointer" }}>
                        Use this
                      </button>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: exampleOpen === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.18s", color: "#94A3B8" }}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  {exampleOpen === i && (
                    <div style={{ padding: "12px 16px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderTop: "none", borderRadius: "0 0 7px 7px", animation: "expandDown 0.18s ease both" }}>
                      <p style={{ fontSize: "12px", color: "#1E293B", lineHeight: "1.75", marginBottom: "8px" }}>{ex.description}</p>
                      <p style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.65" }}><strong style={{ color: "#475569" }}>Impact: </strong>{ex.impact}</p>
                      <p style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.65" }}><strong style={{ color: "#475569" }}>Outputs: </strong>{ex.outputs}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeUp 0.3s 0.08s ease both" }}>

            {/* 1 · The Problem */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", background: "#F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "11px", fontWeight: "500", color: "#0F172A" }}>1 · The Problem</span>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "7px" }}>
                    Project Title <span style={{ color: "#C62828" }}>*</span>
                  </label>
                  <input value={title} onChange={e => { setTitle(e.target.value); setAiRejection(null); }}
                    placeholder="e.g. Automated inventory system for our Health Center's medicine supply"
                    style={{ width: "100%", padding: "10px 13px", background: "#fff", border: `1px solid ${errors.title ? "#C62828" : "#CBD5E1"}`, borderRadius: "6px", fontSize: "13px", color: "#0F172A" }} />
                  {errors.title && <p style={{ fontSize: "11px", color: "#C62828", marginTop: "4px" }}>{errors.title}</p>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "7px" }}>
                    Subject <span style={{ color: "#C62828" }}>*</span>
                  </label>
                  <select value={category} onChange={e => { setCategory(e.target.value); setAiRejection(null); }}
                    style={{ width: "100%", padding: "10px 13px", background: "#fff", border: `1px solid ${errors.category ? "#C62828" : "#CBD5E1"}`, borderRadius: "6px", fontSize: "13px", color: category ? "#0F172A" : "#64748B", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A09990' stroke-width='1.2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
                    <option value="">Select a subject…</option>
                    {SUBJECTS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p style={{ fontSize: "11px", color: "#C62828", marginTop: "4px" }}>{errors.category}</p>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "7px" }}>
                    Problem Description <span style={{ color: "#C62828" }}>*</span>
                  </label>
                  <textarea value={description} onChange={e => { setDescription(e.target.value); setAiRejection(null); }} rows={5}
                    placeholder="Describe the problem in detail. What is happening now? What is not working? Who is affected?"
                    style={{ width: "100%", padding: "10px 13px", background: "#fff", border: `1px solid ${errors.description ? "#C62828" : "#CBD5E1"}`, borderRadius: "6px", fontSize: "13px", color: "#0F172A", resize: "vertical", lineHeight: "1.7" }} />
                  {errors.description && <p style={{ fontSize: "11px", color: "#C62828", marginTop: "4px" }}>{errors.description}</p>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "5px" }}>
                    Community Impact <span style={{ color: "#C62828" }}>*</span>
                  </label>
                  <p style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "7px" }}>How many residents are affected? What happens if this problem isn't solved?</p>
                  <textarea value={impact} onChange={e => { setImpact(e.target.value); setAiRejection(null); }} rows={3}
                    placeholder="e.g. 24 monthly patients directly affected. Medicine shortages cause 3–5 days of treatment delays per month."
                    style={{ width: "100%", padding: "10px 13px", background: "#fff", border: `1px solid ${errors.impact ? "#C62828" : "#CBD5E1"}`, borderRadius: "6px", fontSize: "13px", color: "#0F172A", resize: "vertical", lineHeight: "1.7" }} />
                  {errors.impact && <p style={{ fontSize: "11px", color: "#C62828", marginTop: "4px" }}>{errors.impact}</p>}
                </div>
              </div>
            </div>

            {/* 2 · Expected Output */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", background: "#F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "11px", fontWeight: "500", color: "#0F172A" }}>2 · Expected Output</span>
              </div>
              <div style={{ padding: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "5px" }}>
                  What should the student deliver? <span style={{ color: "#C62828" }}>*</span>
                </label>
                <p style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "7px" }}>List the concrete deliverables you expect at the end of the project.</p>
                <textarea value={outputs} onChange={e => { setOutputs(e.target.value); setAiRejection(null); }} rows={3}
                  placeholder="e.g. Working inventory app, user manual, one training session for 3 staff members, printed quick-reference guide"
                  style={{ width: "100%", padding: "10px 13px", background: "#fff", border: `1px solid ${errors.outputs ? "#C62828" : "#CBD5E1"}`, borderRadius: "6px", fontSize: "13px", color: "#0F172A", resize: "vertical", lineHeight: "1.7" }} />
                {errors.outputs && <p style={{ fontSize: "11px", color: "#C62828", marginTop: "4px" }}>{errors.outputs}</p>}
              </div>
            </div>

            {/* 3 · Logistics */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", background: "#F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "11px", fontWeight: "500", color: "#0F172A" }}>3 · Logistics</span>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "5px" }}>
                    Mission Tier <span style={{ color: "#C62828" }}>*</span>
                  </label>
                  <p style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "7px" }}>Select difficulty level. Students need tokens to unlock higher tiers.</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {MISSION_TIERS.map(t => (
                      <button key={t.id} className="urgency-btn" onClick={() => setTier(t.id)}
                        style={{ flex: 1, padding: "12px 10px", border: `1.5px solid ${tier === t.id ? t.border : "#CBD5E1"}`, borderRadius: "7px", background: tier === t.id ? t.bg : "#fff", cursor: "pointer", transition: "all 0.15s", textAlign: "center" }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: tier === t.id ? t.color : "#0F172A", marginBottom: "3px" }}>{t.label}</div>
                        <div style={{ fontSize: "10px", color: tier === t.id ? t.color : "#94A3B8", opacity: tier === t.id ? 0.8 : 1 }}>{t.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "10px" }}>Urgency</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {URGENCY_LEVELS.map(u => (
                      <button key={u.id} className="urgency-btn" onClick={() => setUrgency(u.id)}
                        style={{ flex: 1, padding: "12px 10px", border: `1px solid ${urgency === u.id ? "#0F172A" : "#CBD5E1"}`, borderRadius: "7px", background: urgency === u.id ? "#0F172A" : "#fff", cursor: "pointer", transition: "all 0.15s", textAlign: "center" }}>
                        <div style={{ fontSize: "13px", fontWeight: "500", color: urgency === u.id ? "#F8FAFC" : "#0F172A", marginBottom: "3px" }}>{u.label}</div>
                        <div style={{ fontSize: "10px", color: urgency === u.id ? "#94A3B8" : "#94A3B8" }}>{u.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "7px" }}>
                      Estimated Duration <span style={{ color: "#C62828" }}>*</span>
                    </label>
                    <input value={duration} onChange={e => { setDuration(e.target.value); setAiRejection(null); }}
                      placeholder="e.g. 4 weeks, 2 months"
                      style={{ width: "100%", padding: "10px 13px", background: "#fff", border: `1px solid ${errors.duration ? "#C62828" : "#CBD5E1"}`, borderRadius: "6px", fontSize: "13px", color: "#0F172A" }} />
                    {errors.duration && <p style={{ fontSize: "11px", color: "#C62828", marginTop: "4px" }}>{errors.duration}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "7px" }}>Student Slots</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1px solid #CBD5E1", borderRadius: "6px", overflow: "hidden", width: "fit-content" }}>
                      <button onClick={() => setSlots(s => Math.max(1, s - 1))}
                        style={{ width: "36px", height: "40px", background: "#F1F5F9", border: "none", fontSize: "16px", color: "#475569", cursor: "pointer", borderRight: "1px solid #E2E8F0" }}>−</button>
                      <div style={{ padding: "0 20px", fontSize: "14px", fontWeight: "500", color: "#0F172A", lineHeight: "40px" }}>{slots}</div>
                      <button onClick={() => setSlots(s => Math.min(5, s + 1))}
                        style={{ width: "36px", height: "40px", background: "#F1F5F9", border: "none", fontSize: "16px", color: "#475569", cursor: "pointer", borderLeft: "1px solid #E2E8F0" }}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 · Contact */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", background: "#F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "11px", fontWeight: "500", color: "#0F172A" }}>4 · Barangay Contact</span>
              </div>
              <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "7px" }}>Contact Person</label>
                  <input value={contactName} onChange={e => setContactName(e.target.value)}
                    style={{ width: "100%", padding: "10px 13px", background: "#fff", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "13px", color: "#0F172A" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "7px" }}>Role</label>
                  <input value={contactRole} onChange={e => setContactRole(e.target.value)}
                    style={{ width: "100%", padding: "10px 13px", background: "#fff", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "13px", color: "#0F172A" }} />
                </div>
              </div>
            </div>

          </div>

          {/* Footer CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "32px", borderTop: "1px solid #E2E8F0", marginTop: "28px" }}>
            <button onClick={() => navigate("/lgu")}
              style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#64748B", fontSize: "13px", cursor: "pointer", padding: 0, fontWeight: "500" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3.5 6 7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to Dashboard
            </button>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>{filled}/{total} fields complete</span>
              <button className="btn-primary" onClick={handleSubmit} disabled={isAnalyzing}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 22px", background: isAnalyzing ? "#CBD5E1" : "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s", cursor: isAnalyzing ? "not-allowed" : "pointer" }}>
                {isAnalyzing ? "Validating..." : "Submit & Tag with AI"}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
