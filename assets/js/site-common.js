(function () {
    function setMenuOpenState(mobileBtn, mobileMenu, isOpen) {
        mobileMenu.classList.toggle('active', isOpen);
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
            const firstLink = mobileMenu.querySelector('a, button');
            if (firstLink) {
                firstLink.focus();
            }
        }
    }

    function initDropdownMenus() {
        document.querySelectorAll('.nav-dropdown').forEach((dropdown, index) => {
            if (dropdown.dataset.dropdownBound === 'true') {
                return;
            }

            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!toggle || !menu) {
                return;
            }

            if (!menu.id) {
                menu.id = `nav-submenu-${index + 1}`;
            }
            toggle.setAttribute('aria-controls', menu.id);
            let closeTimer = null;

            const cancelScheduledClose = () => {
                if (closeTimer !== null) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
            };

            const openDropdown = () => {
                cancelScheduledClose();
                dropdown.classList.add('open');
                toggle.setAttribute('aria-expanded', 'true');
            };

            const closeDropdown = () => {
                dropdown.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            };

            const scheduleCloseDropdown = () => {
                cancelScheduledClose();
                closeTimer = setTimeout(() => {
                    closeDropdown();
                    closeTimer = null;
                }, 180);
            };

            dropdown.addEventListener('mouseenter', openDropdown);
            dropdown.addEventListener('mouseleave', scheduleCloseDropdown);
            dropdown.addEventListener('focusin', openDropdown);
            dropdown.addEventListener('focusout', () => {
                requestAnimationFrame(() => {
                    if (!dropdown.contains(document.activeElement)) {
                        scheduleCloseDropdown();
                    }
                });
            });

            toggle.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                    openDropdown();
                }
                if (event.key === 'Escape') {
                    cancelScheduledClose();
                    closeDropdown();
                    toggle.focus();
                }
            });

            menu.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    cancelScheduledClose();
                    closeDropdown();
                    toggle.focus();
                }
            });

            dropdown.dataset.dropdownBound = 'true';
        });
    }

    function initNavbarScroll() {
        if (window.__eiNavbarScrollBound) {
            return;
        }

        const onScroll = () => {
            const navbar = document.getElementById('navbar');
            if (!navbar) {
                return;
            }

            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        window.__eiNavbarScrollBound = true;
    }

    function initMobileMenu() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeBtn = document.querySelector('.close-menu-btn');

        if (!mobileBtn || !mobileMenu || !closeBtn || mobileBtn.dataset.menuBound === 'true') {
            return;
        }

        const onEscape = (event) => {
            if (event.key === 'Escape') {
                setMenuOpenState(mobileBtn, mobileMenu, false);
                mobileBtn.focus();
            }
        };

        const openMenu = () => {
            setMenuOpenState(mobileBtn, mobileMenu, true);
            document.addEventListener('keydown', onEscape);
        };

        const closeMenu = () => {
            setMenuOpenState(mobileBtn, mobileMenu, false);
            document.removeEventListener('keydown', onEscape);
        };

        mobileBtn.addEventListener('click', openMenu);

        closeBtn.addEventListener('click', closeMenu);

        mobileMenu.addEventListener('click', (event) => {
            if (event.target === mobileMenu) {
                closeMenu();
            }
        });

        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        mobileBtn.dataset.menuBound = 'true';
    }

    function initializeSharedSiteUI() {
        initNavbarScroll();
        initDropdownMenus();
        initMobileMenu();
    }

    document.addEventListener('shared-header-loaded', initializeSharedSiteUI);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSharedSiteUI);
    } else {
        initializeSharedSiteUI();
    }

    window.initializeSharedSiteUI = initializeSharedSiteUI;
})();