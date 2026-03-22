import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import likasEmblem from "../assets/likas-emblem.png";

export default function LGULogin() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(null); // 'terms', 'privacy', 'data'

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, "lguUsers", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("lguAuth", "true");
        localStorage.setItem("lguUser", JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: userData.name,
          barangay: userData.barangay,
          city: userData.city,
          position: userData.position
        }));
        navigate("/lgu");
      } else {
        setError("User profile not found. Please sign up.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim() || !barangay.trim() || !city.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await setDoc(doc(db, "lguUsers", user.uid), {
        name: name.trim(),
        barangay: barangay.trim(),
        city: city.trim(),
        position: position.trim() || "LGU Staff",
        email: user.email,
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem("lguAuth", "true");
      localStorage.setItem("lguUser", JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: name.trim(),
        barangay: barangay.trim(),
        city: city.trim(),
        position: position.trim() || "LGU Staff"
      }));
      
      navigate("/lgu");
    } catch (err) {
      console.error("Sign up error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please sign in instead.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Policy Modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }} onClick={() => setShowModal(null)}>
          <div style={{ background: "#fff", borderRadius: "12px", maxWidth: "700px", width: "100%", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#0F172A" }}>
                {showModal === 'terms' && 'Terms of Service'}
                {showModal === 'privacy' && 'Privacy Policy'}
                {showModal === 'data' && 'Data Policy'}
              </h2>
              <button onClick={() => setShowModal(null)} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "none", background: "#F1F5F9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ padding: "24px", overflowY: "auto", flex: 1, fontSize: "13px", lineHeight: "1.7", color: "#475569" }}>
              {showModal === 'terms' && (
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>1. Acceptance of Terms</h3>
                  <p>By accessing and using LIKAS LGU Portal ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>2. Eligibility</h3>
                  <p>You must be an authorized representative of a Local Government Unit (LGU) or barangay to use this Platform. By registering, you confirm that all information provided is accurate and up-to-date.</p>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>3. User Responsibilities</h3>
                  <p>As an LGU administrator, you agree to:</p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Provide accurate and truthful information in all project postings</li>
                    <li>Manage community projects with integrity and professionalism</li>
                    <li>Respect the privacy and data of student volunteers</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>4. Project Postings</h3>
                  <p>All project postings must be legitimate community needs. Fraudulent or misleading project descriptions will result in account suspension.</p>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>5. Data Management</h3>
                  <p>You are responsible for managing student data in accordance with applicable data protection laws and regulations.</p>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>6. Contact Information</h3>
                  <p>For questions about these Terms of Service, please contact us at <a href="mailto:support@likas.gov.ph" style={{ color: "#2563EB" }}>support@likas.gov.ph</a></p>
                </div>
              )}
              
              {showModal === 'privacy' && (
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>1. Information We Collect</h3>
                  <p>When you register for LIKAS LGU Portal, we collect:</p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Full name and position</li>
                    <li>Email address</li>
                    <li>LGU/Barangay name and location</li>
                    <li>Project postings and related information</li>
                    <li>Communication with students and platform activity</li>
                  </ul>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>2. How We Use Your Information</h3>
                  <p>We use your information to:</p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Create and manage your LGU account</li>
                    <li>Process and publish project postings</li>
                    <li>Connect you with student volunteers</li>
                    <li>Track project progress and completion</li>
                    <li>Improve our services and user experience</li>
                  </ul>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>3. Information Sharing</h3>
                  <p>We may share your information with educational institutions, CHED, and other government agencies for project coordination purposes. We will never sell your personal information to third parties.</p>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>4. Data Security</h3>
                  <p>We implement industry-standard security measures including encrypted data transmission, secure cloud storage, and regular security audits.</p>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>5. Your Rights</h3>
                  <p>You have the right to:</p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Access your personal information</li>
                    <li>Request corrections to your data</li>
                    <li>Delete your account and associated data</li>
                    <li>Export your project information</li>
                  </ul>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>6. Contact Us</h3>
                  <p>For privacy-related questions, contact us at <a href="mailto:privacy@likas.gov.ph" style={{ color: "#2563EB" }}>privacy@likas.gov.ph</a></p>
                </div>
              )}
              
              {showModal === 'data' && (
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>1. Overview</h3>
                  <p>This Data Policy explains how LIKAS collects, uses, stores, and shares your data. By using our Platform, you acknowledge and consent to the practices described in this policy.</p>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>2. Data Collection Methods</h3>
                  <p>We collect data through:</p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Information you provide during registration</li>
                    <li>Project postings and mission descriptions</li>
                    <li>Your interactions with the Platform</li>
                    <li>AI-assisted analysis of project requirements</li>
                    <li>Communication with student volunteers</li>
                  </ul>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>3. Data Storage</h3>
                  <p>Your data is stored securely using:</p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Firebase Firestore: User profiles, project metadata, and mission data</li>
                    <li>Firebase Storage: Uploaded project files and documents</li>
                    <li>Firebase Authentication: Secure login credentials</li>
                  </ul>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>4. Data Usage</h3>
                  <p>We use your data to:</p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Facilitate community project management</li>
                    <li>Match projects with qualified student volunteers</li>
                    <li>Generate AI-powered competency tagging</li>
                    <li>Track project progress and completion</li>
                    <li>Improve Platform features and user experience</li>
                    <li>Generate analytics and reports</li>
                  </ul>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>5. Data Sharing with Partners</h3>
                  <p>Your data may be shared with educational institutions, CHED assessors, and other government agencies for project coordination and academic credit verification purposes.</p>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>6. Your Control Over Data</h3>
                  <p>You can manage your data by:</p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Updating your profile information at any time</li>
                    <li>Editing or deleting project postings</li>
                    <li>Requesting account deletion</li>
                    <li>Downloading your data export</li>
                  </ul>
                  
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginTop: "20px", marginBottom: "10px" }}>7. Contact for Data Requests</h3>
                  <p>For data-related requests or questions, contact our Data Protection Officer at <a href="mailto:data@likas.gov.ph" style={{ color: "#2563EB" }}>data@likas.gov.ph</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input { font-family: inherit; }
        input:focus { outline: none; border-color: #2563EB !important; }
        .btn-primary:hover { background: #1E40AF !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "420px", padding: "20px" }}>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "40px 36px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", padding: "8px" }}>
              <img src={likasEmblem} alt="LIKAS" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <h1 style={{ fontSize: "24px", fontFamily: "'DM Serif Display', Georgia, serif", color: "#0F172A", marginBottom: "6px" }}>LIKAS LGU Portal</h1>
            <p style={{ fontSize: "13px", color: "#64748B" }}>{isSignUp ? "Create your account" : "Sign in to manage community projects"}</p>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: "8px", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: "#DC2626", margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp && (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>Full Name <span style={{ color: "#DC2626" }}>*</span></label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} placeholder="Juan Dela Cruz" required
                    style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>Barangay <span style={{ color: "#DC2626" }}>*</span></label>
                    <input type="text" value={barangay} onChange={(e) => setBarangay(e.target.value)} disabled={loading} placeholder="San Roque" required
                      style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>City <span style={{ color: "#DC2626" }}>*</span></label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} disabled={loading} placeholder="Marikina City" required
                      style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>Position (Optional)</label>
                  <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} disabled={loading} placeholder="Barangay Captain, Kagawad, etc."
                    style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
                </div>
              </>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="admin@likas.gov" required
                style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} placeholder="Enter your password" required
                style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: "100%", padding: "12px", background: loading ? "#94A3B8" : "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "500", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
              {loading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} style={{ background: "none", border: "none", fontSize: "12px", color: "#2563EB", cursor: "pointer", padding: "8px", textDecoration: "underline" }}>
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
            
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "12px" }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowModal('terms'); }} style={{ fontSize: "11px", color: "#64748B", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#2563EB"} onMouseLeave={e => e.target.style.color = "#64748B"}>
                Terms of Service
              </a>
              <span style={{ fontSize: "11px", color: "#CBD5E1" }}>•</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowModal('privacy'); }} style={{ fontSize: "11px", color: "#64748B", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#2563EB"} onMouseLeave={e => e.target.style.color = "#64748B"}>
                Privacy Policy
              </a>
              <span style={{ fontSize: "11px", color: "#CBD5E1" }}>•</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowModal('data'); }} style={{ fontSize: "11px", color: "#64748B", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#2563EB"} onMouseLeave={e => e.target.style.color = "#64748B"}>
                Data Policy
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "10px", color: "#94A3B8" }}>
            © 2026 LIKAS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
