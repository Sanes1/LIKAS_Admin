import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const studentData = localStorage.getItem('studentData');
  
  if (!studentData) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
