(function () {
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

    async function loadSharedHeader(mountSelector) {
        const mount = document.querySelector(mountSelector || '#site-header');
        if (!mount) return;

        ensureSharedHeaderStylesheet();

        try {
            const response = await fetch('partials/header.html', { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error('Failed to load shared header.');
            }

            mount.innerHTML = await response.text();
            document.dispatchEvent(new Event('shared-header-loaded'));
        } catch (error) {
            console.error(error);
        }
    }

    window.loadSharedHeader = loadSharedHeader;
})();
