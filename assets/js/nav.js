/**
 * SOLSERVA GREENTECH - NAVIGATION & SCROLL MODULE
 */
/* ===================================================================
   1. NAVBAR & NAVIGATION
   =================================================================== */
function initNavbar() {
  const toggleBtn = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navItems = document.querySelectorAll('.nav-item');

  function closeMobileNav() {
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
      if (toggleBtn) {
        toggleBtn.innerHTML = '&#9776;';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle('active');
      document.body.classList.toggle('nav-open', isActive);
      toggleBtn.innerHTML = isActive ? '&times;' : '&#9776;';
      toggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  }

  // Close when clicking outside menu
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
        closeMobileNav();
      }
    }
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  // Auto-close drawer if screen is resized to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeMobileNav();
    }
  });

  // Mobile dropdown toggle (matches CSS @media max-width: 1024px)
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');

    if (link && dropdown) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('mobile-open');
        }
      });
    }
  });

  // Close mobile nav when clicking normal nav links or dropdown links
  navMenu?.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', () => {
      // Don't close if it's the parent link opening the mobile dropdown
      if (window.innerWidth <= 1024 && anchor.classList.contains('nav-link') && anchor.parentElement?.querySelector('.dropdown-menu')) {
        return;
      }
      closeMobileNav();
    });
  });

  // Smooth scroll & same-page hash click handling
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const rawHref = this.getAttribute('href');
      if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:')) return;

      const [linkPath, hash] = rawHref.split('#');
      if (!hash) return;

      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const isSamePage = !linkPath || linkPath === currentPath || (linkPath === 'index.html' && (currentPath === '' || currentPath === 'index.html'));

      if (isSamePage) {
        let targetEl = null;
        try {
          targetEl = document.getElementById(hash) || document.querySelector(`#${hash}`);
        } catch (err) {}

        if (targetEl) {
          closeMobileNav();

          const dataTab = this.getAttribute('data-tab') || hash;
          if (dataTab && typeof switchServiceTab === 'function') {
            switchServiceTab(dataTab);
          }

          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', `#${hash}`);
          }
        }
      }
    });
  });
}


/* ===================================================================
   9. SCROLL EFFECTS & BACK TO TOP
   =================================================================== */
function initScrollEffects() {
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ===================================================================
   10. INSTANT PAGE TRANSITIONS & INTERACTION PREFETCH ENGINE
   =================================================================== */
function initInstantPageTransitions() {
  // If the browser natively supports Speculation Rules, it handles hover prefetching natively
  const hasNativeSpeculation =
    typeof HTMLScriptElement !== 'undefined' &&
    HTMLScriptElement.supports &&
    HTMLScriptElement.supports('speculationrules');

  const prefetched = new Set();

  function prefetchOnInteraction(url, isKeyboard = false) {
    if (!url) return;
    if (url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('tel:') || url.startsWith('mailto:')) return;
    if (url.startsWith('http') && !url.includes(window.location.hostname)) return;

    // Speculation Rules with moderate eagerness handles pointer hover/touch, but not keyboard focus.
    // If native Speculation Rules is active on hover/touch, let the browser handle it.
    if (hasNativeSpeculation && !isKeyboard) return;

    if (prefetched.has(url)) return;
    prefetched.add(url);

    // Fallback for keyboard focus and browsers without Speculation Rules (e.g. Safari / Firefox):
    // Single low-priority fetch into the Cache API
    if ('caches' in window) {
      fetch(url, { priority: 'low' }).then((res) => {
        if (res.ok) {
          caches.open('solserva-pwa-v7').then((cache) => cache.put(url, res));
        }
      }).catch(() => {});
    }
  }

  // Prefetch strictly upon navigation signals (hover, touchstart, or focus)
  const handleNavigationSignal = (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    const cleanUrl = href.split('#')[0];
    if (cleanUrl && cleanUrl.endsWith('.html')) {
      const isKeyboard = e.type === 'focusin';
      prefetchOnInteraction(cleanUrl, isKeyboard);
    }
  };

  document.addEventListener('mouseover', handleNavigationSignal, { passive: true });
  document.addEventListener('touchstart', handleNavigationSignal, { passive: true });
  document.addEventListener('focusin', handleNavigationSignal, { passive: true });
}
