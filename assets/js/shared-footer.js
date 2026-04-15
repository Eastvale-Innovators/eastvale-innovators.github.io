(function () {
    const SHARED_FOOTER_VERSION = '4-15-26';
    const LINKEDIN_ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

    function ensureVideshContributor(mount) {
        const creatorsLinks = mount.querySelector('.footer-creators-links');
        if (!creatorsLinks) {
            return;
        }

        const hasVidesh = Array.from(creatorsLinks.querySelectorAll('a.footer-name-link')).some((link) => {
            const href = (link.getAttribute('href') || '').toLowerCase();
            const text = (link.textContent || '').toLowerCase();
            return href.includes('videsh-k-ariv') || text.includes('videsh arivazhagan');
        });

        if (hasVidesh) {
            return;
        }

        const separator = document.createElement('span');
        separator.className = 'footer-creators-separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = '|';

        const link = document.createElement('a');
        link.href = 'https://linkedin.com/in/videsh-k-ariv';
        link.className = 'footer-name-link';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const name = document.createElement('span');
        name.className = 'footer-name';
        name.textContent = 'Videsh Arivazhagan';

        const icon = document.createElement('span');
        icon.className = 'footer-link-icon';
        icon.innerHTML = LINKEDIN_ICON_SVG;

        link.appendChild(name);
        link.appendChild(icon);
        creatorsLinks.appendChild(separator);
        creatorsLinks.appendChild(link);
    }

    function ensureSharedFooterStylesheet() {
        const stylesheetId = 'ei-shared-footer-styles';
        if (document.getElementById(stylesheetId)) {
            return;
        }

        const link = document.createElement('link');
        link.id = stylesheetId;
        link.rel = 'stylesheet';
        link.href = `assets/css/shared-footer.css?v=${SHARED_FOOTER_VERSION}`;
        document.head.appendChild(link);
    }

    async function mountSharedFooter(mount) {
        if (!mount || mount.dataset.sharedFooterLoaded === 'true') {
            return;
        }

        try {
            const response = await fetch(`partials/footer.html?v=${SHARED_FOOTER_VERSION}`, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Failed to load shared footer.');
            }

            mount.innerHTML = await response.text();
            ensureVideshContributor(mount);
            mount.dataset.sharedFooterLoaded = 'true';
            document.dispatchEvent(new Event('shared-footer-loaded'));
        } catch (error) {
            console.error(error);
        }
    }

    function loadSharedFooter(mountSelector) {
        const selector = mountSelector || '#site-footer';
        ensureSharedFooterStylesheet();

        const attemptLoad = () => {
            const mount = document.querySelector(selector);
            if (!mount) {
                return false;
            }

            void mountSharedFooter(mount);
            return true;
        };

        if (attemptLoad()) {
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                attemptLoad();
            }, { once: true });
            return;
        }

        requestAnimationFrame(() => {
            attemptLoad();
        });
    }

    window.loadSharedFooter = loadSharedFooter;
})();