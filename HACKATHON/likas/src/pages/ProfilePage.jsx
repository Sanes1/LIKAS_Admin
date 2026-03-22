import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutStudent, updatePassword, reauthenticateUser } from "../services/authService";
import { getStudentData, getStudentProjects, updateStudentProfile, uploadProfilePhoto } from "../services/firestoreService";
import { Coins, Edit2, Camera, X, Check, Eye, EyeOff, User, Mail, School, Hash, Shield, Award, Calendar, FileText } from "lucide-react";
import TextToSpeech from "../components/TextToSpeech";
import NotificationBell from "../components/NotificationBell";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({});
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const loadData = async () => {
      const localData = JSON.parse(localStorage.getItem("studentData") || "{}");
      
      if (localData.uid) {
        const studentResult = await getStudentData(localData.uid);
        if (studentResult.success) {
          setStudentData(studentResult.data);
          setEditData(studentResult.data);
        }

        const projectsResult = await getStudentProjects(localData.uid);
        if (projectsResult.success) {
          setProjects(projectsResult.projects);
        }
      }
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleProfileUpdate = async () => {
    if (!editData.username?.trim() || !editData.lrn?.trim() || !editData.school?.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      const result = await updateStudentProfile(studentData.uid, editData);
      if (result.success) {
        setStudentData(editData);
        setEditMode(false);
        setSuccess('Profile updated successfully!');
        setError('');
        
        const localData = JSON.parse(localStorage.getItem("studentData") || "{}");
        localStorage.setItem("studentData", JSON.stringify({ ...localData, ...editData }));
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadProfilePhoto(studentData.uid, file);
      if (result.success) {
        setStudentData({ ...studentData, photoURL: result.photoURL });
        setSuccess('Profile photo updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to upload photo');
      }
    } catch (err) {
      setError('An error occurred while uploading photo');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      const reauthResult = await reauthenticateUser(passwordData.currentPassword);
      if (!reauthResult.success) {
        setError('Current password is incorrect');
        return;
      }

      const result = await updatePassword(passwordData.newPassword);
      if (result.success) {
        setSuccess('Password updated successfully!');
        setShowPasswordChange(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An error occurred while updating password');
    }
  };

  const handleLogout = async () => {
    const result = await logoutStudent();
    if (result.success) {
      localStorage.removeItem("studentData");
      navigate("/login");
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center", color: "#64748B" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTop: "3px solid #5B4FFF", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }}></div>
          <p style={{ fontSize: "14px", fontWeight: "500" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#F8FAFC", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .edit-field { transition: all 0.2s ease; }
        .edit-field:focus { border-color: #5B4FFF; outline: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Compact Header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "12px 32px", flexShrink: 0 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0", background: "none", border: "none", fontSize: "13px", color: "#64748B", cursor: "pointer", fontWeight: "500" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <NotificationBell />
            <button onClick={handleLogout} style={{ padding: "6px 16px", background: "#FFFFFF", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Single Screen */}
      <div style={{ flex: 1, overflow: "hidden", padding: "20px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", height: "100%" }}>
          
          {/* Success/Error Messages */}
          {(success || error) && (
            <div style={{ marginBottom: "12px" }}>
              {success && (
                <div style={{ padding: "10px 16px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "6px", color: "#065F46", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Check size={16} strokeWidth={2.5} />
                  {success}
                </div>
              )}
              {error && (
                <div style={{ padding: "10px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "6px", color: "#DC2626", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
                  <X size={16} strokeWidth={2.5} />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Compact Grid Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 300px", gap: "20px", height: success || error ? "calc(100% - 56px)" : "100%" }}>
            
            {/* Left Column - Profile Card */}
            <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "auto" }}>
              {/* Profile Photo */}
              <div style={{ position: "relative", marginBottom: "16px" }}>
                {studentData.photoURL ? (
                  <img src={studentData.photoURL} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "16px", objectFit: "cover", border: "2px solid #F1F5F9" }} />
                ) : (
                  <div style={{ width: "100px", height: "100px", borderRadius: "16px", background: "#5B4FFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: "36px", fontWeight: "600", border: "2px solid #F1F5F9" }}>
                    {getInitials(studentData.username)}
                  </div>
                )}
                <label style={{ position: "absolute", bottom: "-6px", right: "-6px", width: "32px", height: "32px", background: "#1A1A1A", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid #FFFFFF" }}>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                  {uploading ? (
                    <div style={{ width: "14px", height: "14px", border: "2px solid #FFFFFF", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                  ) : (
                    <Camera size={14} color="white" strokeWidth={2.5} />
                  )}
                </label>
              </div>

              <h1 style={{ fontSize: "20px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", marginBottom: "8px" }}>{studentData.username || "Student"}</h1>
              
              <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "16px", lineHeight: "1.6" }}>
                <div>LRN: {studentData.lrn || "—"}</div>
                <div style={{ marginTop: "4px" }}>{studentData.school || "—"}</div>
                <div style={{ marginTop: "4px" }}>{studentData.email || "—"}</div>
              </div>

              {/* Token Badge */}
              <div style={{ width: "100%", padding: "12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
                  <Coins size={20} color="#F59E0B" strokeWidth={2.5} />
                  <span style={{ fontSize: "24px", fontWeight: "700", color: "#92400E" }}>{studentData.tokens || 0}</span>
                </div>
                <div style={{ fontSize: "10px", fontWeight: "600", color: "#B45309", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tokens</div>
              </div>

              {/* Quick Stats */}
              <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A" }}>{projects.length}</div>
                  <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>Projects</div>
                </div>
                <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#5B4FFF" }}>{Math.min(studentData.tokens || 0, 100)}%</div>
                  <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>Progress</div>
                </div>
              </div>
            </div>

            {/* Middle Column - Profile Information */}
            <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "24px", overflow: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "18px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", marginBottom: "4px" }}>Profile Information</h2>
                  <TextToSpeech 
                    text={`Profile Information. Name: ${studentData.username || 'Not set'}. LRN: ${studentData.lrn || 'Not set'}. School: ${studentData.school || 'Not set'}. Email: ${studentData.email || 'Not set'}. Current tokens: ${studentData.tokens || 0}.`}
                    buttonStyle={{ fontSize: "11px", padding: "4px 8px" }}
                  />
                </div>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#5B4FFF", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => { setEditMode(false); setEditData(studentData); setError(''); }} style={{ padding: "8px 14px", background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button onClick={handleProfileUpdate} style={{ padding: "8px 14px", background: "#5B4FFF", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748B", marginBottom: "8px", fontWeight: "600" }}>
                    <User size={14} />
                    Full Name
                  </label>
                  {editMode ? (
                    <input type="text" value={editData.username || ''} onChange={(e) => setEditData({ ...editData, username: e.target.value })} className="edit-field" style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#0F172A", background: "#FFFFFF" }} />
                  ) : (
                    <div style={{ fontSize: "14px", color: "#0F172A", padding: "10px 14px", background: "#F8FAFC", borderRadius: "8px" }}>{studentData.username || "Not set"}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748B", marginBottom: "8px", fontWeight: "600" }}>
                    <Hash size={14} />
                    LRN
                  </label>
                  {editMode ? (
                    <input type="text" value={editData.lrn || ''} onChange={(e) => setEditData({ ...editData, lrn: e.target.value })} className="edit-field" style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#0F172A", background: "#FFFFFF" }} />
                  ) : (
                    <div style={{ fontSize: "14px", color: "#0F172A", padding: "10px 14px", background: "#F8FAFC", borderRadius: "8px" }}>{studentData.lrn || "Not set"}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748B", marginBottom: "8px", fontWeight: "600" }}>
                    <School size={14} />
                    School
                  </label>
                  {editMode ? (
                    <input type="text" value={editData.school || ''} onChange={(e) => setEditData({ ...editData, school: e.target.value })} className="edit-field" style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#0F172A", background: "#FFFFFF" }} />
                  ) : (
                    <div style={{ fontSize: "14px", color: "#0F172A", padding: "10px 14px", background: "#F8FAFC", borderRadius: "8px" }}>{studentData.school || "Not set"}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748B", marginBottom: "8px", fontWeight: "600" }}>
                    <Mail size={14} />
                    Email
                  </label>
                  <div style={{ fontSize: "14px", color: "#64748B", padding: "10px 14px", background: "#F1F5F9", borderRadius: "8px", border: "1px solid #E2E8F0" }}>{studentData.email || "Not set"}</div>
                  <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px" }}>Email cannot be changed</p>
                </div>
              </div>

              {/* Projects List */}
              {projects.length > 0 && (
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #E2E8F0" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FileText size={16} />
                    Recent Projects ({projects.length})
                  </h3>
                  <div style={{ display: "grid", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                    {projects.slice(0, 5).map((project) => {
                      const statusConfig = {
                        pending: { bg: "#FFF8F0", border: "#FDE8C8", text: "#B45309", label: "⏳ Pending Review" },
                        approved: { bg: "#EEFAF0", border: "#C6E8CE", text: "#2E7D32", label: "✓ Approved" },
                        rejected: { bg: "#FEF2F2", border: "#FCA5A5", text: "#DC2626", label: "✕ Rejected" }
                      };
                      const status = statusConfig[project.submissionStatus] || statusConfig.pending;
                      
                      return (
                        <div key={project.id} style={{ padding: "12px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>{project.subject}</div>
                            <span style={{ fontSize: "9px", fontWeight: "600", color: status.text, background: status.bg, border: `1px solid ${status.border}`, padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap" }}>
                              {status.label}
                            </span>
                          </div>
                          {project.missionTitle && (
                            <div style={{ fontSize: "11px", color: "#475569", marginBottom: "4px" }}>{project.missionTitle}</div>
                          )}
                          <div style={{ fontSize: "11px", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Calendar size={11} />
                            {new Date(project.submittedAt).toLocaleDateString()}
                          </div>
                          {project.submissionStatus === 'rejected' && project.rejectionReason && (
                            <div style={{ marginTop: "8px", padding: "8px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "4px", fontSize: "11px", color: "#991B1B", lineHeight: "1.4" }}>
                              <strong>Reason:</strong> {project.rejectionReason}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Security */}
            <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "24px", overflow: "auto" }}>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", marginBottom: "4px" }}>Security</h2>
                <p style={{ fontSize: "12px", color: "#64748B" }}>Manage your password</p>
              </div>

              <button onClick={() => setShowPasswordChange(!showPasswordChange)} style={{ width: "100%", padding: "10px 14px", background: showPasswordChange ? "#F1F5F9" : "#DC2626", color: showPasswordChange ? "#64748B" : "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Shield size={14} />
                {showPasswordChange ? "Cancel" : "Change Password"}
              </button>

              {showPasswordChange && (
                <div style={{ display: "grid", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Current Password</label>
                    <div style={{ position: "relative" }}>
                      <input 
                        type={showPasswords.current ? "text" : "password"} 
                        value={passwordData.currentPassword} 
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                        className="edit-field"
                        style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#0F172A", background: "#FFFFFF" }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} 
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>New Password</label>
                    <div style={{ position: "relative" }}>
                      <input 
                        type={showPasswords.new ? "text" : "password"} 
                        value={passwordData.newPassword} 
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                        className="edit-field"
                        style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#0F172A", background: "#FFFFFF" }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} 
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Confirm Password</label>
                    <div style={{ position: "relative" }}>
                      <input 
                        type={showPasswords.confirm ? "text" : "password"} 
                        value={passwordData.confirmPassword} 
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                        className="edit-field"
                        style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#0F172A", background: "#FFFFFF" }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} 
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button onClick={handlePasswordChange} style={{ padding: "10px 14px", background: "#DC2626", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer", marginTop: "8px" }}>
                    Update Password
                  </button>
                </div>
              )}

              {/* Account Stats */}
              <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #E2E8F0" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A", marginBottom: "12px" }}>Account Stats</h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#F8FAFC", borderRadius: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Award size={14} />
                      Total Projects
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>{projects.length}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#F8FAFC", borderRadius: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Coins size={14} />
                      Total Tokens
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#F59E0B" }}>{studentData.tokens || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
