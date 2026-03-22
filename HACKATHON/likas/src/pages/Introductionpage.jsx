import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";
import likasLogo from "../assets/likas-logo.png";
import { getStudentData } from "../services/firestoreService";
import TextToSpeech from "../components/TextToSpeech";
import NotificationBell from "../components/NotificationBell";

const STATS = [
  { value: "25", label: "Tokens earned per Minor Project solved" },
  { value: "100", label: "Tokens required to unlock Major Projects" },
  { value: "100%", label: "Real-world impact in local communities" },
];

const STEPS = [
  { num: "01", title: "Join the Platform", desc: "Register as a student and map your current academic standing and required units." },
  { num: "02", title: "Accept Minor Missions", desc: "Take on approachable, localized barangay problems. Think data gathering or basic tech audits." },
  { num: "03", title: "Earn Tokens", desc: "Successfully solve a minor mission and earn 25 tokens. Accumulate 100 tokens to prove your readiness." },
  { num: "04", title: "Unlock Major Projects", desc: "Trade in your 100 tokens to access high-level, capstone-grade projects." },
];

const TIERS = [
  { label: "Minor Projects", value: "25 Tokens each" },
  { label: "Tokens to Unlock Capstone", value: "100 Tokens" },
  { label: "Major Project Value", value: "Degree Completion" },
  { label: "Community Value", value: "Immediate Impact" },
];

