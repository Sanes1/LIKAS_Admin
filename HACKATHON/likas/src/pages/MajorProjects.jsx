import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, Zap, GraduationCap, Download, Clock, CheckCircle, Dna, FlaskConical, Globe, Calculator, ArrowLeft } from "lucide-react";
import { getStudentProjects } from "../services/firestoreService";

// Icon mapping for subjects
const SUBJECT_ICONS = {
  "Computer Science": Monitor,
  "Physics": Zap,
  "Biology": Dna,
  "Chemistry": FlaskConical,
  "Earth & Space": Globe,
  "Mathematics": Calculator,
  "Default": Monitor
};

export default function MajorProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const studentData = JSON.parse(localStorage.getItem("studentData") || "{}");
      
      if (studentData.uid) {
        const result = await getStudentProjects(studentData.uid);
        if (result.success) {
          // Filter only major projects (100 tokens each)
          const majorProjects = result.projects.filter(p => p.tokensEarned === 100 || p.tier === 'major');
          setProjects(majorProjects);
        }
      }
      setLoading(false);
    };
    
    loadProjects();
  }, []);

  const downloadPDF = () => {
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #F8FAFC 0%, #FFFFFF 100%)", fontFamily: "'Inter', sans-serif", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .project-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .project-card:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15); }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Back Button */}
        <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#64748B", cursor: "pointer", marginBottom: "32px", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Home
        </button>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "700", color: "#0F172A", marginBottom: "12px", letterSpacing: "-0.02em" }}>Major Projects</h1>
          <p style={{ fontSize: "16px", color: "#64748B", lineHeight: "1.6" }}>Capstone-level projects that fulfill your degree requirements</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ width: "48px", height: "48px", border: "4px solid #E2E8F0", borderTop: "4px solid #5B4FFF", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }}></div>
            <p style={{ marginTop: "16px", color: "#64748B" }}>Loading your projects...</p>
          </div>
        ) : (
          <>
            {projects.length > 0 && (
              <>
                {/* Achievement Banner */}
                <div style={{ padding: "32px", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", borderRadius: "20px", marginBottom: "40px", color: "#FFFFFF", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.2)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <GraduationCap size={36} color="white" strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Achievement Unlocked</div>
                      <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>{projects.length} Major Project{projects.length > 1 ? 's' : ''} Completed</div>
                      <div style={{ fontSize: "14px", opacity: 0.9 }}>You are making real impact in your community!</div>
                    </div>
                  </div>
                </div>

                {/* Project History */}
                <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "32px", border: "2px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#0F172A" }}>Completed Projects</h2>
                    <button onClick={downloadPDF} style={{ padding: "12px 24px", background: "#1A1A1A", color: "#FFFFFF", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(26, 26, 26, 0.3)" }}>
                      <Download size={18} strokeWidth={2} />
                      Download PDF
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "20px" }}>
                    {projects.map(project => {
                      const IconComponent = SUBJECT_ICONS[project.subject] || SUBJECT_ICONS.Default;
                      const color = project.color || "#3B82F6";
                      return (
                        <div key={project.id} className="project-card" style={{ padding: "28px", border: "2px solid #E2E8F0", borderRadius: "16px", background: "#F8FAFC", position: "relative", overflow: "hidden" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <div style={{ display: "flex", gap: "20px", flex: 1 }}>
                              <div style={{ width: "56px", height: "56px", background: `${color}15`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <IconComponent size={32} color={color} strokeWidth={2} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0F172A", marginBottom: "8px" }}>{project.subject}</h3>
                                <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "12px" }}>{project.fileName || 'Major Project Submission'}</p>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#94A3B8" }}>
                                    <Clock size={14} strokeWidth={1.5} />
                                    {new Date(project.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div style={{ padding: "10px 20px", background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)", borderRadius: "10px", fontSize: "14px", fontWeight: "700", color: "#065F46", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}>
                              <CheckCircle size={16} strokeWidth={2.5} />
                              {project.status || 'Completed'}
                            </div>
                          </div>
                          <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: color, opacity: 0.05, borderRadius: "0 16px 0 100%" }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {projects.length === 0 && (
              <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "60px 32px", border: "2px solid #E2E8F0", textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", background: "#F8FAFC", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <GraduationCap size={40} color="#64748B" strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#0F172A", marginBottom: "8px" }}>No Major Projects Yet</h3>
                <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "8px" }}>Earn 100 tokens from minor projects to unlock major capstone opportunities!</p>
                <p style={{ fontSize: "13px", color: "#94A3B8" }}>Major projects are worth 100 tokens and fulfill your degree requirements.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
