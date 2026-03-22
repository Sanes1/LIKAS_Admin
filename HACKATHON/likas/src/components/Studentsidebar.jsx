import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Eligibility Check",      path: "/onboarding" },
  { label: "Upload Evidence",        path: "/upload"     },
  { label: "Competency Map",         path: "/mapping"    },
  { label: "Study Scheduler",        path: "/scheduler"  },
  { label: "Barangay Mission",       path: "/barangay"   },
];

/**
 * StudentSidebar
 * Props:
 *   activePath — current route string, e.g. "/mapping"
 */
export default function StudentSidebar({ activePath }) {
  const navigate = useNavigate();

  return (
    <aside style={{
      width: "280px", background: "#1A1814",
      padding: "44px 32px", display: "flex", flexDirection: "column",
      flexShrink: 0, position: "fixed", top: 0, left: 0,
      height: "100vh", overflowY: "auto",
      fontFamily: "'Inter','Helvetica Neue',Helvetica,sans-serif",
      zIndex: 10,
    }}>

      {/* ── Brand ── */}
      <div style={{ marginBottom: "52px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "26px", height: "26px", background: "#F7F6F3", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="1"   y="1"   width="5"   height="5"   fill="#1A1814" />
                <rect x="7.5" y="1"   width="4.5" height="4.5" fill="#1A1814" />
                <rect x="1"   y="7.5" width="4.5" height="4.5" fill="#1A1814" />
                <rect x="7.5" y="7.5" width="4.5" height="4.5" fill="#1A1814" opacity="0.3" />
              </svg>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#F7F6F3", letterSpacing: "0.04em" }}>SKILLSET</span>
          </div>

          {/* Home button */}
          <button
            onClick={() => navigate("/")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              background: "rgba(247,246,243,0.06)", border: "1px solid #2E2B27",
              borderRadius: "5px", padding: "5px 9px", color: "#6E685F",
              fontSize: "10px", fontWeight: "500", cursor: "pointer",
              letterSpacing: "0.04em", transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(247,246,243,0.1)"; e.currentTarget.style.color = "#F7F6F3"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(247,246,243,0.06)"; e.currentTarget.style.color = "#6E685F"; }}
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1 4.5L4.5 1 8 4.5M2 4v4h2V6h1v2h2V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Home
          </button>
        </div>
        <p style={{ fontSize: "10px", color: "#3A3631", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: "36px" }}>Student Journey</p>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {NAV_ITEMS.map((item, i) => {
            const activeIndex  = NAV_ITEMS.findIndex(n => n.path === activePath);
            const isActive = item.path === activePath;
            const isDone   = i < activeIndex;

            return (
              <div key={item.path}>
                <div
                  onClick={() => isDone && navigate(item.path)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "14px",
                    padding: "10px 14px", borderRadius: "6px",
                    background: isActive ? "rgba(247,246,243,0.06)" : "transparent",
                    cursor: isDone ? "pointer" : "default",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (isDone) e.currentTarget.style.background = "rgba(247,246,243,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isActive ? "rgba(247,246,243,0.06)" : "transparent"; }}
                >
                  {/* Step indicator */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      border: `1.5px solid ${isDone ? "#F7F6F3" : isActive ? "#F7F6F3" : "#2E2B27"}`,
                      background: isDone ? "#F7F6F3" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.25s", marginTop: "1px",
                    }}>
                      {isDone
                        ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5l2 2L7.5 3.5" stroke="#1A1814" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        : <span style={{ fontSize: "9px", color: isActive ? "#F7F6F3" : "#2E2B27", fontWeight: "500" }}>{String(i + 1).padStart(2, "0")}</span>
                      }
                    </div>
                    {i < NAV_ITEMS.length - 1 && (
                      <div style={{ width: "1px", height: "26px", marginTop: "5px", background: isDone ? "#2E2B27" : "#1E1C19" }} />
                    )}
                  </div>

                  {/* Label */}
                  <div style={{ paddingTop: "3px" }}>
                    <div style={{
                      fontSize: "12px", fontWeight: "500", lineHeight: "1.3",
                      color: isActive ? "#F7F6F3" : isDone ? "#6E685F" : "#2E2B27",
                      transition: "color 0.2s",
                    }}>
                      {item.label}
                    </div>
                    {isActive && (
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#F7F6F3", marginTop: "5px", opacity: 0.4 }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* ── Legal footer ── */}
      <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid #252219", borderRadius: "6px" }}>
        <div style={{ fontSize: "9px", color: "#2E2B27", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontWeight: "500" }}>Legal Basis</div>
        <div style={{ fontSize: "12px", color: "#6E685F", lineHeight: "1.5", marginBottom: "2px" }}>Republic Act 12124</div>
        <div style={{ fontSize: "11px", color: "#3A3631", lineHeight: "1.5" }}>The ETEEAP Act · Signed March 2025</div>
      </div>
    </aside>
  );
}