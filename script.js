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
