import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LGUSidebar from "../components/LGUsidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import { listenToProjects, updateProject } from "../services/firebaseService";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function ReviewSubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [expandedId, setExpandedId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    console.log("🔍 Setting up real-time listener for student submissions...");
    
    const unsubscribe = listenToProjects(
      (projectsArray) => {
        console.log(`📦 Received ${projectsArray.length} total projects`);
        
        // Filter for student submissions (projects with submissionStatus field)
        const studentSubmissions = projectsArray.filter(p => 
          p.submissionStatus && 
          p.studentName && 
          p.missionId
        );
        
        console.log(`✅ Found ${studentSubmissions.length} student submissions`);
        setSubmissions(studentSubmissions);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error listening to submissions:", error);
        setLoading(false);
      }
    );

    return () => {
      console.log("🔌 Cleaning up submissions listener");
      unsubscribe();
    };
  }, []);

  const handleApprove = async (submissionId) => {
    if (!window.confirm("Approve this student submission? The student will be notified and receive tokens.")) {
      return;
    }

    setProcessingId(submissionId);
    
    try {
      const submission = submissions.find(s => s.id === submissionId);
      
      await updateProject(submissionId, {
        submissionStatus: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: JSON.parse(localStorage.getItem("lguUser") || "{}")?.name || "LGU Official"
      });
      
      // Add tokens to student if it's a Minor project
      if (submission.tier === 'Minor' && submission.tokensEarned) {
        const { updateStudentTokens } = await import('../services/firebaseService');
        const tokenResult = await updateStudentTokens(submission.userId, submission.tokensEarned);
        console.log('💰 Tokens added to student:', tokenResult);
      }
      
      // Create notification for student
      const { addDoc, collection } = await import('firebase/firestore');
      const { firestore } = await import('../firebase/config');
      
      const notificationMessage = submission.tier === 'Minor' 
        ? `Your ${submission.tier} project "${submission.missionTitle}" has been approved! You earned ${submission.tokensEarned} tokens.`
        : `Your ${submission.tier} project "${submission.missionTitle}" has been approved by the LGU!`;
      
      await addDoc(collection(firestore, 'notifications'), {
        type: 'approval',
        studentId: submission.userId,
        studentName: submission.studentName,
        projectId: submissionId,
        missionTitle: submission.missionTitle,
        tokensEarned: submission.tier === 'Minor' ? submission.tokensEarned : 0,
        message: notificationMessage,
        timestamp: new Date().toISOString(),
        read: false
      });
      
      alert("✅ Submission approved successfully! Student has been notified and tokens have been added.");
    } catch (error) {
      console.error("Error approving submission:", error);
      alert("Failed to approve submission. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (submissionId) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    
    if (!reason || !reason.trim()) {
      return;
    }

    setProcessingId(submissionId);
    
    try {
      const submission = submissions.find(s => s.id === submissionId);
      
      await updateProject(submissionId, {
        submissionStatus: 'rejected',
        rejectionReason: reason,
        reviewedAt: new Date().toISOString(),
        reviewedBy: JSON.parse(localStorage.getItem("lguUser") || "{}")?.name || "LGU Official"
      });
      
      // Create notification for student
      const { addDoc, collection } = await import('firebase/firestore');
      const { firestore } = await import('../firebase/config');
      
      await addDoc(collection(firestore, 'notifications'), {
        type: 'rejection',
        studentId: submission.userId,
        studentName: submission.studentName,
        projectId: submissionId,
        missionTitle: submission.missionTitle,
        rejectionReason: reason,
        message: `Your ${submission.tier} project "${submission.missionTitle}" was not approved.`,
        timestamp: new Date().toISOString(),
        read: false
      });
      
      alert("❌ Submission rejected. Student will be notified.");
    } catch (error) {
      console.error("Error rejecting submission:", error);
      alert("Failed to reject submission. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    if (activeFilter === "All") return true;
    return s.submissionStatus?.toLowerCase() === activeFilter.toLowerCase();
  });

  const pendingCount = submissions.filter(s => s.submissionStatus === 'pending').length;
  const approvedCount = submissions.filter(s => s.submissionStatus === 'approved').length;
  const rejectedCount = submissions.filter(s => s.submissionStatus === 'rejected').length;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; }
        .filter-btn:hover { background: #F1F5F9 !important; }
        .submission-card:hover { border-color: #CBD5E1 !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <LGUSidebar activePath="/lgu/review" />

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "44px 52px 80px", marginLeft: "256px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => navigate("/lgu")}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#64748B", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dashboard
              </button>
              <span style={{ color: "#CBD5E1", fontSize: "12px" }}>/</span>
              <span style={{ fontSize: "12px", color: "#1E293B", fontWeight: "500" }}>Review Student Submissions</span>
            </div>
            <NotificationBell />
          </div>

          {/* Page Header */}
          <div style={{ marginBottom: "32px", animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500", marginBottom: "8px" }}>Student Work Review</p>
            <h1 style={{ fontSize: "28px", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "8px" }}>
              Review Submitted Projects
            </h1>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.75", maxWidth: "600px" }}>
              Review and approve student project submissions. Students will be notified of your decision.
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            <div style={{ background: "#FFF8F0", border: "1px solid #FDE8C8", borderRadius: "10px", padding: "20px" }}>
              <div style={{ fontSize: "11px", color: "#B45309", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600", marginBottom: "8px" }}>Pending Review</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#B45309" }}>{pendingCount}</div>
            </div>
            <div style={{ background: "#EEFAF0", border: "1px solid #C6E8CE", borderRadius: "10px", padding: "20px" }}>
              <div style={{ fontSize: "11px", color: "#2E7D32", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600", marginBottom: "8px" }}>Approved</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#2E7D32" }}>{approvedCount}</div>
            </div>
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "20px" }}>
              <div style={{ fontSize: "11px", color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600", marginBottom: "8px" }}>Rejected</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#DC2626" }}>{rejectedCount}</div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            {STATUS_FILTERS.map(filter => (
              <button
                key={filter}
                className="filter-btn"
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: "8px 16px",
                  background: activeFilter === filter ? "#0F172A" : "#FFFFFF",
                  color: activeFilter === filter ? "#FFFFFF" : "#64748B",
                  border: `1px solid ${activeFilter === filter ? "#0F172A" : "#E2E8F0"}`,
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  transition: "all 0.2s"
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#0F172A", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
              <p style={{ fontSize: "14px", color: "#64748B" }}>Loading submissions...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSubmissions.length === 0 && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A", marginBottom: "8px" }}>
                No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} submissions
              </h3>
              <p style={{ fontSize: "13px", color: "#64748B" }}>
                {activeFilter === "Pending" 
                  ? "No pending submissions to review at the moment."
                  : `No ${activeFilter.toLowerCase()} submissions found.`
                }
              </p>
            </div>
          )}

          {/* Submissions List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredSubmissions.map((submission) => {
              const isExpanded = expandedId === submission.id;
              const isProcessing = processingId === submission.id;
              const statusColor = {
                pending: { bg: "#FFF8F0", border: "#FDE8C8", text: "#B45309" },
                approved: { bg: "#EEFAF0", border: "#C6E8CE", text: "#2E7D32" },
                rejected: { bg: "#FEF2F2", border: "#FCA5A5", text: "#DC2626" }
              }[submission.submissionStatus] || { bg: "#F1F5F9", border: "#E2E8F0", text: "#64748B" };

              return (
                <div key={submission.id} className="submission-card" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden", transition: "all 0.2s" }}>
                  <div onClick={() => setExpandedId(isExpanded ? null : submission.id)} style={{ padding: "20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "10px", fontWeight: "600", color: statusColor.text, background: statusColor.bg, border: `1px solid ${statusColor.border}`, padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {submission.submissionStatus}
                        </span>
                        <span style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {submission.tier} Project
                        </span>
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A", marginBottom: "6px" }}>
                        {submission.missionTitle || "Untitled Project"}
                      </h3>
                      <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "8px" }}>
                        <strong style={{ color: "#475569" }}>Student:</strong> {submission.studentName} • {submission.studentLRN}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>
                        <strong style={{ color: "#475569" }}>School:</strong> {submission.school}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                        <strong style={{ color: "#475569" }}>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: "#94A3B8" }}>
                        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px", borderTop: "1px solid #F1F5F9" }}>
                      <div style={{ paddingTop: "20px" }}>
                        {/* Mission Details */}
                        <div style={{ marginBottom: "20px" }}>
                          <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Mission Details</h4>
                          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "16px" }}>
                            <div style={{ fontSize: "13px", color: "#475569", marginBottom: "8px" }}>
                              <strong>Category:</strong> {submission.missionCategory || "N/A"}
                            </div>
                            <div style={{ fontSize: "13px", color: "#475569", marginBottom: "8px" }}>
                              <strong>Location:</strong> {submission.missionBarangay}, {submission.missionCity}
                            </div>
                            <div style={{ fontSize: "13px", color: "#475569" }}>
                              <strong>Subject:</strong> {submission.subject}
                            </div>
                          </div>
                        </div>

                        {/* Student Work */}
                        <div style={{ marginBottom: "20px" }}>
                          <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Submitted Work</h4>
                          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "16px" }}>
                            <div style={{ fontSize: "13px", color: "#475569", marginBottom: "8px" }}>
                              <strong>File:</strong> {submission.fileName || "No file uploaded"}
                            </div>
                            {submission.fileSize && (
                              <div style={{ fontSize: "13px", color: "#475569", marginBottom: "8px" }}>
                                <strong>Size:</strong> {(submission.fileSize / 1024).toFixed(2)} KB
                              </div>
                            )}
                            <div style={{ fontSize: "13px", color: "#475569" }}>
                              <strong>AI Grade:</strong> {submission.grade || "N/A"}
                            </div>
                          </div>
                        </div>

                        {/* AI Analysis */}
                        {submission.aiAnalysis && (
                          <div style={{ marginBottom: "20px" }}>
                            <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>AI Analysis</h4>
                            <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: "8px", padding: "16px" }}>
                              <div style={{ fontSize: "13px", color: "#4C1D95", lineHeight: "1.6" }}>
                                {submission.aiAnalysis.feedback || "No feedback available"}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rejection Reason */}
                        {submission.submissionStatus === 'rejected' && submission.rejectionReason && (
                          <div style={{ marginBottom: "20px" }}>
                            <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Rejection Reason</h4>
                            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", padding: "16px" }}>
                              <div style={{ fontSize: "13px", color: "#991B1B", lineHeight: "1.6" }}>
                                {submission.rejectionReason}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons - Only show for pending submissions */}
                        {submission.submissionStatus === 'pending' && (
                          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button
                              onClick={() => handleApprove(submission.id)}
                              disabled={isProcessing}
                              style={{
                                flex: 1,
                                padding: "12px 20px",
                                background: isProcessing ? "#CBD5E1" : "#22C55E",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              {isProcessing ? "Processing..." : "✓ Approve Submission"}
                            </button>
                            <button
                              onClick={() => handleReject(submission.id)}
                              disabled={isProcessing}
                              style={{
                                flex: 1,
                                padding: "12px 20px",
                                background: isProcessing ? "#CBD5E1" : "#FFFFFF",
                                color: isProcessing ? "#94A3B8" : "#DC2626",
                                border: `1px solid ${isProcessing ? "#CBD5E1" : "#DC2626"}`,
                                borderRadius: "6px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              {isProcessing ? "Processing..." : "✕ Reject Submission"}
                            </button>
                          </div>
                        )}

                        {/* Review Info - Show for approved/rejected */}
                        {(submission.submissionStatus === 'approved' || submission.submissionStatus === 'rejected') && submission.reviewedBy && (
                          <div style={{ marginTop: "16px", padding: "12px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "12px", color: "#64748B" }}>
                            Reviewed by <strong>{submission.reviewedBy}</strong> on {new Date(submission.reviewedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
