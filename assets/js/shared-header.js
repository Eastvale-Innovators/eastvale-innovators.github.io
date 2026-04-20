(function () {
  function ensureSharedHeaderStylesheet() {
    if (document.getElementById('ei-shared-header-styles')) return;
    const link = document.createElement('link');
    link.id = 'ei-shared-header-styles';
    link.rel = 'stylesheet';
    link.href = 'assets/css/shared-header.css';
    document.head.appendChild(link);
  }

  async function loadSharedHeader(mountSelector) {
    const mount = document.querySelector(mountSelector || '#site-header');
    if (!mount) return;
    ensureSharedHeaderStylesheet();
    try {
      const res = await fetch('partials/header.html', { cache: 'no-cache' });
      if (!res.ok) throw new Error('Failed to load shared header.');
      mount.innerHTML = await res.text();

      // Scrolled class
      const nav = document.getElementById('navbar');
      if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }

      // Mobile menu
      const mobileBtn = document.querySelector('.mobile-menu-btn');
      const mobileOverlay = document.getElementById('mobileMenu');
      const closeBtn = document.querySelector('.close-menu-btn');

      if (mobileBtn && mobileOverlay) {
        mobileBtn.addEventListener('click', () => {
          mobileOverlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      }

      const closeMobileMenu = () => {
        if (mobileOverlay) mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      };

      if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
      if (mobileOverlay) {
        mobileOverlay.querySelectorAll('.mobile-main-link, .mobile-sub-link').forEach(link => {
          link.addEventListener('click', closeMobileMenu);
        });
      }

      document.dispatchEvent(new Event('shared-header-loaded'));
    } catch (err) {
      console.error(err);
    }
  }

  window.loadSharedHeader = loadSharedHeader;
})();
