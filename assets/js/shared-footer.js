(function () {
    function ensureSharedFooterStylesheet() {
        const stylesheetId = 'ei-shared-footer-styles';
        if (document.getElementById(stylesheetId)) {
            return;
        }

        const link = document.createElement('link');
        link.id = stylesheetId;
        link.rel = 'stylesheet';
        link.href = 'assets/css/shared-footer.css';
        document.head.appendChild(link);
    }

    async function mountSharedFooter(mount) {
        if (!mount || mount.dataset.sharedFooterLoaded === 'true') {
            return;
        }

        try {
            const response = await fetch('partials/footer.html', { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error('Failed to load shared footer.');
            }

            mount.innerHTML = await response.text();
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