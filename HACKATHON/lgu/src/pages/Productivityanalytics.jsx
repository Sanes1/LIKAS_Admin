import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LGUSidebar from "../components/LGUsidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { listenToProjects } from "../services/firebaseService";

export default function ProductivityAnalytics() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToProjects(
      (projectsData) => {
        setProjects(projectsData);
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

  // Calculate analytics
  const totalMissions = projects.length;
  const completedMissions = projects.filter(p => p.status === "completed").length;
  const activeMissions = projects.filter(p => p.status === "active").length;
  const expiredMissions = projects.filter(p => p.status === "expired" || p.status === "cancelled").length;
  
  const completionRate = totalMissions > 0 ? ((completedMissions / totalMissions) * 100).toFixed(1) : 0;

  // Calculate total labor hours (estimate based on duration and completed projects)
  const totalLaborHours = projects.reduce((sum, p) => {
    if (p.status === "completed" && p.duration) {
      // Parse duration string (e.g., "3 months", "2 weeks")
      const match = p.duration.match(/(\d+)\s*(month|week|day)/i);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        let hours = 0;
        
        if (unit.includes("month")) hours = value * 160; // ~160 hours per month
        else if (unit.includes("week")) hours = value * 40; // ~40 hours per week
        else if (unit.includes("day")) hours = value * 8; // ~8 hours per day
        
        return sum + hours;
      }
    }
    return sum;
  }, 0);

  // Extract schools from student data and count contributions
  const schoolStats = {};
  projects.forEach(p => {
    if (p.assignedStudent && p.assignedStudent.school) {
      const school = p.assignedStudent.school;
      if (!schoolStats[school]) {
        schoolStats[school] = {
          name: school,
          activeProjects: 0,
          completedProjects: 0,
          totalProjects: 0,
          students: new Set(),
        };
      }
      
      schoolStats[school].totalProjects++;
      if (p.status === "completed") schoolStats[school].completedProjects++;
      if (p.status === "active") schoolStats[school].activeProjects++;
      if (p.assignedStudent.name) schoolStats[school].students.add(p.assignedStudent.name);
    }
  });

  const topSchools = Object.values(schoolStats)
    .map(s => ({ ...s, studentCount: s.students.size }))
    .sort((a, b) => b.totalProjects - a.totalProjects)
    .slice(0, 10);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <LGUSidebar activePath="/lgu/analytics" />
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "1200px", width: "100%" }}>
            <LoadingSpinner message="Loading analytics data..." />
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
        button { font-family: inherit; cursor: pointer; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
        .school-row:hover { background: #F1F5F9 !important; }
      `}</style>

      <LGUSidebar activePath="/lgu/analytics" />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1200px", width: "100%" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px", animation: "fadeUp 0.3s ease both" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Productivity Analytics</p>
              <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "6px" }}>
                Community Impact Dashboard
              </h1>
              <p style={{ fontSize: "13px", color: "#64748B" }}>
                Measuring the value of student contributions to barangay projects
              </p>
            </div>
            <NotificationBell />
          </div>

          {/* Key Metrics Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            
            {/* Mission Completion Rate */}
            <div className="stat-card" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", transition: "all 0.2s", animation: "fadeUp 0.3s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", background: "#EFF6FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.5 5.5L7.5 14.5L3.5 10.5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "500" }}>Completion Rate</p>
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "36px", fontWeight: "700", color: "#0F172A", letterSpacing: "-1px" }}>{completionRate}%</span>
              </div>
              <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#64748B", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                <span>✓ {completedMissions} completed</span>
                <span>⏱ {activeMissions} active</span>
              </div>
            </div>

            {/* Total Labor Hours */}
            <div className="stat-card" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", transition: "all 0.2s", animation: "fadeUp 0.3s 0.05s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", background: "#FFF8F0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="#F59E0B" strokeWidth="1.5"/>
                    <path d="M10 6v4l3 2" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "500" }}>Labor Hours Generated</p>
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "36px", fontWeight: "700", color: "#0F172A", letterSpacing: "-1px" }}>{totalLaborHours.toLocaleString()}</span>
                <span style={{ fontSize: "16px", color: "#64748B", marginLeft: "6px" }}>hrs</span>
              </div>
              <div style={{ fontSize: "12px", color: "#64748B", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                Free youth labor contributed to community
              </div>
            </div>

            {/* Total Missions */}
            <div className="stat-card" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", transition: "all 0.2s", animation: "fadeUp 0.3s 0.1s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", background: "#F0FDF4", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="3" width="14" height="14" rx="2" stroke="#16A34A" strokeWidth="1.5"/>
                    <path d="M3 8h14M8 3v14" stroke="#16A34A" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "500" }}>Total Missions</p>
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "36px", fontWeight: "700", color: "#0F172A", letterSpacing: "-1px" }}>{totalMissions}</span>
              </div>
              <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#64748B", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                <span>📋 {projects.filter(p => p.status === "matching").length} matching</span>
                {expiredMissions > 0 && <span>⚠ {expiredMissions} expired</span>}
              </div>
            </div>

          </div>

          {/* Top Contributing Schools */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "28px", animation: "fadeUp 0.3s 0.15s ease both" }}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0F172A", marginBottom: "6px" }}>Top Contributing Schools</h2>
              <p style={{ fontSize: "13px", color: "#64748B" }}>
                Leaderboard of schools producing the most active student volunteers
              </p>
            </div>

            {topSchools.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#94A3B8" }}>No school data available yet. Assign students to projects to see contributions.</p>
              </div>
            ) : (
              <div>
                {/* Table Header */}
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 120px 120px", gap: "12px", padding: "12px 16px", background: "#F8FAFC", borderRadius: "8px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Rank</div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>School Name</div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Students</div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Projects</div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Completed</div>
                </div>

                {/* Table Rows */}
                {topSchools.map((school, idx) => (
                  <div 
                    key={school.name} 
                    className="school-row"
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "60px 1fr 120px 120px 120px", 
                      gap: "12px", 
                      padding: "16px", 
                      borderBottom: idx < topSchools.length - 1 ? "1px solid #F1F5F9" : "none",
                      transition: "background 0.15s",
                      animation: `slideIn 0.25s ${idx * 0.05}s ease both`
                    }}
                  >
                    {/* Rank */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {idx === 0 && <span style={{ fontSize: "20px" }}>🥇</span>}
                      {idx === 1 && <span style={{ fontSize: "20px" }}>🥈</span>}
                      {idx === 2 && <span style={{ fontSize: "20px" }}>🥉</span>}
                      {idx > 2 && <span style={{ fontSize: "14px", fontWeight: "600", color: "#94A3B8" }}>#{idx + 1}</span>}
                    </div>

                    {/* School Name */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "#0F172A" }}>{school.name}</span>
                    </div>

                    {/* Students */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#2563EB" }}>{school.studentCount}</span>
                    </div>

                    {/* Total Projects */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "#475569" }}>{school.totalProjects}</span>
                    </div>

                    {/* Completed */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#16A34A" }}>{school.completedProjects}</span>
                      {school.totalProjects > 0 && (
                        <span style={{ fontSize: "11px", color: "#64748B" }}>
                          ({Math.round((school.completedProjects / school.totalProjects) * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
