(function () {
    function ensureSharedThemeStylesheet() {
        const stylesheetId = 'ei-site-theme-styles';
        if (document.getElementById(stylesheetId)) {
            return;
        }

        const link = document.createElement('link');
        link.id = stylesheetId;
        link.rel = 'stylesheet';
        link.href = 'assets/css/site-theme.css';
        document.head.appendChild(link);
    }

    function ensureSharedHeaderStylesheet() {
        const stylesheetId = 'ei-shared-header-styles';
        if (document.getElementById(stylesheetId)) {
            return;
        }

        const link = document.createElement('link');
        link.id = stylesheetId;
        link.rel = 'stylesheet';
        link.href = 'assets/css/shared-header.css';
        document.head.appendChild(link);
    }

    async function mountSharedHeader(mount) {
        if (!mount || mount.dataset.sharedHeaderLoaded === 'true') {
            return;
        }

        try {
            const response = await fetch('partials/header.html', { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error('Failed to load shared header.');
            }

            mount.innerHTML = await response.text();
            mount.dataset.sharedHeaderLoaded = 'true';
            document.dispatchEvent(new Event('shared-header-loaded'));
        } catch (error) {
            console.error(error);
        }
    }

    function loadSharedHeader(mountSelector) {
        const selector = mountSelector || '#site-header';

        ensureSharedHeaderStylesheet();
        ensureSharedThemeStylesheet();

        const attemptLoad = () => {
            const mount = document.querySelector(selector);
            if (!mount) {
                return false;
            }

            void mountSharedHeader(mount);
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

    window.loadSharedHeader = loadSharedHeader;
})();
