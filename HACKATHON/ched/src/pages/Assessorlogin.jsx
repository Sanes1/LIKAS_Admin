import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_CREDENTIALS = {
  email: "m.santos@pup.edu.ph",
  password: "eteeap2026",
};

export default function AssessorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter your institutional email and password.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        navigate("/assessor");
      } else {
        setLoading(false);
        setError("Invalid credentials. Try m.santos@pup.edu.ph / eteeap2026");
      }
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Instrument Serif', 'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: 'DM Sans', sans-serif; }
        input:focus { outline: none; }
        button { font-family: 'DM Sans', sans-serif; cursor: pointer; }
        .login-btn:hover:not(:disabled) { background: #2C2925 !important; }
        .demo-btn:hover { background: rgba(247,246,243,0.06) !important; }
        .show-btn:hover { color: #F7F6F3 !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideError {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: "46%",
        minHeight: "100vh",
        background: "#1A1814",
        padding: "56px 52px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>

        {/* Background texture — subtle grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "linear-gradient(#F7F6F3 1px, transparent 1px), linear-gradient(90deg, #F7F6F3 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />

        {/* Large watermark numeral */}
        <div style={{
          position: "absolute", right: "-20px", bottom: "60px",
          fontSize: "320px", lineHeight: "1",
          fontFamily: "'Instrument Serif', Georgia, serif",
          color: "rgba(247,246,243,0.03)",
          userSelect: "none", pointerEvents: "none",
          letterSpacing: "-10px",
        }}>RA</div>

        {/* Top: Brand */}
        <div style={{ animation: "fadeUp 0.5s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "28px", height: "28px", background: "#F7F6F3", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                <rect x="1" y="1" width="5" height="5" fill="#1A1814" />
                <rect x="7.5" y="1" width="4.5" height="4.5" fill="#1A1814" />
                <rect x="1" y="7.5" width="4.5" height="4.5" fill="#1A1814" />
                <rect x="7.5" y="7.5" width="4.5" height="4.5" fill="#1A1814" opacity="0.3" />
              </svg>
            </div>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#F7F6F3", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>SKILLSET</span>
          </div>
          <p style={{ fontSize: "10px", color: "#2E2B27", letterSpacing: "0.12em", textTransform: "uppercase", paddingLeft: "38px", fontFamily: "'DM Sans', sans-serif" }}>Assessor Portal</p>
        </div>

        {/* Middle: Hero text */}
        <div style={{ animation: "fadeUp 0.5s 0.1s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", background: "rgba(247,246,243,0.06)", border: "1px solid rgba(247,246,243,0.08)", borderRadius: "99px", marginBottom: "28px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80", animation: "fadeIn 1s ease infinite alternate" }} />
            <span style={{ fontSize: "11px", color: "#6E685F", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}>ETEEAP Assessment System · RA 12124</span>
          </div>

          <h1 style={{
            fontSize: "46px", lineHeight: "1.1", color: "#F7F6F3",
            letterSpacing: "-1.5px", marginBottom: "20px", maxWidth: "340px",
          }}>
            Where work<br />
            <em style={{ color: "#A09990" }}>becomes</em><br />
            a degree.
          </h1>

          <p style={{ fontSize: "14px", color: "#4A4540", lineHeight: "1.8", maxWidth: "320px", fontFamily: "'DM Sans', sans-serif" }}>
            The AI-powered platform that helps Filipino working students convert years of professional experience into college credits under the law.
          </p>
        </div>

        {/* Bottom: Stats row */}
        <div style={{ display: "flex", gap: "32px", animation: "fadeUp 0.5s 0.2s ease both" }}>
          {[
            { value: "2.3M", label: "Working students" },
            { value: "RA 12124", label: "Legal authority" },
            { value: "5 yrs", label: "= Recognized credits" },
          ].map(s => (
            <div key={s.value}>
              <div style={{ fontSize: "18px", color: "#F7F6F3", letterSpacing: "-0.5px", marginBottom: "2px" }}>{s.value}</div>
              <div style={{ fontSize: "10px", color: "#2E2B27", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: 1,
        background: "#F7F6F3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 48px",
        position: "relative",
      }}>

        {/* Subtle top-right corner ornament */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "180px", height: "180px",
          background: "radial-gradient(circle at top right, rgba(26,24,20,0.04), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ width: "100%", maxWidth: "360px" }}>

          {/* Form heading */}
          <div style={{ marginBottom: "40px", animation: "fadeUp 0.45s 0.15s ease both" }}>
            <h2 style={{ fontSize: "28px", color: "#1A1814", letterSpacing: "-0.8px", marginBottom: "6px", lineHeight: "1.2" }}>
              Sign in to continue.
            </h2>
            <p style={{ fontSize: "13px", color: "#A09990", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.6" }}>
              Use your institutional email issued by CHED or your HEI.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "fadeUp 0.45s 0.22s ease both" }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "#6E685F", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "7px" }}>
                Institutional Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  onKeyDown={handleKeyDown}
                  placeholder="yourname@institution.edu.ph"
                  style={{
                    width: "100%", padding: "12px 14px 12px 40px",
                    background: "#fff",
                    border: `1.5px solid ${error ? "#FECDCA" : focused === "email" ? "#1A1814" : "#DDD8D0"}`,
                    borderRadius: "8px", fontSize: "14px", color: "#1A1814",
                    transition: "border-color 0.18s",
                  }}
                />
                <svg style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.4 }} width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="1.5" y="3" width="12" height="9" rx="1.5" stroke="#1A1814" strokeWidth="1.3"/>
                  <path d="M1.5 5.5l6 4 6-4" stroke="#1A1814" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "#6E685F", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "7px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••••"
                  style={{
                    width: "100%", padding: "12px 44px 12px 40px",
                    background: "#fff",
                    border: `1.5px solid ${error ? "#FECDCA" : focused === "password" ? "#1A1814" : "#DDD8D0"}`,
                    borderRadius: "8px", fontSize: "14px", color: "#1A1814",
                    transition: "border-color 0.18s",
                    letterSpacing: showPass ? "normal" : "0.15em",
                  }}
                />
                <svg style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.4 }} width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="3" y="7" width="9" height="7" rx="1.5" stroke="#1A1814" strokeWidth="1.3"/>
                  <path d="M5 7V5a2.5 2.5 0 015 0v2" stroke="#1A1814" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <button className="show-btn" onClick={() => setShowPass(s => !s)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#C4BFB6", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", fontWeight: "500", transition: "color 0.15s", padding: "2px 4px" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "10px 12px", background: "#FFF0F0", border: "1px solid #FECDCA", borderRadius: "6px", animation: "slideError 0.2s ease both" }}>
                <svg style={{ flexShrink: 0, marginTop: "1px" }} width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="#C62828" strokeWidth="1.2"/><path d="M6.5 4v3.5M6.5 9v.5" stroke="#C62828" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#C62828", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.5" }}>{error}</span>
              </div>
            )}

            {/* Login button */}
            <button className="login-btn" onClick={handleLogin} disabled={loading}
              style={{
                marginTop: "6px", padding: "13px",
                background: loading ? "#2E2B27" : "#1A1814",
                color: "#F7F6F3", border: "none", borderRadius: "8px",
                fontSize: "14px", fontWeight: "500",
                transition: "background 0.2s",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}>
              {loading ? (
                <>
                  <svg style={{ animation: "spin 0.7s linear infinite" }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="rgba(247,246,243,0.3)" strokeWidth="1.5"/>
                    <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="#F7F6F3" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Verifying credentials…
                </>
              ) : (
                <>
                  Sign In to Assessor Portal
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </>
              )}
              {/* shimmer on hover (CSS only via pseudo — we'll fake with animation on load) */}
            </button>
          </div>

          {/* Demo credentials hint */}
          <div style={{ marginTop: "28px", padding: "14px 16px", background: "#F0EDE8", border: "1px solid #E0DCD5", borderRadius: "8px", animation: "fadeUp 0.45s 0.3s ease both" }}>
            <div style={{ fontSize: "10px", fontFamily: "'DM Sans', sans-serif", color: "#A09990", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", marginBottom: "8px" }}>Demo Credentials</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {[
                { label: "Email", val: DEMO_CREDENTIALS.email },
                { label: "Password", val: DEMO_CREDENTIALS.password },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "#A09990" }}>{item.label}</span>
                  <button className="demo-btn"
                    onClick={() => {
                      if (item.label === "Email") setEmail(item.val);
                      else setPassword(item.val);
                      setError("");
                    }}
                    style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "#4A4540", background: "transparent", border: "none", fontWeight: "500", padding: "2px 6px", borderRadius: "4px", transition: "background 0.15s" }}>
                    {item.val}
                  </button>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "#C4BFB6", marginTop: "8px" }}>Click a value to auto-fill the field.</p>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "32px", textAlign: "center", animation: "fadeUp 0.45s 0.36s ease both" }}>
            <p style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "#C4BFB6", lineHeight: "1.7" }}>
              Access is restricted to CHED-accredited ETEEAP assessors.<br />
              For account issues, contact your HEI's ETEEAP coordinator.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}