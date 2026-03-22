import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LGUSidebar from "../components/LGUsidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { listenToProjects, saveCompetencyTags, updateProject } from "../services/firebaseService";

const CONFIDENCE_COLOR = (c) =>
  c >= 85 ? "#2E7D32" : c >= 70 ? "#B45309" : "#C62828";

export default function CompetencyTagging() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedTag, setExpandedTag] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to all projects that need tagging approval
    const unsubscribe = listenToProjects(
      (projectsData) => {
        // Filter projects that have tags and need approval
        const projectsNeedingApproval = projectsData.filter(p => 
          p.tags && p.tags.length > 0 && (p.status === 'matching' || p.status === 'draft')
        );
        setProjects(projectsNeedingApproval);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading projects:", error);
        setProjects([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateTagStatus = async (projectId, tagIndex, newStatus) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedTags = project.tags.map((tag, idx) => 
      idx === tagIndex ? { ...tag, status: newStatus } : tag
    );

    try {
      await saveCompetencyTags(projectId, updatedTags);
      
      // Update local state
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId ? { ...p, tags: updatedTags } : p
        )
      );
    } catch (error) {
      console.error("Failed to update tag status:", error);
    }
  };

  const approveAllTags = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedTags = project.tags.map(tag => ({ ...tag, status: "approved" }));

    try {
      await saveCompetencyTags(projectId, updatedTags);
      await updateProject(projectId, { status: 'matching' });
      
      // Update local state
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId ? { ...p, tags: updatedTags, status: 'matching' } : p
        )
      );
    } catch (error) {
      console.error("Failed to approve all tags:", error);
    }
  };

  const getProjectStats = (project) => {
    const approved = project.tags.filter(t => t.status === "approved").length;
    const pending = project.tags.filter(t => t.status === "pending" || !t.status).length;
    const removed = project.tags.filter(t => t.status === "removed").length;
    return { approved, pending, removed, total: project.tags.length };
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Inter', sans-serif" }}>
        <LGUSidebar activePath="/lgu/tagging" />
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "1100px", width: "100%" }}>
            <LoadingSpinner message="Loading projects for tagging approval..." />
          </div>
        </main>
      </div>
    );
  }

  const pendingProjects = projects.filter(p => p.tags.some(t => t.status === "pending" || !t.status));
  const approvedProjects = projects.filter(p => p.tags.every(t => t.status === "approved"));

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input, textarea { font-family: inherit; cursor: pointer; }
        input:focus, textarea:focus { outline: none; }
        .btn-primary:hover  { background: #1E40AF !important; }
        .project-card:hover { border-color: #94A3B8 !important; }
        .tag-badge:hover    { opacity: 0.8 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0);    } }
        @keyframes slideIn    { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0);    } }
        @keyframes expandDown { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0);    } }
      `}</style>

      <LGUSidebar activePath="/lgu/tagging" />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1100px", width: "100%" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => navigate("/lgu")} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#64748B", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dashboard
              </button>
              <span style={{ color: "#CBD5E1", fontSize: "12px" }}>/</span>
              <span style={{ fontSize: "12px", color: "#1E293B", fontWeight: "500" }}>STEM Competency Tagging</span>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <NotificationBell />
              <span style={{ fontSize: "11px", color: "#B0AAA0", letterSpacing: "0.05em" }}>Screen 3 of 5</span>
            </div>
          </div>

          {/* Page heading */}
          <div style={{ marginBottom: "28px", animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>AI STEM Tagging Approval</p>
            <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display',Georgia,serif", fontWeight: "400", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "8px" }}>
              Review AI-generated competency tags
            </h1>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.75", maxWidth: "640px" }}>
              AI has analyzed your community projects and matched them to the DepEd K-12 STEM Curriculum. Review and approve tags for each mission before publishing to students.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px", animation: "fadeUp 0.3s 0.05s ease both" }}>
            {[
              { label: "Total Projects", value: projects.length, sub: "with AI tags" },
              { label: "Needs Review", value: pendingProjects.length, sub: "awaiting approval", cardBg: pendingProjects.length > 0 ? "#FFF8F0" : "#fff", cardBorder: pendingProjects.length > 0 ? "#FDE8C8" : "#E2E8F0", valueColor: pendingProjects.length > 0 ? "#B45309" : "#0F172A" },
              { label: "Approved", value: approvedProjects.length, sub: "ready for students", cardBg: "#EEFAF0", cardBorder: "#C6E8CE", valueColor: "#2E7D32" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.cardBg || "#fff", border: `1px solid ${s.cardBorder || "#E2E8F0"}`, borderRadius: "10px", padding: "20px" }}>
                <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "12px" }}>{s.label}</div>
                <div style={{ fontSize: "32px", fontFamily: "'DM Serif Display',Georgia,serif", color: s.valueColor || "#0F172A", lineHeight: "1", marginBottom: "5px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
              <p style={{ fontSize: "13px", color: "#64748B" }}>No projects with AI tags found. Post a need to get started.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {projects.map((project, idx) => {
                const stats = getProjectStats(project);
                const isExpanded = expandedProject === project.id;
                const allApproved = stats.pending === 0;

                return (
                  <div key={project.id} className="project-card" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s", animation: `slideIn 0.25s ${idx * 0.05}s ease both` }}>
                    
                    {/* Project Header */}
                    <div style={{ padding: "20px 24px", borderBottom: isExpanded ? "1px solid #F1F5F9" : "none", cursor: "pointer" }} onClick={() => setExpandedProject(isExpanded ? null : project.id)}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A" }}>{project.title}</h3>
                            {allApproved && (
                              <span style={{ fontSize: "9px", fontWeight: "600", color: "#2E7D32", background: "#EEFAF0", border: "1px solid #C6E8CE", padding: "2px 8px", borderRadius: "99px" }}>APPROVED</span>
                            )}
                          </div>
                          <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "12px" }}>{project.category} · {project.duration || "Duration not set"}</p>
                          
                          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                            <div style={{ fontSize: "11px", color: "#475569" }}>
                              <span style={{ fontWeight: "600", color: stats.approved > 0 ? "#2E7D32" : "#64748B" }}>{stats.approved}</span> Approved
                            </div>
                            <div style={{ fontSize: "11px", color: "#475569" }}>
                              <span style={{ fontWeight: "600", color: stats.pending > 0 ? "#B45309" : "#64748B" }}>{stats.pending}</span> Pending
                            </div>
                            <div style={{ fontSize: "11px", color: "#475569" }}>
                              <span style={{ fontWeight: "600" }}>{stats.total}</span> Total Tags
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                          {!allApproved && (
                            <button onClick={(e) => { e.stopPropagation(); approveAllTags(project.id); }} style={{ padding: "8px 16px", background: "#2563EB", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "500" }}>
                              Approve All
                            </button>
                          )}
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: "#94A3B8" }}>
                            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Tags List */}
                    {isExpanded && (
                      <div style={{ padding: "16px 24px", background: "#F8FAFC", animation: "expandDown 0.2s ease both" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {project.tags.map((tag, tagIdx) => {
                            const tagKey = `${project.id}-tag-${tagIdx}-${tag.competency || tag}`;
                            const isTagExpanded = expandedTag === tagKey;
                            const tagStatus = tag.status || "pending";
                            const statusColor = tagStatus === "approved" ? "#2E7D32" : tagStatus === "removed" ? "#94A3B8" : "#B45309";
                            const statusBg = tagStatus === "approved" ? "#EEFAF0" : tagStatus === "removed" ? "#F1F5F9" : "#FFF8F0";
                            const statusBorder = tagStatus === "approved" ? "#C6E8CE" : tagStatus === "removed" ? "#E2E8F0" : "#FDE8C8";

                            return (
                              <div key={tagKey} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setExpandedTag(isTagExpanded ? null : tagKey)}>
                                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: statusBg, border: `2px solid ${statusBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <span style={{ fontSize: "11px", fontWeight: "600", color: statusColor }}>{tag.confidence || "—"}</span>
                                  </div>
                                  
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "13px", fontWeight: "500", color: "#0F172A", marginBottom: "2px" }}>{tag.competency}</div>
                                    <div style={{ fontSize: "11px", color: "#64748B" }}>{tag.subject} · {tag.degree}</div>
                                  </div>

                                  <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                                    {tagStatus === "pending" && (
                                      <>
                                        <button onClick={(e) => { e.stopPropagation(); updateTagStatus(project.id, tagIdx, "approved"); }} className="tag-badge" style={{ padding: "6px 12px", background: "#2563EB", color: "#fff", border: "none", borderRadius: "5px", fontSize: "11px", fontWeight: "500" }}>
                                          Approve
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); updateTagStatus(project.id, tagIdx, "removed"); }} className="tag-badge" style={{ padding: "6px 12px", background: "#fff", border: "1px solid #CBD5E1", color: "#64748B", borderRadius: "5px", fontSize: "11px", fontWeight: "500" }}>
                                          Remove
                                        </button>
                                      </>
                                    )}
                                    {tagStatus === "approved" && (
                                      <span style={{ fontSize: "10px", fontWeight: "500", color: statusColor, background: statusBg, border: `1px solid ${statusBorder}`, padding: "4px 10px", borderRadius: "99px" }}>Approved</span>
                                    )}
                                    {tagStatus === "removed" && (
                                      <button onClick={(e) => { e.stopPropagation(); updateTagStatus(project.id, tagIdx, "pending"); }} className="tag-badge" style={{ padding: "6px 12px", background: "#fff", border: "1px solid #CBD5E1", color: "#64748B", borderRadius: "5px", fontSize: "11px", fontWeight: "500" }}>
                                        Restore
                                      </button>
                                    )}
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isTagExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: "#94A3B8" }}>
                                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>

                                {isTagExpanded && (
                                  <div style={{ padding: "14px 16px", borderTop: "1px solid #F1F5F9", background: "#F8FAFC", animation: "expandDown 0.15s ease both" }}>
                                    <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "6px" }}>AI Rationale</div>
                                    <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.7" }}>{tag.rationale}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
