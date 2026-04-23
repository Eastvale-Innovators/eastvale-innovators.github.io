/**
 * Page color transition system.
 * Each page stores its accent colors before navigation.
 * On load, CSS variables animate from the previous page's colors to this page's.
 */
(function () {
  const STORAGE_KEY = 'ei_prev_colors';

  // Expose a function pages call to declare their accent colors
  window.registerPageColors = function (colors) {
    // colors = { accent: '#c84b0a', accentHot: '#e8721a', bg: '#060f1e' }
    window._pageColors = colors;

    // Store for next page transition
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.includes('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
      } catch (_) {}
    }, { capture: true });
  };

  // On load, check if there's a previous page color and animate transition
  window.runColorTransition = function () {
    let prev = null;
    try { prev = JSON.parse(sessionStorage.getItem(STORAGE_KEY)); } catch (_) {}
    if (!prev || !window._pageColors) return;

    const curr = window._pageColors;

    // If same colors, skip
    if (prev.accent === curr.accent) return;

    // Create a full-screen overlay in the previous page's color
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 19999; pointer-events: none;
      background: ${prev.bg || '#060f1e'};
      opacity: 1; transition: opacity 0.9s cubic-bezier(.22,1,.36,1);
    `;
    document.body.appendChild(overlay);

    // Also inject a temporary gradient sweep in the old accent color
    const sweep = document.createElement('div');
    sweep.style.cssText = `
      position: fixed; inset: 0; z-index: 19998; pointer-events: none;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, ${hexToRgba(prev.accent, .35)} 0%, transparent 70%);
      opacity: 1; transition: opacity 1.2s cubic-bezier(.22,1,.36,1);
    `;
    document.body.appendChild(sweep);

    // Fade out after a brief hold
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.opacity = '0';
        sweep.style.opacity = '0';
        setTimeout(() => { overlay.remove(); sweep.remove(); }, 1300);
      });
    });
  };

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
})();
