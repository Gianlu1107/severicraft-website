// ==================
//   NAVBAR MOBILE
// ==================

const navbars = document.querySelector('.navbars-bars');
const navMobileMenu = document.querySelector('.nav-mobile-menu');

navbars.addEventListener('click', () => {
    navbars.classList.toggle('active');
    navMobileMenu.classList.toggle('active');
});

// =====================
//     LOGO NAV PRINCIPALE
// =====================

const navinicial = document.querySelector('.nav-logo');

navinicial.addEventListener('click', () => {
    window.location.href = "../HTML/Index.html";
});

// =====================
//   NASCONDI SPINNER AL CARICAMENTO
// =====================

window.addEventListener('load', () => {
    const loader = document.getElementById('loading');
    if (loader) {
        loader.style.transition = 'opacity 0.5s ease';
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
});
