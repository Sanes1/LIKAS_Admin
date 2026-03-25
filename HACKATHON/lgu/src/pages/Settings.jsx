import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LGUSidebar from "../components/LGUsidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import { auth, db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  // Profile fields
  const [name, setName] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = localStorage.getItem("lguUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        const userDoc = await getDoc(doc(db, "lguUsers", user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || "");
          setBarangay(data.barangay || "");
          setCity(data.city || "");
          setPosition(data.position || "");
          setEmail(data.email || "");
        }
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
      setError("Failed to load profile data.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!name.trim() || !barangay.trim() || !city.trim()) {
      setError("Name, Barangay, and City are required.");
      return;
    }
    
    setLoading(true);

    try {
      const userStr = localStorage.getItem("lguUser");
      if (!userStr) {
        setError("User not found. Please log in again.");
        return;
      }
      
      const user = JSON.parse(userStr);
      
      // Update Firestore
      await updateDoc(doc(db, "lguUsers", user.uid), {
        name: name.trim(),
        barangay: barangay.trim(),
        city: city.trim(),
        position: position.trim(),
        updatedAt: new Date().toISOString()
      });
      
      // Update localStorage
      const updatedUser = {
        ...user,
        name: name.trim(),
        barangay: barangay.trim(),
        city: city.trim(),
        position: position.trim()
      };
      localStorage.setItem("lguUser", JSON.stringify(updatedUser));
      
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        setError("User not found. Please log in again.");
        return;
      }
      
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password changed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to change password:", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Current password is incorrect.");
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input { font-family: inherit; }
        input:focus { outline: none; border-color: #2563EB !important; }
        .btn-primary:hover { background: #1E40AF !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <LGUSidebar activePath="/lgu/settings" />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "700px", width: "100%" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => navigate("/lgu")}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#64748B", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dashboard
              </button>
              <span style={{ color: "#CBD5E1", fontSize: "12px" }}>/</span>
              <span style={{ fontSize: "12px", color: "#1E293B", fontWeight: "500" }}>Settings</span>
            </div>
            <NotificationBell />
          </div>

          {/* Page heading */}
          <div style={{ marginBottom: "28px", animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Account Settings</p>
            <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "8px" }}>
              Manage Your Profile
            </h1>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.75" }}>
              Update your profile information and change your password.
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div style={{ padding: "12px 16px", background: "#EEFAF0", border: "1px solid #C6E8CE", borderRadius: "8px", marginBottom: "20px", animation: "fadeUp 0.3s ease both" }}>
              <p style={{ fontSize: "12px", color: "#2E7D32", margin: 0 }}>{success}</p>
            </div>
          )}
          
          {error && (
            <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: "8px", marginBottom: "20px", animation: "fadeUp 0.3s ease both" }}>
              <p style={{ fontSize: "12px", color: "#DC2626", margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Profile Information */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden", marginBottom: "20px", animation: "fadeUp 0.3s 0.05s ease both" }}>
            <div style={{ padding: "14px 20px", background: "#F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: "11px", fontWeight: "500", color: "#0F172A" }}>Profile Information</span>
            </div>
            <form onSubmit={handleUpdateProfile} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>
                  Full Name <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required
                  style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>
                    Barangay <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input type="text" value={barangay} onChange={(e) => setBarangay(e.target.value)} disabled={loading} required
                    style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>
                    City <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} disabled={loading} required
                    style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>Position</label>
                <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} disabled={loading}
                  style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>Email</label>
                <input type="email" value={email} disabled
                  style={{ width: "100%", padding: "11px 14px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#94A3B8", cursor: "not-allowed" }} />
                <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>Email cannot be changed</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary"
                style={{ padding: "11px 20px", background: loading ? "#94A3B8" : "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", alignSelf: "flex-start" }}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden", animation: "fadeUp 0.3s 0.1s ease both" }}>
            <div style={{ padding: "14px 20px", background: "#F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: "11px", fontWeight: "500", color: "#0F172A" }}>Change Password</span>
            </div>
            <form onSubmit={handleChangePassword} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>
                  Current Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={loading}
                  style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>
                  New Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading}
                  style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
                <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>Must be at least 6 characters</p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "500", marginBottom: "6px" }}>
                  Confirm New Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}
                  style={{ width: "100%", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", color: "#0F172A" }} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary"
                style={{ padding: "11px 20px", background: loading ? "#94A3B8" : "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", alignSelf: "flex-start" }}>
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
