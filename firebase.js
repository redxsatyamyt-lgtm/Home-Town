// Firebase SDKs Import (via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDMnqwF7Q3S68PDjtKhYLSCdJUzTHSGgTw",
  authDomain: "verse-ai-cc1c6.firebaseapp.com",
  projectId: "verse-ai-cc1c6",
  storageBucket: "verse-ai-cc1c6.firebasestorage.app",
  messagingSenderId: "2670754048",
  appId: "1:2670754048:web:21808e7908bd8b5eaf1be5",
  measurementId: "G-N6LEMNS4M1"
};

// Initialize Firebase & Database
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

console.log("🔥 Firebase & Firestore Database Connected Successfully!");
