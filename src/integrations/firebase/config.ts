
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3Iyl1mKX6XTxdVyE8-WYYVJH7IWtaa3Y",
  authDomain: "misterchoma-57888.firebaseapp.com",
  databaseURL: "https://misterchoma-57888-default-rtdb.firebaseio.com",
  projectId: "misterchoma-57888",
  storageBucket: "misterchoma-57888.firebasestorage.app",
  messagingSenderId: "351123284130",
  appId: "1:351123284130:web:0df650f219b2ea9c4477fb",
  measurementId: "G-7L6WSWW9D1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, analytics };
