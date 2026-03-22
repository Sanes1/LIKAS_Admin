import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import likasLogo from "../assets/likas-logo.png";

export default function LGUSidebar({ activePath }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "LGU Staff",
    barangay: "Barangay",
    city: "City",
    position: "Staff"
  });

  useEffect(() => {
    const userStr = localStorage.getItem("lguUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserData({
          name: user.name || "LGU Staff",
          barangay: user.barangay || "Barangay",
          city: user.city || "City",
          position: user.position || "Staff"
        });
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/lgu",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="8.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="1.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="8.5" y="8.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    label: "All Missions",
    path: "/lgu/missions",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 3.5h10M2 7h10M2 10.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Post a Need",
    path: "/lgu/post",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 4.5v5M4.5 7h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Competency Tagging",
    path: "/lgu/tagging",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 4h10M2 7h7M2 10h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Review Submissions",
    path: "/lgu/review",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 7l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    label: "Productivity Analytics",
    path: "/lgu/analytics",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="8" width="2.5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="5.75" y="5" width="2.5" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="9.5" y="2" width="2.5" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
];

  return (
    <aside style={{
      width: "256px",
      background: "#0F172A",
      padding: "36px 28px",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      overflowY: "auto",
      zIndex: 10,
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>

      {/* Brand */}
      <div style={{ marginBottom: "32px" }}>
        <img 
          src={likasLogo} 
          alt="LIKAS" 
          style={{ 
            height: "36px", 
            width: "auto",
            marginBottom: "8px"
          }} 
        />
        <p style={{
          fontSize: "9px", color: "#334155", letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          LGU Portal
        </p>
      </div>

      {/* Barangay identity card */}
      <div style={{
        padding: "14px 16px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid #1E293B",
        borderRadius: "8px",
        marginBottom: "28px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1L1 4.5V12h4V8.5h3V12h4V4.5L6.5 1z" stroke="#64748B" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#F8FAFC" }}>Barangay {userData.barangay}</span>
        </div>
        <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "2px" }}>{userData.city}</div>
        <div style={{ fontSize: "10px", color: "#64748B" }}>{userData.name}</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "6px",
                background: isActive ? "rgba(255,255,255,0.09)" : "transparent",
                border: "none", transition: "background 0.15s",
                textAlign: "left", width: "100%", cursor: "pointer",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ color: isActive ? "#F8FAFC" : "#94A3B8", display: "flex", flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: "12px",
                fontWeight: isActive ? "500" : "400",
                color: isActive ? "#F8FAFC" : "#94A3B8",
                flex: 1,
              }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#F8FAFC", flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("lguAuthenticated");
          localStorage.removeItem("lguUser");
          navigate("/lgu/login");
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 14px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid #1E293B",
          borderRadius: "6px",
          marginTop: "20px",
          cursor: "pointer",
          transition: "all 0.15s",
          width: "100%",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "#334155";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.borderColor = "#1E293B";
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#64748B", flexShrink: 0 }}>
          <path d="M5 13H2.5A1.5 1.5 0 011 11.5v-9A1.5 1.5 0 012.5 1H5M9.5 10l3-3-3-3M4.5 7h7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: "12px", fontWeight: "500", color: "#64748B", flex: 1 }}>
          Log Out
        </span>
      </button>
    </aside>
  );
}
