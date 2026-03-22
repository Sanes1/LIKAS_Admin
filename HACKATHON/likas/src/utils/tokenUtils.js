import { getStudentData } from '../services/firestoreService';

// Get current token count from Firestore
export const getCurrentTokens = async () => {
  const studentData = JSON.parse(localStorage.getItem("studentData") || "{}");
  if (studentData.uid) {
    const result = await getStudentData(studentData.uid);
    if (result.success) {
      return result.data.tokens || 0;
    }
  }
  return 0;
};

// Update token count in localStorage for quick access
export const updateLocalTokens = (tokens) => {
  localStorage.setItem('userTokens', tokens.toString());
};

// Listen for token updates across tabs/windows
export const onTokenUpdate = (callback) => {
  const handleStorageChange = (e) => {
    if (e.key === 'userTokens') {
      callback(parseInt(e.newValue || '0'));
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

// Refresh token count from Firestore and update localStorage
export const refreshTokens = async () => {
  const tokens = await getCurrentTokens();
  updateLocalTokens(tokens);
  return tokens;
};