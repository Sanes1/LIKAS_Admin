import { auth, firestore } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Convert Firebase error codes to user-friendly messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    // Authentication errors
    'auth/email-already-in-use': 'This email is already registered. Please sign in or use a different email.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials and try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later or reset your password.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
    
    // Firestore errors
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested data was not found.',
    'already-exists': 'This data already exists.',
    'resource-exhausted': 'Too many requests. Please try again later.',
    'failed-precondition': 'Operation failed. Please try again.',
    'aborted': 'Operation was aborted. Please try again.',
    'out-of-range': 'Invalid data range.',
    'unimplemented': 'This feature is not yet implemented.',
    'internal': 'Internal error occurred. Please try again later.',
    'unavailable': 'Service is temporarily unavailable. Please try again later.',
    'data-loss': 'Data loss occurred. Please contact support.',
    'unauthenticated': 'Please sign in to continue.',
    'invalid-argument': 'Invalid data provided. Please check your input.',
    'deadline-exceeded': 'Request timeout. Please try again.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Register new student
export const registerStudent = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save student data to Firestore
    await setDoc(doc(firestore, 'students', user.uid), {
      username: userData.username,
      lrn: userData.lrn,
      school: userData.school,
      email: email,
      tokens: 0,
      createdAt: serverTimestamp()
    });
    
    return { success: true, user };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Login student
export const loginStudent = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get student data from Firestore
    const studentRef = doc(firestore, 'students', user.uid);
    const snapshot = await getDoc(studentRef);
    
    if (snapshot.exists()) {
      return { success: true, user, data: snapshot.data() };
    } else {
      return { 
        success: false, 
        error: 'Account data not found. Please contact support.' 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Logout student
export const logoutStudent = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Update password
export const updatePassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user is currently signed in.' };
    }
    
    const { updatePassword: firebaseUpdatePassword } = await import('firebase/auth');
    await firebaseUpdatePassword(user, newPassword);
    
    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Re-authenticate user (required before password change)
export const reauthenticateUser = async (currentPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user is currently signed in.' };
    }
    
    const { EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    return { success: true };
  } catch (error) {
    console.error('Re-authentication error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};
