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

// Sub-Filter Logic (Mods vs Texture Packs Filtering)
window.filterType = function(sectionId, filterType, btnElement) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Toggle Active State on Sub-Filter Buttons
    const btns = section.querySelectorAll('.sub-btn');
    btns.forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');

    // Filter Cards inside this section
    const cards = section.querySelectorAll('.glass-card');
    cards.forEach(card => {
        const badge = card.getAttribute('data-badge');
        if (filterType === 'all') {
            card.style.display = 'block';
        } else if (filterType === 'mod' && (badge === 'badge-mod' || badge === 'badge-perf' || badge === 'badge-pvp' || badge === 'badge-tool')) {
            card.style.display = 'block';
        } else if (filterType === 'resource' && badge === 'badge-resource') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

// Realtime Search Logic
window.searchCards = function() {
    const queryStr = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        const title = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : '';
        const desc = card.querySelector('p') ? card.querySelector('p').innerText.toLowerCase() : '';

        if (title.includes(queryStr) || desc.includes(queryStr)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

// Realtime Mods Fetcher from Firestore
function loadDynamicMods() {
    const q = query(collection(db, "mods_data"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        const homeGrid = document.querySelector("#home-cards-grid");
        const creatorsGrid = document.querySelector("#creators .cards-grid");
        const playersGrid = document.querySelector("#players .cards-grid");
        const toolsGrid = document.querySelector("#tools .cards-grid");

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
                    <div class="glass-card" data-badge="${badgeClass}">
                        <span class="badge ${badgeClass}">${badgeLabel}</span>
                        <h3>${data.title}</h3>
                        <p>${data.desc}</p>
                        <a href="${data.link}" target="_blank" class="card-link">Download →</a>
                    </div>
                `;

                // Section Placement Logic
                if (data.section === "home" && homeGrid) {
                    homeGrid.insertAdjacentHTML("afterbegin", cardHTML);
                } else if (data.section === "creators" && creatorsGrid) {
                    creatorsGrid.insertAdjacentHTML("afterbegin", cardHTML);
                } else if (data.section === "players" && playersGrid) {
                    playersGrid.insertAdjacentHTML("afterbegin", cardHTML);
                } else if (data.section === "tools" && toolsGrid) {
                    toolsGrid.insertAdjacentHTML("afterbegin", cardHTML);
                }
            }
        });
    }, (error) => {
        console.error("Firebase fetch error: ", error);
    });
}

// Execute on load
document.addEventListener("DOMContentLoaded", loadDynamicMods);
