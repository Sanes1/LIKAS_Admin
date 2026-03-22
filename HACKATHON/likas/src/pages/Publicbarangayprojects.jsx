import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, MapPin, Clock, Users, Lock, AlertCircle } from "lucide-react";
import likasLogo from "../assets/likas-logo.png";
import { getStudentData, getAvailableMissions } from "../services/firestoreService";
import TextToSpeech from "../components/TextToSpeech";
import NotificationBell from "../components/NotificationBell";

const CATEGORIES = [
  "All", 
  "Information Technology",
  "Public Health",
  "Education & Literacy",
  "Research & Data",
  "Public Administration",
  "Environment",
  "Livelihood & Economics",
  "Communications"
];

const TIER_STYLES = {
  Minor: { color: "#5B4FFF", bg: "#F5F3FF", border: "#DDD6FE" },
  Major: { color: "#F8FAFC", bg: "#0F172A", border: "#334155" },
};

export default function PublicBarangayProjects() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [userTokens, setUserTokens] = useState(0);
  const [studentData, setStudentData] = useState({});
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Styles object with hardcoded light theme colors
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #F8FAFC 0%, #FFFFFF 100%)",
      fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif",
    },
    navbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 64px",
      borderBottom: "1px solid #E2E8F0",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 10,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    logoBtn: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "none",
      border: "none",
      cursor: "pointer",
      transition: "opacity 0.2s",
      padding: 0,
    },
    logoImg: {
      height: "28px",
      width: "auto",
    },
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
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
    profileBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      transition: "opacity 0.2s",
    },
    profileImg: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #E2E8F0",
    },
    profileAvatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "#5B4FFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#FFFFFF",
      fontSize: "13px",
      fontWeight: "600",
      border: "2px solid #E2E8F0",
    },
    hero: {
      padding: "64px 64px 48px",
      maxWidth: "1100px",
      margin: "0 auto",
    },
    heroContent: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "48px",
      flexWrap: "wrap",
    },
    heroText: {
      animation: "fadeUp 0.4s ease both",
    },
    heroTitle: {
      fontSize: "40px",
      fontFamily: "'DM Serif Display', Georgia, serif",
      fontWeight: "400",
      color: "#0F172A",
      letterSpacing: "-0.5px",
      lineHeight: "1.1",
      marginBottom: "16px",
    },
    heroDesc: {
      fontSize: "15px",
      color: "#475569",
      lineHeight: "1.6",
      maxWidth: "480px",
    },
    heroStats: {
      display: "flex",
      gap: "12px",
      animation: "fadeUp 0.4s 0.1s ease both",
      flexWrap: "wrap",
    },
    minorStat: {
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "8px",
      padding: "16px 24px",
      minWidth: "140px",
    },
    majorStat: {
      background: "#0F172A",
      border: "1px solid #334155",
      borderRadius: "8px",
      padding: "16px 24px",
      minWidth: "140px",
      color: "#FFFFFF",
    },
    statLabel: {
      fontSize: "10px",
      color: "#64748B",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: "4px",
      fontWeight: "600",
    },
    statValue: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#5B4FFF",
    },
    section: {
      padding: "0 64px 48px",
      maxWidth: "1100px",
      margin: "0 auto",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    sectionLabel: {
      fontSize: "11px",
      color: "#64748B",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontWeight: "600",
    },
    divider: {
      flex: 1,
      height: "1px",
      background: "#E2E8F0",
    },
    featuredGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    featuredCard: {
      background: "#FFFFFF",
      border: "1px solid #DDD6FE",
      borderRadius: "12px",
      padding: "28px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    featuredHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "14px",
    },
    featuredCategory: {
      fontSize: "10px",
      color: "#5B4FFF",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontWeight: "600",
    },
    featuredReward: {
      flexShrink: 0,
      background: "#F5F3FF",
      border: "1px solid #DDD6FE",
      borderRadius: "8px",
      padding: "6px 10px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    featuredTitle: {
      fontSize: "18px",
      fontFamily: "'DM Serif Display', Georgia, serif",
      color: "#0F172A",
      fontWeight: "400",
      lineHeight: "1.2",
      marginBottom: "16px",
    },
    featuredSummary: {
      fontSize: "13px",
      color: "#475569",
      lineHeight: "1.6",
      marginBottom: "16px",
    },
    featuredMeta: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      color: "#64748B",
      fontSize: "12px",
      marginBottom: "20px",
    },
    featuredExpanded: {
      paddingTop: "20px",
      borderTop: "1px solid #E2E8F0",
    },
    acceptBtn: {
      width: "100%",
      padding: "12px",
      background: "#1A1A1A",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
    },
    filters: {
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    searchBox: {
      position: "relative",
      flex: 1,
      minWidth: "200px",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
    },
    searchInput: {
      width: "100%",
      padding: "10px 14px 10px 34px",
      background: "#FFFFFF",
      border: "1px solid #CBD5E1",
      borderRadius: "6px",
      fontSize: "13px",
      color: "#0F172A",
    },
    categoryFilter: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginBottom: "24px",
    },
    catChip: {
      padding: "6px 14px",
      border: "1px solid #CBD5E1",
      borderRadius: "99px",
      background: "#FFFFFF",
      color: "#475569",
      fontSize: "12px",
      fontWeight: "400",
      transition: "all 0.15s",
      cursor: "pointer",
    },
    projectList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    projectCard: {
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "10px",
      overflow: "hidden",
      transition: "all 0.2s",
    },
    majorCard: {
      background: "#0F172A",
      border: "1px solid #334155",
    },
    projectHeader: {
      padding: "20px",
      cursor: "pointer",
    },
    projectInfo: {
      flex: 1,
    },
    projectBadge: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
    },
    tierBadge: {
      fontSize: "10px",
      fontWeight: "600",
      color: "#5B4FFF",
      background: "#F5F3FF",
      border: "1px solid #DDD6FE",
      padding: "3px 8px",
      borderRadius: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    majorTier: {
      color: "#F8FAFC",
      background: "#0F172A",
      border: "1px solid #334155",
    },
    projectCategory: {
      fontSize: "11px",
      color: "#64748B",
    },
    projectTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#0F172A",
      marginBottom: "6px",
    },
    majorTitle: {
      color: "#F8FAFC",
    },
    projectLocation: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#64748B",
      fontSize: "12px",
    },
    projectStatus: {
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "8px",
    },
    unlockBadge: {
      background: "#1E293B",
      color: "#CBD5E1",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    unlockReady: {
      background: "#22C55E",
      color: "#FFFFFF",
    },
    rewardBadge: {
      background: "#FFFBEB",
      border: "1px solid #FDE68A",
      color: "#B45309",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    projectDetails: {
      padding: "0 20px 20px",
      borderTop: "1px solid #F1F5F9",
    },
    majorDetails: {
      borderTop: "1px solid #1E293B",
    },
    projectSummary: {
      fontSize: "13px",
      color: "#475569",
      lineHeight: "1.7",
      paddingTop: "16px",
      marginBottom: "16px",
    },
    projectTags: {
      display: "flex",
      gap: "6px",
      flexWrap: "wrap",
      marginBottom: "20px",
    },
    tagPill: {
      fontSize: "10px",
      color: "#64748B",
      background: "#F1F5F9",
      padding: "4px 10px",
      borderRadius: "99px",
    },
    projectActions: {
      display: "flex",
      gap: "10px",
      marginTop: "16px",
    },
    unlockBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      background: "#334155",
      color: "#94A3B8",
      border: "none",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "not-allowed",
    },
    unlockReadyBtn: {
      background: "#1A1A1A",
      color: "#FFFFFF",
      cursor: "pointer",
    },
  };

  useEffect(() => {
    const loadData = async () => {
      console.log('🚀 Loading data for Public Barangay Projects page...');
      setLoading(true);
      setError(null);
      
      // Load student data
      const localData = JSON.parse(localStorage.getItem("studentData") || "{}");
      console.log('👤 Student data from localStorage:', localData);
      if (localData.uid) {
        const result = await getStudentData(localData.uid);
        if (result.success) {
          console.log('✅ Student data loaded:', result.data);
          setStudentData(result.data);
          setUserTokens(result.data.tokens || 0);
        } else {
          console.error('❌ Failed to load student data:', result.error);
        }
      }
      
      // Load available missions from Firebase
      console.log('📡 Fetching missions from Firebase...');
      const missionsResult = await getAvailableMissions();
      console.log('📊 Missions result:', missionsResult);
      
      if (missionsResult.success) {
        console.log(`✅ Loaded ${missionsResult.missions.length} missions`);
        setMissions(missionsResult.missions);
        if (missionsResult.missions.length === 0) {
          console.warn('⚠️ No missions found. Check if LGU has posted and approved any projects.');
        }
      } else {
        console.error('❌ Failed to load missions:', missionsResult.error);
        setError(missionsResult.error || 'Failed to load missions');
      }
      
      setLoading(false);
      console.log('✨ Data loading complete');
    };
    
    loadData();

    // Refresh data when user comes back to the page
    const handleFocus = () => {
      console.log('🔄 Page focused - refreshing data...');
      loadData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const acceptMission = (mission) => {
    // For Major projects, check if user has enough tokens
    if (mission.tier === 'Major') {
      if (userTokens < 100) {
        alert(`You need 100 tokens to unlock this Major Capstone project. You currently have ${userTokens} tokens. Complete more Minor missions to earn tokens!`);
        return;
      }
      
      // Confirm token exchange
      const confirmed = window.confirm(
        `This Major Capstone project requires 100 tokens to unlock.\n\n` +
        `You currently have: ${userTokens} tokens\n` +
        `After unlocking: ${userTokens - 100} tokens\n\n` +
        `Do you want to unlock this project?`
      );
      
      if (!confirmed) return;
      
      // Navigate to submit page with mission details and unlock flag
      navigate('/submit', { state: { mission, unlockMajor: true } });
    } else {
      // Minor missions - just navigate to submit
      navigate('/submit', { state: { mission } });
    }
  };

  // Convert Firebase mission data to display format
  const formatMission = (mission) => {
    // Map tier: beginner/intermediate = Minor (25 tokens), advanced = Major (requires 100 tokens)
    const tier = mission.tier === 'advanced' ? 'Major' : 'Minor';
    const tokensReward = tier === 'Minor' ? 25 : 0; // Minor gives 25 tokens, Major doesn't give tokens (you spend 100 to unlock)
    const unlockCost = tier === 'Major' ? 100 : 0; // Major requires 100 tokens to unlock
    
    return {
      id: mission.id,
      title: mission.title,
      barangay: mission.postedBy?.barangay || 'Unknown Barangay',
      city: mission.postedBy?.city || 'Unknown City',
      category: mission.category || 'General',
      tier: tier,
      reward: tokensReward,
      unlockCost: unlockCost,
      duration: mission.duration || 'Not specified',
      teamSize: mission.slots ? `${mission.slots} ${mission.slots === 1 ? 'person' : 'people'}` : 'Not specified',
      tags: mission.tags?.filter(t => t.status === 'approved').map(t => t.competency || t.subject) || [],
      summary: mission.description || 'No description provided',
      impact: mission.impact,
      outputs: mission.outputs,
      urgency: mission.urgency,
      contactPerson: mission.contactName || mission.postedBy?.name || 'Barangay Official',
      featured: mission.urgency === 'high',
      rawData: mission
    };
  };

  const formattedMissions = missions.map(formatMission);

  const filtered = formattedMissions.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search || 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      p.barangay.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = formattedMissions.filter(p => p.featured).slice(0, 2);
  
  const minorCount = formattedMissions.filter(p => p.tier === 'Minor').length;
  const majorCount = formattedMissions.filter(p => p.tier === 'Major').length;

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input { font-family: inherit; }
        input:focus { outline: none; border-color: #5B4FFF !important; box-shadow: 0 0 0 3px rgba(91, 79, 255, 0.1); }
        .btn-primary:hover { background: #4A3FD9 !important; }
        .btn-major:hover { background: #1E293B !important; }
        .cat-chip:hover { border-color: #5B4FFF !important; color: #5B4FFF !important; }
        .project-card:hover { border-color: #CBD5E1 !important; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05) !important; }
        .featured-card:hover { box-shadow: 0 10px 25px -5px rgba(91, 79, 255, 0.1) !important; transform: translateY(-2px); }
        .tag-pill:hover { background: #E2E8F0 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <nav style={styles.navbar}>
        <button onClick={() => navigate("/")} style={styles.logoBtn}>
          <img src={likasLogo} alt="LIKAS" style={styles.logoImg} />
        </button>
        <div style={styles.navRight}>
          <div style={styles.tokenBadge}>
            <Coins size={16} color="#B45309" strokeWidth={2.5} />
            <span style={styles.tokenText}>{userTokens} / 100 Tokens</span>
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
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>Active Missions.</h1>
            <p style={styles.heroDesc}>Complete minor missions to earn tokens and build your local impact portfolio. Collect 100 tokens to unlock your final Major Capstone.</p>
            
            {/* Text-to-Speech for accessibility */}
            <div style={{ marginTop: "16px" }}>
              <TextToSpeech 
                text="Active Missions. Complete minor missions to earn tokens and build your local impact portfolio. Collect 100 tokens to unlock your final Major Capstone."
              />
            </div>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.minorStat}>
              <div style={styles.statLabel}>Minor Missions</div>
              <div style={styles.statValue}>{minorCount} Available</div>
            </div>
            <div style={styles.majorStat}>
              <div style={styles.statLabel}>Major Capstone</div>
              <div style={styles.statValue}>{majorCount} Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section style={styles.section}>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#5B4FFF", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
            <p style={{ fontSize: "14px", color: "#64748B" }}>Loading missions from Firebase...</p>
          </div>
        </section>
      )}

      {/* Error State */}
      {!loading && error && (
        <section style={styles.section}>
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "24px", textAlign: "center" }}>
            <AlertCircle size={32} color="#DC2626" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#DC2626", marginBottom: "8px" }}>Failed to Load Missions</h3>
            <p style={{ fontSize: "13px", color: "#991B1B", marginBottom: "16px" }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ padding: "8px 16px", background: "#DC2626", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
              Retry
            </button>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && missions.length === 0 && (
        <section style={styles.section}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "48px 24px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <MapPin size={28} color="#64748B" />
            </div>
            <h3 style={{ fontSize: "18px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#0F172A", marginBottom: "8px" }}>No Missions Available Yet</h3>
            <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.6", maxWidth: "400px", margin: "0 auto 16px" }}>
              There are currently no approved missions from LGUs. Check back soon or contact your barangay to post community needs.
            </p>
            <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "12px" }}>
              💡 Tip: LGU officials need to post a project and approve its competency tags before it appears here.
            </p>
          </div>
        </section>
      )}

      {/* Missions Content - Only show if we have missions */}
      {!loading && !error && missions.length > 0 && (
        <>
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>Suggested Minor Missions</span>
          <div style={styles.divider} />
        </div>
        <div style={styles.featuredGrid}>
          {featured.map((p, i) => (
            <div key={p.id} className="featured-card" style={styles.featuredCard} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
              <div style={styles.featuredHeader}>
                <div style={styles.featuredCategory}>{p.category}</div>
                <div style={styles.featuredReward}>
                  <Coins size={14} color="#5B4FFF" strokeWidth={2.5} />
                  <span>+{p.reward}</span>
                </div>
              </div>
              <h3 style={styles.featuredTitle}>{p.title}</h3>
              <p style={styles.featuredSummary}>{p.summary}</p>
              <div style={styles.featuredMeta}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={12} /> {p.barangay}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={12} /> {p.duration}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Users size={12} /> {p.teamSize}
                </span>
              </div>
              {expanded === p.id && (
                <div style={styles.featuredExpanded}>
                  <div style={{ marginBottom: "16px" }}>
                    <TextToSpeech 
                      text={`${p.title}. ${p.summary}. Location: ${p.barangay}. Duration: ${p.duration}. Team size: ${p.teamSize}.`}
                      buttonStyle={{ fontSize: "11px", padding: "6px 10px" }}
                    />
                  </div>
                  <button className="btn-primary" onClick={() => acceptMission(p)} style={styles.acceptBtn}>Accept Mission</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>Mission Directory</span>
          <div style={styles.divider} />
        </div>

        <div style={styles.filters}>
          <div style={styles.searchBox}>
            <svg style={styles.searchIcon} width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="#94A3B8" strokeWidth="1.3" /><path d="M9 9l2.5 2.5" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search missions or keywords..." style={styles.searchInput} />
          </div>
        </div>

        <div style={styles.categoryFilter}>
          {CATEGORIES.map(cat => (
            <button key={cat} className="cat-chip" onClick={() => setActiveCategory(cat)} style={styles.catChip}>
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.projectList}>
          {filtered.map((p, i) => {
            const isMajor = p.tier === "Major";
            const canUnlock = userTokens >= 100;
            const style = TIER_STYLES[p.tier];
            const isOpen = expanded === p.id;

            return (
              <div key={p.id} className="project-card" style={{ ...styles.projectCard, ...(isMajor ? styles.majorCard : {}) }}>
                <div style={styles.projectHeader} onClick={() => setExpanded(isOpen ? null : p.id)}>
                  <div style={styles.projectInfo}>
                    <div style={styles.projectBadge}>
                      <span style={{ ...styles.tierBadge, ...(isMajor ? styles.majorTier : {}) }}>{isMajor ? "Major Capstone" : "Minor Mission"}</span>
                      <span style={styles.projectCategory}>{p.category}</span>
                    </div>
                    <h3 style={{ ...styles.projectTitle, ...(isMajor ? styles.majorTitle : {}) }}>{p.title}</h3>
                    <div style={styles.projectLocation}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={12} /> {p.barangay}, {p.city}
                      </span>
                    </div>
                  </div>
                  <div style={styles.projectStatus}>
                    {isMajor ? (
                      <div style={{ ...styles.unlockBadge, ...(canUnlock ? styles.unlockReady : {}) }}>
                        {!canUnlock && <Lock size={10} strokeWidth={2} />}
                        {p.unlockCost} Tokens
                      </div>
                    ) : (
                      <div style={styles.rewardBadge}>
                        <Coins size={14} strokeWidth={2.5} /> +{p.reward} Tokens
                      </div>
                    )}
                  </div>
                </div>
                {isOpen && (
                  <div style={{ ...styles.projectDetails, ...(isMajor ? styles.majorDetails : {}) }}>
                    <div style={{ marginBottom: "16px" }}>
                      <TextToSpeech 
                        text={`${p.title}. ${p.summary}. Location: ${p.barangay}, ${p.city}. Duration: ${p.duration}. Team size: ${p.teamSize}.`}
                        buttonStyle={{ fontSize: "11px", padding: "6px 10px" }}
                      />
                    </div>
                    <p style={styles.projectSummary}>{p.summary}</p>
                    <div style={styles.projectTags}>
                      {p.tags.map(t => <span key={t} style={styles.tagPill}>{t}</span>)}
                    </div>
                    <div style={styles.projectActions}>
                      {isMajor ? (
                        <button className="btn-major" disabled={!canUnlock} style={{ ...styles.unlockBtn, ...(canUnlock ? styles.unlockReadyBtn : {}) }}>
                          {canUnlock ? "Unlock Capstone" : `Requires ${p.unlockCost} Tokens`}
                        </button>
                      ) : (
                        <button className="btn-primary" onClick={() => acceptMission(p)} style={styles.acceptBtn}>Accept Mission</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

        </>
      )}

    </div>
  );
}
