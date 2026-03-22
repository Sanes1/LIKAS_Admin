// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyjJMr96wvlOckwJtmnpjZLFTQC9Wn1V8",
  authDomain: "likas-95ad5.firebaseapp.com",
  databaseURL: "https://likas-95ad5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "likas-95ad5",
  storageBucket: "likas-95ad5.firebasestorage.app",
  messagingSenderId: "9475909484",
  appId: "1:9475909484:web:0321b6cd8cfb7847bd3549",
  measurementId: "G-YQZ6FEYXES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
