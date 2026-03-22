export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "400px",
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
      
      <div style={{ 
        width: "48px", 
        height: "48px", 
        border: "3px solid #E2E8F0", 
        borderTopColor: "#2563EB", 
        borderRadius: "50%", 
        animation: "spin 0.8s linear infinite",
        marginBottom: "16px"
      }} />
      
      <p style={{ 
        fontSize: "13px", 
        color: "#64748B", 
        fontWeight: "500",
        animation: "pulse 1.5s ease-in-out infinite"
      }}>
        {message}
      </p>
    </div>
  );
}
