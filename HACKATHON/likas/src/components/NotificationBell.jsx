import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    // Get student ID from localStorage
    const studentData = JSON.parse(localStorage.getItem("studentData") || "{}");
    if (studentData.uid) {
      setStudentId(studentData.uid);
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;

    console.log("🔔 Setting up notification listener for student:", studentId);

    // Listen to notifications for this student
    const notificationsRef = collection(firestore, "notifications");
    const q = query(
      notificationsRef,
      where("studentId", "==", studentId),
      where("type", "in", ["approval", "rejection"])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs = [];
        snapshot.forEach((doc) => {
          notifs.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by timestamp (newest first)
        notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        console.log(`📬 Received ${notifs.length} notifications`);
        setNotifications(notifs);
      },
      (error) => {
        console.error("❌ Error listening to notifications:", error);
      }
    );

    return () => unsubscribe();
  }, [studentId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notifRef = doc(firestore, "notifications", notificationId);
      await updateDoc(notifRef, { read: true });
      console.log("✅ Notification marked as read");
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  const handleClearNotification = async (notificationId) => {
    try {
      const notifRef = doc(firestore, "notifications", notificationId);
      await deleteDoc(notifRef);
      console.log("✅ Notification deleted");
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      for (const notif of notifications) {
        await handleClearNotification(notif.id);
      }
      console.log("✅ All notifications cleared");
    } catch (error) {
      console.error("❌ Error clearing all notifications:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          position: "relative",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid #E2E8F0",
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        <Bell size={18} color="#64748B" />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#EF4444",
            color: "#FFFFFF",
            fontSize: "11px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 2s infinite"
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: "absolute",
          top: "50px",
          right: 0,
          width: "380px",
          maxHeight: "500px",
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          zIndex: 1000,
          overflow: "hidden"
        }}>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>

          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px"
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#94A3B8"
              }}>
                <Bell size={32} color="#CBD5E1" style={{ margin: "0 auto 12px" }} />
                <p style={{ fontSize: "13px" }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isApproval = notif.type === "approval";
                const bgColor = isApproval ? "#F0FDF4" : "#FEF2F2";
                const borderColor = isApproval ? "#BBF7D0" : "#FECACA";
                const textColor = isApproval ? "#166534" : "#991B1B";
                const icon = isApproval ? "✓" : "✕";

                return (
                  <div
                    key={notif.id}
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid #F1F5F9",
                      background: notif.read ? "#FFFFFF" : "#F8FAFC",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: bgColor,
                        border: `1px solid ${borderColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        color: textColor,
                        flexShrink: 0
                      }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#0F172A",
                          marginBottom: "4px"
                        }}>
                          Project {isApproval ? "Approved" : "Rejected"}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: "#64748B",
                          marginBottom: "4px",
                          lineHeight: "1.5"
                        }}>
                          {notif.message}
                        </div>
                        {notif.rejectionReason && (
                          <div style={{
                            fontSize: "12px",
                            color: "#991B1B",
                            background: "#FEF2F2",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            marginTop: "6px",
                            border: "1px solid #FECACA"
                          }}>
                            <strong>Reason:</strong> {notif.rejectionReason}
                          </div>
                        )}
                        <div style={{
                          fontSize: "11px",
                          color: "#94A3B8",
                          marginTop: "6px"
                        }}>
                          {new Date(notif.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearNotification(notif.id);
                        }}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "4px",
                          border: "none",
                          background: "transparent",
                          color: "#94A3B8",
                          cursor: "pointer",
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
