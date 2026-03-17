(function () {
    async function loadSharedHeader(mountSelector) {
        const mount = document.querySelector(mountSelector || '#site-header');
        if (!mount) return;

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
