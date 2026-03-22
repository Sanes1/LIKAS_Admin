import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LGUSidebar from "../components/LGUsidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { listenToProjects, deleteProject } from "../services/firebaseService";

const PROJECTS = [
  {
    id: "pr1",
    title: "Barangay Dengue Hotspot Mapping and Water Testing",
    category: "Public Health & Science",
    status: "active",
    statusLabel: "Student Working",
    postedDate: "Jan 15, 2026",
    deadline: "Mar 15, 2026",
    student: "Juan dela Cruz",
    studentDegree: "SHS STEM Strand",
    progress: 68,
    tags: ["Biology", "Chemistry", "Data Analysis"],
    urgent: false,
  },
  {
    id: "pr2",
    title: "Solar-Powered Street Lighting Prototype",
    category: "Environment & Technology",
    status: "matching",
    statusLabel: "Awaiting Student",
    postedDate: "Feb 1, 2026",
    deadline: "Apr 30, 2026",
    student: null,
    studentDegree: null,
    progress: 0,
    tags: ["Physics", "Earth and Space Science", "Prototyping"],
    urgent: true,
  },
  {
    id: "pr3",
    title: "Solid Waste Volume Analysis and Routing",
    category: "Research & Mathematics",
    status: "completed",
    statusLabel: "Completed",
    postedDate: "Nov 10, 2025",
    deadline: "Jan 20, 2026",
    student: "Ana Bautista",
    studentDegree: "SHS STEM Strand",
    progress: 100,
    tags: ["Finite Mathematics", "Data Collection", "Statistics"],
    urgent: false,
  },
  {
    id: "pr4",
    title: "Soil pH Testing for Urban Community Garden",
    category: "Agriculture & Science",
    status: "completed",
    statusLabel: "Completed",
    postedDate: "Oct 5, 2025",
    deadline: "Dec 10, 2025",
    student: "Maria Reyes",
    studentDegree: "SHS STEM Strand",
    progress: 100,
    tags: ["Chemistry", "Earth Science", "Observation"],
    urgent: false,
  },
  {
    id: "pr5",
    title: "Flood Risk Assessment & Rainfall Data Tracking",
    category: "Research & Data",
    status: "draft",
    statusLabel: "Draft",
    postedDate: "Feb 20, 2026",
    deadline: null,
    student: null,
    studentDegree: null,
    progress: 0,
    tags: [],
    urgent: false,
  },
];

