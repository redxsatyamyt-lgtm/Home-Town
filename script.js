// SPA Tab Switching Logic
function switchTab(tabId) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active status from all navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Display selected section
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Highlight active nav button
    const activeNavBtn = Array.from(navButtons).find(btn => 
        btn.getAttribute('onclick').includes(tabId)
    );
    if (activeNavBtn) {
        activeNavBtn.classList.add('active');
    }

    // Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// MAKE SWITCHTAB GLOBAL FOR HTML
window.switchTab = switchTab;

// ==========================================
// FIREBASE SE DYNAMIC MODS LOAD KARNE KA CODE
// ==========================================
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function loadDynamicMods() {
    if (!window.db) {
        setTimeout(loadDynamicMods, 500); // DB initialize hone tak wait karega
        return;
    }

    const q = query(collection(window.db, "mods_data"), orderBy("createdAt", "desc"));

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
    });
}

// Page load hote hi run hoga
document.addEventListener("DOMContentLoaded", loadDynamicMods);