export default function IntroductionPage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [studentData, setStudentData] = useState({});
  const isLoggedIn = localStorage.getItem("studentData");

  useEffect(() => {
    const loadStudentData = async () => {
      if (isLoggedIn) {
        const localData = JSON.parse(isLoggedIn);
        if (localData.uid) {
          const result = await getStudentData(localData.uid);
          if (result.success) {
            setStudentData(result.data);
          }
        }
      }
    };
    loadStudentData();

    // Refresh data when user comes back to the page
    const handleFocus = () => {
      if (isLoggedIn) {
        loadStudentData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoggedIn]);

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; }
        .btn-primary:hover { background: #4A3FD9 !important; }
        .btn-outline:hover { background: #EDE9FE !important; border-color: #C4B5FD !important; }
        .step-row:hover .step-num { color: #1E3A8A !important; }
        .dropdown:hover .dropdown-menu { display: block !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <nav style={styles.navbar}>
        <button onClick={() => navigate("/")} style={styles.logoBtn}>
          <img src={likasLogo} alt="LIKAS" style={styles.logoImg} />
        </button>
        <div style={styles.navLinks}>
          <div className="dropdown" style={styles.dropdown}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={styles.dropdownBtn}>
              Portfolio
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: "6px" }}>
                <path d="M2 3.5l3 3 3-3" stroke="#64748B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="dropdown-menu" style={{ ...styles.dropdownMenu, display: dropdownOpen ? "block" : "none" }}>
              <button onClick={() => { navigate("/minor"); setDropdownOpen(false); }} style={styles.dropdownItem}>Minor</button>
              <button onClick={() => { navigate("/major"); setDropdownOpen(false); }} style={styles.dropdownItem}>Major</button>
            </div>
          </div>
          <button onClick={() => navigate("/submit")} style={styles.navBtn}>Submit Projects</button>
          <div style={styles.navSeparator} />
          {!isLoggedIn ? (
            <>
              <button onClick={() => navigate("/login")} style={{ ...styles.navBtn, background: "#5B4FFF", color: "#FFFFFF", padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "600", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(91, 79, 255, 0.2)" }}>Login</button>
              <button onClick={() => navigate("/login")} style={{ ...styles.navBtn, background: "#FFFFFF", color: "#5B4FFF", padding: "10px 20px", borderRadius: "8px", border: "2px solid #5B4FFF", fontWeight: "600", transition: "all 0.2s" }}>Sign Up</button>
            </>
          ) : (
            <>
              <div style={styles.tokenBadge}>
                <Coins size={16} color="#B45309" strokeWidth={2.5} />
                <span style={styles.tokenText}>{studentData.tokens || 0} / 100 Tokens</span>
              </div>
              <NotificationBell />
              <button onClick={() => navigate("/profile")} style={styles.profileBtn}>
                {studentData.photoURL ? (
                  <img src={studentData.photoURL} alt="Profile" style={styles.profileImg} />
                ) : (
                  <div style={styles.profileAvatar}>
                    {getInitials(studentData.username)}
                  </div>
                )}
              </button>
            </>
          )}
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <div style={styles.badge}>
            <div style={styles.badgeDot} />
            <span style={styles.badgeText}>Transform your community, earn your degree</span>
          </div>
          <h1 style={styles.heroTitle}>
            Your community impact<br />
            <span style={styles.heroHighlight}>is</span> your education.
          </h1>
          <p style={styles.heroDesc}>
            LIKAS connects students with real barangay problems. Solve minor missions to earn tokens, unlock major capstone projects, and fulfill your academic requirements while making a real difference.
          </p>
          
          {/* Text-to-Speech for accessibility */}
          <div style={{ marginBottom: "24px" }}>
            <TextToSpeech 
              text="Welcome to LIKAS. Your community impact is your education. LIKAS connects students with real barangay problems. Solve minor missions to earn tokens, unlock major capstone projects, and fulfill your academic requirements while making a real difference."
            />
          </div>
          
          <div style={styles.heroActions}>
            <button className="btn-primary" onClick={() => navigate("/projects")} style={styles.primaryBtn}>
              Start Your First Mission
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M10 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className="btn-outline" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={styles.secondaryBtn}>
              How it works
            </button>
          </div>
        </div>
      </section>

      <div style={styles.divider} />

      <section id="how-it-works" style={styles.processSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionLabel}>The Process</p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
            <h2 style={styles.sectionTitle}>How LIKAS works.</h2>
            <TextToSpeech 
              text="How LIKAS works. The Process. Step 1: Join the Platform. Register as a student and map your current academic standing and required units. Step 2: Accept Minor Missions. Take on approachable, localized barangay problems. Think data gathering or basic tech audits. Step 3: Earn Tokens. Successfully solve a minor mission and earn 25 tokens. Accumulate 100 tokens to prove your readiness. Step 4: Unlock Major Projects. Trade in your 100 tokens to access high-level, capstone-grade projects. The Framework: Minor Missions to Major Impact. Instead of standard exams, your curriculum is tied to tangible solutions. Start with manageable minor projects to build competency. Each success earns you 25 tokens. Once you reach 100 tokens, you unlock your Major Capstone — the final step to graduation."
              buttonStyle={{ fontSize: "13px", padding: "8px 14px" }}
            />
          </div>
        </div>
        <div style={styles.stepsContainer}>
          {STEPS.map((step, i) => (
            <div key={i} className="step-row" style={styles.stepRow}>
              <span className="step-num" style={styles.stepNum}>{step.num}</span>
              <div style={styles.stepContent}>
                <div style={styles.stepTitle}>{step.title}</div>
                <div style={styles.stepDesc}>{step.desc}</div>
              </div>
              <div style={styles.stepArrow}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2.5 5.5h6M6 3l2.5 2.5L6 8" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      <section style={styles.tiersSection}>
        <div style={styles.tiersContainer}>
          <div style={styles.tiersContent}>
            <div style={styles.tiersLabel}>The Framework</div>
            <h3 style={styles.tiersTitle}>Minor Missions to Major Impact</h3>
            <p style={styles.tiersDesc}>
              Instead of standard exams, your curriculum is tied to tangible solutions. Start with manageable minor projects to build competency. Each success earns you 25 tokens. Once you reach 100 tokens, you unlock your Major Capstone — the final step to graduation.
            </p>
          </div>
          <div style={styles.tiersGrid}>
            {TIERS.map((tier, i) => (
              <div key={i} style={{ ...styles.tierItem, ...(i < TIERS.length - 1 ? styles.tierSeparator : {}) }}>
                <span style={styles.tierLabel}>{tier.label}</span>
                <span style={styles.tierValue}>{tier.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerBrand}>
          <div style={styles.footerLogo}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <rect x="0.5" y="0.5" width="3.5" height="3.5" fill="#FFFFFF" />
              <rect x="5" y="0.5" width="3.5" height="3.5" fill="#FFFFFF" />
              <rect x="0.5" y="5" width="3.5" height="3.5" fill="#FFFFFF" />
              <rect x="5" y="5" width="3.5" height="3.5" fill="#FFFFFF" opacity="0.35" />
            </svg>
          </div>
          <span style={styles.footerText}>LIKAS · Community Missions Portal</span>
        </div>
        <span style={styles.footerDesc}>Transforming education through local impact</span>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#F4F7FB",
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif",
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 64px",
    borderBottom: "1px solid #E2E8F0",
    background: "#FFFFFF",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    transition: "opacity 0.2s",
  },
  logoImg: {
    height: "32px",
    width: "auto",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  dropdown: {
    position: "relative",
  },
  dropdownBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    background: "transparent",
    border: "1px solid #CBD5E1",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#475569",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: "4px",
    minWidth: "120px",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.1)",
    zIndex: 20,
    overflow: "hidden",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    background: "transparent",
    border: "none",
    textAlign: "left",
    fontSize: "13px",
    color: "#475569",
    cursor: "pointer",
  },
  navBtn: {
    padding: "8px 14px",
    background: "transparent",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    color: "#475569",
    cursor: "pointer",
  },
  navLabel: {
    fontSize: "11px",
    color: "#64748B",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  navSeparator: {
    width: "1px",
    height: "14px",
    background: "#CBD5E1",
  },
  profileBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "opacity 0.2s",
  },
  profileImg: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #E2E8F0",
  },
  profileAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#5B4FFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "600",
    border: "2px solid #E2E8F0",
  },
  tokenBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#FFFBEB",
    border: "1px solid #FDE68A",
    padding: "6px 12px",
    borderRadius: "99px",
  },
  tokenText: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#B45309",
  },
  hero: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "96px 64px 80px",
  },
  heroText: {
    maxWidth: "600px",
    textAlign: "center",
    animation: "fadeUp 0.5s ease both",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px",
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "99px",
    marginBottom: "28px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#5B4FFF",
  },
  badgeText: {
    fontSize: "11px",
    color: "#4A3FD9",
    letterSpacing: "0.04em",
    fontWeight: "500",
  },
  heroTitle: {
    fontSize: "48px",
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontWeight: "400",
    color: "#0F172A",
    letterSpacing: "-1px",
    lineHeight: "1.1",
    marginBottom: "20px",
  },
  heroHighlight: {
    fontStyle: "italic",
    color: "#5B4FFF",
  },
  heroDesc: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.8",
    marginBottom: "36px",
  },
  heroActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 28px",
    background: "#5B4FFF",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.2s",
    letterSpacing: "0.01em",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "13px 22px",
    background: "transparent",
    color: "#475569",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.2s",
    letterSpacing: "0.01em",
  },
  statsCard: {
    flexShrink: 0,
    width: "300px",
    animation: "fadeUp 0.5s 0.1s ease both",
    background: "#0F172A",
    borderRadius: "12px",
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
  statsHeader: {
    fontSize: "10px",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: "600",
    marginBottom: "24px",
  },
  statItem: {
    paddingBottom: "20px",
    marginBottom: "20px",
  },
  statSeparator: {
    borderBottom: "1px solid #1E293B",
  },
  statValue: {
    fontSize: "32px",
    fontFamily: "'DM Serif Display', Georgia, serif",
    color: "#FFFFFF",
    fontWeight: "400",
    lineHeight: "1",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#94A3B8",
    lineHeight: "1.5",
  },
  divider: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 64px",
    height: "1px",
    background: "#E2E8F0",
  },
  processSection: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "80px 64px",
  },
  sectionHeader: {
    marginBottom: "48px",
  },
  sectionLabel: {
    fontSize: "11px",
    color: "#3B82F6",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: "600",
    marginBottom: "10px",
  },
  sectionTitle: {
    fontSize: "34px",
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontWeight: "400",
    color: "#0F172A",
    letterSpacing: "-0.5px",
    lineHeight: "1.2",
  },
  stepsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  stepRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "28px",
    padding: "22px 20px",
    borderRadius: "8px",
    transition: "background 0.15s",
    cursor: "default",
    borderBottom: "1px solid #E2E8F0",
  },
  stepNum: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: "0.04em",
    minWidth: "28px",
    paddingTop: "2px",
    transition: "color 0.2s",
    fontFamily: "monospace",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: "4px",
    letterSpacing: "-0.1px",
  },
  stepDesc: {
    fontSize: "13px",
    color: "#475569",
    lineHeight: "1.6",
  },
  stepArrow: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
  },
  tiersSection: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "80px 64px",
  },
  tiersContainer: {
    background: "#0F172A",
    borderRadius: "12px",
    padding: "48px 56px",
    display: "flex",
    gap: "56px",
    alignItems: "center",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  tiersContent: {
    flex: 1,
  },
  tiersLabel: {
    fontSize: "10px",
    color: "#60A5FA",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: "600",
    marginBottom: "12px",
  },
  tiersTitle: {
    fontSize: "26px",
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontWeight: "400",
    color: "#F8FAFC",
    lineHeight: "1.3",
    marginBottom: "14px",
    letterSpacing: "-0.3px",
  },
  tiersDesc: {
    fontSize: "13px",
    color: "#94A3B8",
    lineHeight: "1.8",
    maxWidth: "420px",
  },
  tiersGrid: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: "220px",
  },
  tierItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    paddingBottom: "10px",
  },
  tierSeparator: {
    borderBottom: "1px solid #1E293B",
  },
  tierLabel: {
    fontSize: "11px",
    color: "#94A3B8",
  },
  tierValue: {
    fontSize: "11px",
    color: "#E2E8F0",
    fontWeight: "600",
    textAlign: "right",
  },
  footer: {
    borderTop: "1px solid #E2E8F0",
    padding: "24px 64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#FFFFFF",
  },
  footerBrand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  footerLogo: {
    width: "18px",
    height: "18px",
    background: "#1E3A8A",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: "12px",
    color: "#64748B",
    fontWeight: "500",
  },
  footerDesc: {
    fontSize: "11px",
    color: "#94A3B8",
  },
};
