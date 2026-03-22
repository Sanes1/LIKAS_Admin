import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LGUSidebar from "../components/LGUsidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { listenToProjects, deleteProject } from "../services/firebaseService";

const ITEMS_PER_PAGE = 5;

const STATUS_STYLES = {
  active:    { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE", label: "Active" },
  matching:  { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8", label: "Awaiting Match" },
  completed: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE", label: "Completed" },
  draft:     { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0", label: "Draft" },
};

export default function AllMissions() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToProjects(
      (projectsData) => {
        // Sort by creation date (newest first)
        const sorted = projectsData.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        setProjects(sorted);
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

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = !searchQuery || 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <LGUSidebar activePath="/lgu/missions" />
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "1200px", width: "100%" }}>
            <LoadingSpinner message="Loading all missions..." />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input { font-family: inherit; cursor: pointer; }
        input:focus { outline: none; border-color: #2563EB !important; }
        .mission-card:hover { border-color: #94A3B8 !important; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .filter-btn:hover { border-color: #2563EB !important; }
        .page-btn:hover:not(:disabled) { background: #2563EB !important; color: #fff !important; }
        .delete-btn-small:hover { background: #DC2626 !important; border-color: #DC2626 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ background: "#fff", borderRadius: "12px", maxWidth: "420px", width: "100%", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0F172A", marginBottom: "8px" }}>Delete Mission?</h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", marginBottom: "20px" }}>
              Are you sure you want to delete "<strong>{deleteConfirm.title}</strong>"? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: "10px 18px", background: "#fff", border: "1px solid #CBD5E1", color: "#475569", borderRadius: "6px", fontSize: "13px", fontWeight: "500" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{ padding: "10px 18px", background: "#EF4444", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s" }}>
                Delete Mission
              </button>
            </div>
          </div>
        </div>
      )}

      <LGUSidebar activePath="/lgu/missions" />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1200px", width: "100%" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px", animation: "fadeUp 0.3s ease both" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>All Missions</p>
              <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "6px" }}>
                Community Projects Directory
              </h1>
              <p style={{ fontSize: "13px", color: "#64748B" }}>
                {filteredProjects.length} mission{filteredProjects.length !== 1 ? 's' : ''} · Sorted by most recent
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <NotificationBell />
              <button onClick={() => navigate("/lgu/post")} style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "11px 20px", background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5v5M3.5 6h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Post New Mission
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", animation: "fadeUp 0.3s 0.05s ease both" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
              <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="#94A3B8" strokeWidth="1.2"/><path d="M9 9l3 3" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Search missions by title or category..."
                style={{ width: "100%", padding: "10px 14px 10px 36px", background: "#fff", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "13px", color: "#0F172A" }} 
              />
            </div>
            
            <div style={{ display: "flex", gap: "6px" }}>
              {[
                { val: "all", label: "All", count: projects.length },
                { val: "active", label: "Active", count: projects.filter(p => p.status === "active").length },
                { val: "matching", label: "Matching", count: projects.filter(p => p.status === "matching").length },
                { val: "completed", label: "Completed", count: projects.filter(p => p.status === "completed").length },
                { val: "draft", label: "Drafts", count: projects.filter(p => p.status === "draft").length },
              ].map(f => (
                <button 
                  key={f.val} 
                  className="filter-btn" 
                  onClick={() => setFilterStatus(f.val)}
                  style={{ padding: "10px 16px", border: `1px solid ${filterStatus === f.val ? "#2563EB" : "#CBD5E1"}`, borderRadius: "8px", background: filterStatus === f.val ? "#2563EB" : "#fff", color: filterStatus === f.val ? "#FFFFFF" : "#475569", fontSize: "12px", fontWeight: filterStatus === f.val ? "500" : "400", transition: "all 0.15s" }}
                >
                  {f.label} <span style={{ opacity: 0.6, marginLeft: "4px" }}>({f.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Missions Grid */}
          {currentProjects.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
              <p style={{ fontSize: "13px", color: "#64748B" }}>No missions found matching your filters.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                {currentProjects.map((project, idx) => {
                  const ss = STATUS_STYLES[project.status] || STATUS_STYLES.draft;
                  const isNew = idx === 0 && currentPage === 1;

                  return (
                    <div 
                      key={project.id} 
                      className="mission-card"
                      style={{ 
                        background: "#fff", 
                        border: isNew ? "2px solid #2563EB" : "1px solid #E2E8F0", 
                        borderRadius: "10px", 
                        padding: "20px", 
                        cursor: "pointer", 
                        transition: "all 0.2s",
                        animation: `slideIn 0.25s ${idx * 0.05}s ease both`,
                        position: "relative"
                      }}
                    >
                      {isNew && (
                        <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "9px", fontWeight: "600", color: "#2563EB", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "3px 8px", borderRadius: "99px" }}>
                          LATEST
                        </div>
                      )}

                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: project.id, title: project.title }); }}
                        className="delete-btn-small"
                        style={{ position: "absolute", top: "12px", right: isNew ? "80px" : "12px", width: "28px", height: "28px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1.5 3h9M4.5 3v-.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75V3M9.5 3v6a.75.75 0 01-.75.75h-5.5A.75.75 0 012.5 9V3" stroke="#DC2626" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      <div onClick={() => navigate(`/lgu/tagging`, { state: { projectId: project.id } })} style={{ marginBottom: "12px" }}>
                        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginBottom: "6px", lineHeight: "1.4" }}>{project.title}</h3>
                        <p style={{ fontSize: "12px", color: "#64748B" }}>{project.category}</p>
                      </div>

                      <p onClick={() => navigate(`/lgu/tagging`, { state: { projectId: project.id } })} style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {project.description}
                      </p>

                      <div onClick={() => navigate(`/lgu/tagging`, { state: { projectId: project.id } })} style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                        {project.tags && project.tags.slice(0, 3).map((tag, tidx) => {
                          const tagText = typeof tag === 'string' ? tag : tag.competency;
                          return (
                            <span key={`${project.id}-tag-${tidx}-${tagText}`} style={{ fontSize: "10px", color: "#475569", background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "2px 8px", borderRadius: "99px" }}>
                              {tagText}
                            </span>
                          );
                        })}
                        {project.tags && project.tags.length > 3 && (
                          <span style={{ fontSize: "10px", color: "#94A3B8" }}>+{project.tags.length - 3}</span>
                        )}
                      </div>

                      <div onClick={() => navigate(`/lgu/tagging`, { state: { projectId: project.id } })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                        <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#64748B" }}>
                          <span>⏱ {project.duration || "—"}</span>
                          <span style={{ textTransform: "capitalize" }}>🔥 {project.urgency || "low"}</span>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: "500", color: ss.text, background: ss.bg, border: `1px solid ${ss.border}`, padding: "3px 10px", borderRadius: "99px" }}>
                          {ss.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <button 
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ padding: "8px 12px", background: "#fff", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "12px", color: "#475569", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, transition: "all 0.15s" }}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className="page-btn"
                      onClick={() => setCurrentPage(page)}
                      style={{ padding: "8px 12px", background: currentPage === page ? "#2563EB" : "#fff", border: `1px solid ${currentPage === page ? "#2563EB" : "#CBD5E1"}`, borderRadius: "6px", fontSize: "12px", color: currentPage === page ? "#fff" : "#475569", fontWeight: currentPage === page ? "600" : "400", minWidth: "36px", transition: "all 0.15s" }}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ padding: "8px 12px", background: "#fff", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "12px", color: "#475569", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, transition: "all 0.15s" }}
                  >
                    Next
                  </button>
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <p style={{ fontSize: "11px", color: "#94A3B8" }}>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} missions
                </p>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
