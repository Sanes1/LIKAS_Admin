import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Download, Clock, Coins, Dna, FlaskConical, Globe, Calculator, Zap, ArrowLeft } from "lucide-react";
import { getStudentProjects, getStudentData } from "../services/firestoreService";

// Icon mapping for subjects
const SUBJECT_ICONS = {
  'Biology': Dna,
  'Chemistry': FlaskConical,
  'Earth & Space': Globe,
  'Mathematics': Calculator,
  'Physics': Zap,
  'General Mathematics': Calculator,
  'Default': BarChart3
};

export default function MinorProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const studentData = JSON.parse(localStorage.getItem("studentData") || "{}");
      
      if (studentData.uid) {
        const studentResult = await getStudentData(studentData.uid);
        if (studentResult.success) {
          setTotalTokens(studentResult.data.tokens || 0);
        }

        const projectsResult = await getStudentProjects(studentData.uid);
        if (projectsResult.success) {
          const minorProjects = projectsResult.projects.filter(p => p.tier === 'Minor');
          setProjects(minorProjects);
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
        .project-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px -4px rgba(0,0,0,0.1); }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Back Button */}
        <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#64748B", cursor: "pointer", marginBottom: "32px", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Home
        </button>

        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "700", color: "#0F172A", marginBottom: "12px", letterSpacing: "-0.02em" }}>Minor Projects</h1>
          <p style={{ fontSize: "16px", color: "#64748B", lineHeight: "1.6" }}>Complete minor projects to earn tokens and unlock major opportunities</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ width: "48px", height: "48px", border: "4px solid #E2E8F0", borderTop: "4px solid #5B4FFF", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }}></div>
            <p style={{ marginTop: "16px", color: "#64748B" }}>Loading your projects...</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              <div style={{ padding: "24px", background: "linear-gradient(135deg, #5B4FFF 0%, #4A3FD9 100%)", borderRadius: "16px", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(91, 79, 255, 0.3)" }}>
                <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Total Tokens Earned</div>
                <div style={{ fontSize: "36px", fontWeight: "700" }}>{totalTokens}</div>
              </div>
              <div style={{ padding: "24px", background: "#FFFFFF", borderRadius: "16px", border: "2px solid #E2E8F0" }}>
                <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "8px" }}>Projects Completed</div>
                <div style={{ fontSize: "36px", fontWeight: "700", color: "#0F172A" }}>{projects.length}</div>
              </div>
              <div style={{ padding: "24px", background: "#FFFFFF", borderRadius: "16px", border: "2px solid #E2E8F0" }}>
                <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "8px" }}>Progress to Major</div>
                <div style={{ fontSize: "36px", fontWeight: "700", color: "#0F172A" }}>{Math.min(totalTokens, 100)}%</div>
              </div>
            </div>

            {projects.length > 0 ? (
              <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "32px", border: "2px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#0F172A" }}>Completed Projects</h2>
                  <button onClick={downloadPDF} style={{ padding: "12px 24px", background: "#1A1A1A", color: "#FFFFFF", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(26, 26, 26, 0.3)" }}>
                    <Download size={18} strokeWidth={2} />
                    Download PDF
                  </button>
                </div>

                <div style={{ display: "grid", gap: "16px" }}>
                  {projects.map(project => {
                    const IconComponent = SUBJECT_ICONS[project.subject] || SUBJECT_ICONS.Default;
                    return (
                      <div key={project.id} className="project-card" style={{ padding: "24px", border: "2px solid #E2E8F0", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{ width: "48px", height: "48px", background: "#EFF6FF", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <IconComponent size={28} color="#5B4FFF" strokeWidth={2} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#0F172A", marginBottom: "6px" }}>{project.subject}</h3>
                            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "4px" }}>{project.fileName || 'Project Submission'}</p>
                            <p style={{ fontSize: "13px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Clock size={12} /> Completed: {new Date(project.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div style={{ padding: "10px 20px", background: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)", borderRadius: "10px", fontSize: "15px", fontWeight: "700", color: "#4A3FD9", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Coins size={18} strokeWidth={2.5} />
                          +{project.tokensEarned} Tokens
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "60px 32px", border: "2px solid #E2E8F0", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#0F172A", marginBottom: "8px" }}>No Projects Yet</h3>
                <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>Start submitting projects to earn tokens and build your portfolio!</p>
                <button onClick={() => window.location.href = '/submit'} style={{ padding: "12px 24px", background: "#1A1A1A", color: "#FFFFFF", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  Submit Your First Project
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
