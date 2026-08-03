import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyDMnqwF7Q3S68PDjtKhYLSCdJUzTHSGgTw",
  authDomain: "verse-ai-cc1c6.firebaseapp.com",
  projectId: "verse-ai-cc1c6",
  storageBucket: "verse-ai-cc1c6.firebasestorage.app",
  messagingSenderId: "2670754048",
  appId: "1:2670754048:web:21808e7908bd8b5eaf1be5",
  measurementId: "G-N6LEMNS4M1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// SPA Tab Switching Logic
function switchTab(tabId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => section.classList.remove('active'));

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    const targetSection = document.getElementById(tabId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const activeNavBtn = Array.from(navButtons).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)
    );
    if (activeNavBtn) {
        activeNavBtn.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make switchTab accessible everywhere in HTML
window.switchTab = switchTab;

// Realtime Mods Fetcher from Firestore
function loadDynamicMods() {
    const q = query(collection(db, "mods_data"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        const creatorsGrid = document.querySelector("#creators .cards-grid");
        const playersGrid = document.querySelector("#players .cards-grid");

        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                
                let badgeClass = "badge-mod";
                let badgeLabel = "MOD";
                
                if (data.badge === "badge-tool") { badgeClass = "badge-tool"; badgeLabel = "TOOL"; }
                else if (data.badge === "badge-resource") { badgeClass = "badge-resource"; badgeLabel = "RESOURCE"; }
                else if (data.badge === "badge-perf") { badgeClass = "badge-perf"; badgeLabel = "PERF"; }
                else if (data.badge === "badge-pvp") { badgeClass = "badge-pvp"; badgeLabel = "PVP"; }

                const cardHTML = `
                    <div class="glass-card">
                        <span class="badge ${badgeClass}">${badgeLabel}</span>
                        <h3>${data.title}</h3>
                        <p>${data.desc}</p>
                        <a href="${data.link}" target="_blank" class="card-link">Download →</a>
                    </div>
                `;

                if (data.section === "creators" && creatorsGrid) {
                    creatorsGrid.insertAdjacentHTML("afterbegin", cardHTML);
                } else if (data.section === "players" && playersGrid) {
                    playersGrid.insertAdjacentHTML("afterbegin", cardHTML);
                }
            }
        });
    }, (error) => {
        console.error("Firebase fetch error: ", error);
    });
}

// Execute on load
document.addEventListener("DOMContentLoaded", loadDynamicMods);