const STATUS_STYLES = {
  active:    { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE", dot: "#1E40AF" },
  matching:  { bg: "#FFF8F0", text: "#B45309", border: "#FDE8C8", dot: "#B45309" },
  completed: { bg: "#EEFAF0", text: "#2E7D32", border: "#C6E8CE", dot: "#2E7D32" },
  draft:     { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0", dot: "#94A3B8" },
};

function ProgressBar({ value }) {
  const color = value === 100 ? "#2E7D32" : value >= 50 ? "#1E40AF" : "#B45309";
  return (
    <div style={{ height: "4px", background: "#E2E8F0", borderRadius: "99px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: "99px", transition: "width 0.6s ease" }} />
    </div>
  );
}

export default function LGUDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    // Listen to Firebase for real-time project updates
    const unsubscribe = listenToProjects(
      (projectsData) => {
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to projects:", error);
        setProjects([]);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const filtered = projects
    .filter(p => filter === "all" || p.status === filter)
    .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filtered.slice(startIndex, startIndex + itemsPerPage);

  const activeCount    = projects.filter(p => p.status === "active").length;
  const matchingCount  = projects.filter(p => p.status === "matching").length;
  const completedCount = projects.filter(p => p.status === "completed").length;
  const draftCount     = projects.filter(p => p.status === "draft").length;

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const handleDelete = async (projectId, projectTitle) => {
    try {
      await deleteProject(projectId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input { font-family: inherit; cursor: pointer; }
        input:focus { outline: none; }
        .btn-primary:hover  { background: #1E40AF !important; }
        .row-hover:hover    { background: #F1F5F9 !important; cursor: pointer; }
        .filter-chip:hover  { border-color: #2563EB !important; color: #2563EB !important; }
        .quick-card:hover   { opacity: 0.88 !important; }
        .delete-btn:hover   { background: #DC2626 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0);  } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0);  } }
        @keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
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
              <button className="delete-btn" onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.title)} style={{ padding: "10px 18px", background: "#EF4444", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s" }}>
                Delete Mission
              </button>
            </div>
          </div>
        </div>
      )}

      <LGUSidebar activePath="/lgu" />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 72px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1200px", width: "100%" }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px", animation: "fadeUp 0.3s ease both" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>LGU Dashboard</p>
              <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "6px" }}>
                Good morning, Hon. Ricardo Santos.
              </h1>
              <p style={{ fontSize: "13px", color: "#64748B" }}>
                {projects.length} community projects · Barangay San Roque, Marikina City
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <NotificationBell />
              <button className="btn-primary" onClick={() => navigate("/lgu/post")}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "11px 20px", background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", transition: "background 0.2s", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5v5M3.5 6h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Post a Need
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Total Projects", value: projects.length, sub: "all time" },
              { label: "Active",          value: activeCount,    sub: "student working",  cardBg: "#EFF6FF", cardBorder: "#BFDBFE", valueColor: "#1E40AF" },
              { label: "Awaiting Match",  value: matchingCount,  sub: "needs a student",  cardBg: "#FFF8F0", cardBorder: "#FDE8C8", valueColor: "#B45309" },
              { label: "Completed",       value: completedCount, sub: "with certificate", cardBg: "#EEFAF0", cardBorder: "#C6E8CE", valueColor: "#2E7D32" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.cardBg || "#fff", border: `1px solid ${s.cardBorder || "#E2E8F0"}`, borderRadius: "10px", padding: "20px", animation: `fadeUp 0.3s ${0.05 + i * 0.05}s ease both` }}>
                <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "14px" }}>{s.label}</div>
                <div style={{ fontSize: "32px", fontFamily: "'DM Serif Display', Georgia, serif", color: s.valueColor || "#0F172A", lineHeight: "1", marginBottom: "5px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Urgent banner */}
          {projects.some(p => p.urgency === "high") && (
            <div style={{ padding: "13px 16px", background: "#FFF8F0", border: "1px solid #FDE8C8", borderRadius: "6px", display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px", animation: "fadeUp 0.3s 0.2s ease both" }}>
              <svg style={{ flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#B45309" strokeWidth="1.2"/><path d="M7 4.5v3.5M7 9.5v.5" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <p style={{ fontSize: "12px", color: "#92400E", lineHeight: "1.7", margin: 0 }}>
                <strong style={{ fontWeight: "600" }}>{projects.filter(p => p.urgency === "high").length} project(s)</strong> marked as high urgency. Consider prioritizing these for student matching.
              </p>
              <button onClick={() => navigate("/lgu/tagging")}
                style={{ marginLeft: "auto", flexShrink: 0, padding: "6px 12px", background: "#B45309", color: "#fff", border: "none", borderRadius: "5px", fontSize: "11px", fontWeight: "500", cursor: "pointer" }}>
                Review Tags
              </button>
            </div>
          )}

          {/* Project table */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden", animation: "fadeUp 0.3s 0.15s ease both" }}>

            {/* Toolbar */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { val: "all",       label: "All",            count: projects.length },
                  { val: "active",    label: "Active",         count: activeCount },
                  { val: "matching",  label: "Awaiting Match", count: matchingCount },
                  { val: "completed", label: "Completed",      count: completedCount },
                  { val: "draft",     label: "Drafts",         count: draftCount },
                ].map(f => (
                  <button key={f.val} className="filter-chip" onClick={() => setFilter(f.val)}
                    style={{ padding: "5px 12px", border: `1px solid ${filter === f.val ? "#2563EB" : "#CBD5E1"}`, borderRadius: "99px", background: filter === f.val ? "#2563EB" : "#fff", color: filter === f.val ? "#FFFFFF" : "#475569", fontSize: "11px", fontWeight: filter === f.val ? "500" : "400", transition: "all 0.15s" }}>
                    {f.label} <span style={{ opacity: 0.55, marginLeft: "3px" }}>{f.count}</span>
                  </button>
                ))}
              </div>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="#94A3B8" strokeWidth="1.2"/><path d="M8 8l2.5 2.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project…"
                  style={{ padding: "7px 12px 7px 28px", background: "#fff", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "12px", color: "#0F172A", width: "200px" }} />
              </div>
            </div>

            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.3fr 100px 160px 120px 110px 150px 50px", padding: "12px 24px", borderBottom: "1px solid #F1F5F9", gap: "12px" }}>
              {["Project", "Posted By", "Progress", "Student", "Duration", "Urgency", "Status", ""].map(h => (
                <span key={h} style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {loading ? (
              <LoadingSpinner message="Loading projects from database..." />
            ) : filtered.length === 0 ? (
              <div style={{ padding: "52px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "#64748B" }}>No projects match this filter.</div>
              </div>
            ) : (
              paginatedProjects.map((p, i) => {
              const ss = STATUS_STYLES[p.status];
              const progressColor = p.progress === 100 ? "#2E7D32" : p.progress >= 50 ? "#1E40AF" : "#B45309";
              const destination = p.status === "draft" ? "/lgu/post" : "/lgu/tagging";
              return (
                <div key={p.id} className="row-hover"
                  style={{ display: "grid", gridTemplateColumns: "2.5fr 1.3fr 100px 160px 120px 110px 150px 50px", padding: "18px 24px", borderBottom: i < paginatedProjects.length - 1 ? "1px solid #F1F5F9" : "none", alignItems: "center", gap: "12px", transition: "background 0.12s" }}>

                  <div onClick={() => navigate(destination)} style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
                      {p.urgent && (
                        <span style={{ fontSize: "9px", fontWeight: "600", color: "#B45309", background: "#FFF8F0", border: "1px solid #FDE8C8", padding: "1px 6px", borderRadius: "99px", animation: "pulse 1.5s infinite" }}>URGENT</span>
                      )}
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#0F172A" }}>{p.title}</span>
                    </div>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {p.tags && Array.isArray(p.tags) && p.tags.slice(0, 2).map((tag, idx) => {
                        const tagText = typeof tag === 'string' ? tag : (tag?.competency || tag?.name || 'Tag');
                        return (
                          <span key={`${p.id}-tag-${idx}-${tagText}`} style={{ fontSize: "10px", color: "#475569", background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "1px 7px", borderRadius: "99px" }}>
                            {tagText}
                          </span>
                        );
                      })}
                      {p.tags && Array.isArray(p.tags) && p.tags.length > 2  && <span style={{ fontSize: "10px", color: "#94A3B8" }}>+{p.tags.length - 2}</span>}
                      {(!p.tags || !Array.isArray(p.tags) || p.tags.length === 0) && <span style={{ fontSize: "10px", color: "#94A3B8", fontStyle: "italic" }}>No tags yet</span>}
                    </div>
                  </div>

                  <div onClick={() => navigate(destination)} style={{ cursor: "pointer" }}>
                    {p.postedBy ? (
                      <>
                        <div style={{ fontSize: "11px", fontWeight: "500", color: "#0F172A" }}>{p.postedBy.name}</div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>Brgy. {p.postedBy.barangay}</div>
                      </>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#94A3B8", fontStyle: "italic" }}>Unknown</span>
                    )}
                  </div>

                  <div onClick={() => navigate(destination)} style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: "11px", fontWeight: "500", color: progressColor, marginBottom: "4px" }}>{p.progress}%</div>
                    <ProgressBar value={p.progress} />
                  </div>

                  <div onClick={() => navigate(destination)} style={{ cursor: "pointer" }}>
                    {p.student ? (
                      <>
                        <div style={{ fontSize: "12px", fontWeight: "500", color: "#0F172A" }}>
                          {typeof p.student === 'string' ? p.student : p.student.name}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>
                          {p.studentDegree || (typeof p.student === 'object' ? p.student.degree : '')}
                        </div>
                      </>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#94A3B8", fontStyle: "italic" }}>
                        {p.status === "draft" ? "Not posted" : "No match yet"}
                      </span>
                    )}
                  </div>

                  <span onClick={() => navigate(destination)} style={{ fontSize: "11px", color: p.duration ? "#475569" : "#94A3B8", cursor: "pointer" }}>
                    {p.duration || "—"}
                  </span>

                  <span onClick={() => navigate(destination)} style={{ fontSize: "10px", fontWeight: "500", color: p.urgency === "high" ? "#B45309" : p.urgency === "medium" ? "#1E40AF" : "#64748B", background: p.urgency === "high" ? "#FFF8F0" : p.urgency === "medium" ? "#EFF6FF" : "#F1F5F9", border: `1px solid ${p.urgency === "high" ? "#FDE8C8" : p.urgency === "medium" ? "#BFDBFE" : "#E2E8F0"}`, padding: "3px 9px", borderRadius: "99px", display: "inline-flex", alignItems: "center", justifyContent: "center", textTransform: "capitalize", cursor: "pointer" }}>
                    {p.urgency || "Low"}
                  </span>

                  <div onClick={() => navigate(destination)} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <div style={{ flex: 1, height: "6px", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ 
                        width: p.status === "completed" ? "100%" : p.status === "active" ? "60%" : p.status === "matching" ? "30%" : "10%",
                        height: "100%", 
                        background: ss.dot,
                        borderRadius: "99px",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: "600", color: ss.text, whiteSpace: "nowrap", minWidth: "35px", textAlign: "right" }}>
                      {p.status === "completed" ? "100%" : p.status === "active" ? "60%" : p.status === "matching" ? "30%" : "10%"}
                    </span>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: p.id, title: p.title }); }}
                    style={{ width: "32px", height: "32px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.borderColor = "#FECACA"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#FEE2E2"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3.5h10M5.5 3.5v-1a1 1 0 011-1h1a1 1 0 011 1v1M11 3.5v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              );
            })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: "8px 12px", background: currentPage === 1 ? "#F1F5F9" : "#fff", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "12px", color: currentPage === 1 ? "#94A3B8" : "#475569", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontWeight: "500" }}>
                Previous
              </button>
              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{ width: "36px", height: "36px", background: currentPage === page ? "#2563EB" : "#fff", border: `1px solid ${currentPage === page ? "#2563EB" : "#E2E8F0"}`, borderRadius: "6px", fontSize: "12px", color: currentPage === page ? "#fff" : "#475569", cursor: "pointer", fontWeight: currentPage === page ? "600" : "400" }}>
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: "8px 12px", background: currentPage === totalPages ? "#F1F5F9" : "#fff", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "12px", color: currentPage === totalPages ? "#94A3B8" : "#475569", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontWeight: "500" }}>
                Next
              </button>
            </div>
          )}

          {/* Quick-action cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginTop: "16px" }}>
            {[
              {
                title: "Post a new community need",
                desc: "Describe a real problem your barangay faces. AI will match it with the right students and academic competencies.",
                cta: "Post Now",
                path: "/lgu/post",
                dark: true,
              },
            ].map((card, i) => (
              <div key={i} className="quick-card" onClick={() => navigate(card.path)}
                style={{ padding: "20px 22px", background: card.dark ? "#0F172A" : "#fff", border: `1px solid ${card.dark ? "transparent" : "#E2E8F0"}`, borderRadius: "10px", cursor: "pointer", transition: "opacity 0.18s", animation: `fadeUp 0.3s ${0.25 + i * 0.05}s ease both` }}>
                <div style={{ fontSize: "14px", fontFamily: "'DM Serif Display', Georgia, serif", color: card.dark ? "#F8FAFC" : "#0F172A", marginBottom: "6px" }}>{card.title}</div>
                <div style={{ fontSize: "12px", color: card.dark ? "#94A3B8" : "#64748B", lineHeight: "1.65", marginBottom: "14px" }}>{card.desc}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: card.dark ? "#F8FAFC" : "#0F172A" }}>
                  {card.cta}
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2.5 5.5h6M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "14px", textAlign: "right" }}>
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>Click any project row to continue its workflow →</span>
          </div>

        </div>
      </main>
    </div>
  );
}