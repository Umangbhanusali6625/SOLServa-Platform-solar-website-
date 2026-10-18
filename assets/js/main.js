/**
 * SOLSERVA GREENTECH PRIVATE LIMITED
 * Official Web Application Orchestrator v3.0
 * Modular Architecture: nav.js, modals.js, calculator.js, forms.js
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initNavbar === 'function') initNavbar();
  if (typeof initScrollEffects === 'function') initScrollEffects();
  if (typeof initModalBackdrops === 'function') initModalBackdrops();
  if (typeof initCalculator === 'function') initCalculator();
  if (typeof initServiceTabs === 'function') initServiceTabs();
  if (typeof initFaqAccordion === 'function') initFaqAccordion();
  if (typeof initFormSubmissions === 'function') initFormSubmissions();
  
  // Highlight active nav item based on current page pathname
  highlightActiveNavLink();

  // Initialize DPDP & Cookie Compliance Banner
  initCookieBanner();
});

// 1. PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('[SOLServa PWA] Service Worker active with scope:', reg.scope);
      })
      .catch(err => {
        console.warn('[SOLServa PWA] Service Worker registration failed:', err);
      });
  });
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0];
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else if (linkPath && linkPath !== currentPath && !link.classList.contains('active-override')) {
      link.classList.remove('active');
    }
  });
}

/**
 * 2. COOKIE & PRIVACY COMPLIANCE BANNER
 * Compliant with Digital Personal Data Protection (DPDP) Act 2023 & Indian IT Regulations
 */
function initCookieBanner() {
  const CONSENT_KEY = 'solserva_cookie_consent_v1';
  if (localStorage.getItem(CONSENT_KEY)) return;

  let banner = document.getElementById('cookieBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner-wrapper';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Privacy and Cookie Consent');
    banner.innerHTML = `
      <div class="cookie-content">
        <div class="cookie-icon" aria-hidden="true">🛡️</div>
        <div class="cookie-text">
          <strong>Privacy &amp; Data Transparency</strong>
          We utilize essential telemetry cookies to ensure encrypted session integrity, verify plant compatibility, and analyze telemetry performance in compliance with India's Digital Personal Data Protection (DPDP) Act, 2023. Read our <a href="javascript:void(0)" onclick="openPrivacyModal()">Privacy Policy</a>.
        </div>
      </div>
      <div class="cookie-actions">
        <button type="button" class="btn-cookie-essential" id="btnCookieEssential">Essential Only</button>
        <button type="button" class="btn-cookie-accept" id="btnCookieAccept">Accept All</button>
      </div>
    `;
    document.body.appendChild(banner);
  }

  // Smooth entrance
  setTimeout(() => {
    banner.classList.add('show');
  }, 850);

  const btnAccept = document.getElementById('btnCookieAccept');
  const btnEssential = document.getElementById('btnCookieEssential');

  if (btnAccept) {
    btnAccept.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'all');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 450);
    });
  }

  if (btnEssential) {
    btnEssential.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'essential');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 450);
    });
  }
}

function openPrivacyModal() {
  if (typeof openModal === 'function') {
    openModal('legalModal_privacy');
  } else {
    window.location.href = 'about.html';
  }
}
window.openPrivacyModal = openPrivacyModal;
