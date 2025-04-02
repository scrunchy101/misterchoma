
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3Iyl1mKX6XTxdVyE8-WYYVJH7IWtaa3Y",
  authDomain: "misterchoma-57888.firebaseapp.com",
  databaseURL: "https://misterchoma-57888-default-rtdb.firebaseio.com",
  projectId: "misterchoma-57888",
  storageBucket: "misterchoma-57888.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "351123284130",
  appId: "1:351123284130:web:0df650f219b2ea9c4477fb",
  measurementId: "G-7L6WSWW9D1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with better error handling
let db;
try {
  db = getFirestore(app);
  console.log("Firestore initialized successfully");
} catch (error) {
  console.error("Error initializing Firestore:", error);
  // Create a fallback db reference that will report errors when used
  db = null;
}

// Initialize Auth
let auth;
try {
  auth = getAuth(app);
  console.log("Firebase Auth initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Auth:", error);
  auth = null;
}

// Initialize Analytics only in browser environment
let analytics = null;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized successfully");
  }
} catch (error) {
  console.error("Error initializing Firebase Analytics:", error);
}

export { app, db, auth, analytics };
