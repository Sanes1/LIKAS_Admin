// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyjJMr96wvlOckwJtmnpjZLFTQC9Wn1V8",
  authDomain: "likas-95ad5.firebaseapp.com",
  projectId: "likas-95ad5",
  storageBucket: "likas-95ad5.firebasestorage.app",
  messagingSenderId: "9475909484",
  appId: "1:9475909484:web:0321b6cd8cfb7847bd3549",
  measurementId: "G-YQZ6FEYXES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);              // Firebase Authentication
const firestore = getFirestore(app);    // Firestore Database (for account storage)
const storage = getStorage(app);        // Firebase Storage (for file uploads)

export { app, analytics, auth, firestore, storage };
