import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    console.log("🔔 Setting up notifications listener...");
    const notificationsRef = collection(db, 'notifications');
    
    const unsubscribe = onSnapshot(
      notificationsRef, 
      (snapshot) => {
        const notifArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        console.log(`📬 Loaded ${notifArray.length} notifications`);
        setNotifications(notifArray);
      },
      (error) => {
        console.error("❌ Error listening to notifications:", error);
        setNotifications([]);
      }
    );

    return () => {
      console.log("🔌 Cleaning up notifications listener");
      unsubscribe();
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearNotification = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error("Error clearing notification:", error);
    }
  };

  const handleNotificationClick = (notif) => {
    // Mark as read
    if (!notif.read) {
      markAsRead(notif.id);
    }
    
    // Navigate based on notification type
    if (notif.type === 'submission') {
      setShowNotifications(false);
      navigate('/lgu/review');
    } else if (notif.type === 'mission_accepted') {
      setShowNotifications(false);
      navigate('/lgu/missions');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'submission':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8l2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      case 'mission_accepted':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L3 5v7h3V9h4v3h3V5L8 2z" fill="currentColor"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
    }
  };

  const getNotificationTitle = (notif) => {
    switch (notif.type) {
      case 'submission':
        return '📝 New Project Submission';
      case 'mission_accepted':
        return '✓ Student Accepted Mission';
      default:
        return 'Notification';
    }
  };

  const getNotificationMessage = (notif) => {
    switch (notif.type) {
      case 'submission':
        return (
          <>
            <span style={{ fontWeight: "500" }}>{notif.studentName}</span> submitted a project for{' '}
            <span style={{ fontWeight: "500" }}>{notif.missionTitle}</span>. Click to review.
          </>
        );
      case 'mission_accepted':
        return (
          <>
            <span style={{ fontWeight: "500" }}>{notif.studentName}</span> accepted{' '}
            <span style={{ fontWeight: "500" }}>{notif.projectTitle || notif.missionTitle}</span>
          </>
        );
      default:
        return notif.message || 'You have a new notification';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .notif-item:hover { background: #F8FAFC !important; }
        .clear-btn:hover { background: #FEE2E2 !important; color: #DC2626 !important; border-color: #FCA5A5 !important; }
      `}</style>

      {/* Notification Bell Button */}
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          width: "40px",
          height: "40px",
          background: "#FFFFFF", 
          border: "1px solid #E2E8F0", 
          borderRadius: "8px", 
          cursor: "pointer",
          transition: "all 0.2s",
          position: "relative",
          zIndex: 9999999,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "#2563EB";
          e.currentTarget.style.background = "#F0F9FF";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "#E2E8F0";
          e.currentTarget.style.background = "#FFFFFF";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M13.5 6A4.5 4.5 0 004.5 6c0 5.25-2.25 6.75-2.25 6.75h13.5S13.5 11.25 13.5 6zM10.3 15.75a1.5 1.5 0 01-2.6 0" stroke="#475569" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {unreadCount > 0 && (
          <div style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "#EF4444",
            color: "#FFFFFF",
            fontSize: "10px",
            fontWeight: "700",
            minWidth: "20px",
            height: "20px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #F8FAFC",
            padding: "0 5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            animation: "pulse 2s infinite",
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && createPortal(
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setShowNotifications(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999998,
            }}
          />
          
          {/* Notification Panel */}
          <div style={{
            position: "fixed",
            top: "80px",
            right: "52px",
            width: "420px",
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
            zIndex: 9999999,
            maxHeight: "520px",
            display: "flex",
            flexDirection: "column",
            animation: "slideDown 0.25s ease both",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {/* Header */}
            <div style={{
              padding: "18px 20px",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginBottom: "2px" }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <p style={{ fontSize: "11px", color: "#64748B" }}>
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Notifications List */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "60px 20px", textAlign: "center" }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#F1F5F9",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: "#475569", marginBottom: "4px" }}>
                    No notifications yet
                  </p>
                  <p style={{ fontSize: "12px", color: "#94A3B8" }}>
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div style={{ padding: "8px" }}>
                  {notifications.map((notif, idx) => (
                    <div 
                      key={notif.id}
                      className="notif-item"
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        background: notif.read ? "#FFFFFF" : "#F0F9FF",
                        marginBottom: idx < notifications.length - 1 ? "6px" : "0",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        border: notif.read ? "1px solid transparent" : "1px solid #BFDBFE",
                      }}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        {/* Icon */}
                        <div style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: notif.read ? "#F1F5F9" : "#DBEAFE",
                          color: notif.read ? "#94A3B8" : "#2563EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {getNotificationIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A", lineHeight: "1.3" }}>
                              {getNotificationTitle(notif)}
                            </span>
                            {!notif.read && (
                              <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#2563EB",
                                flexShrink: 0,
                                marginTop: "2px",
                                animation: "pulse 2s infinite",
                              }} />
                            )}
                          </div>
                          
                          <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", marginBottom: "10px" }}>
                            {getNotificationMessage(notif)}
                          </p>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                              {new Date(notif.timestamp).toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}
                            </span>
                            <button
                              className="clear-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearNotification(notif.id);
                              }}
                              style={{
                                padding: "4px 10px",
                                background: "#FFFFFF",
                                border: "1px solid #E2E8F0",
                                borderRadius: "5px",
                                fontSize: "10px",
                                fontWeight: "500",
                                color: "#64748B",
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
