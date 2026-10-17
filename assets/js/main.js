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
});

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
