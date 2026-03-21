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
        const accordionSections = mobileMenu ? mobileMenu.querySelectorAll('.mobile-accordion') : [];

        if (!mobileBtn || !mobileMenu || !closeBtn || mobileBtn.dataset.menuBound === 'true') {
            return;
        }

        const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const finishAccordionAnimation = (section) => {
            section.style.height = '';
            section.style.overflow = '';
            section.dataset.animating = 'false';
        };

        const animateAccordion = (section, openSection) => {
            if (section.dataset.animating === 'true') {
                return;
            }

            const summary = section.querySelector('.mobile-accordion-summary');
            if (!summary) {
                return;
            }

            if (motionReduced) {
                section.open = openSection;
                return;
            }

            section.dataset.animating = 'true';

            const startHeight = section.offsetHeight;

            if (openSection) {
                section.open = true;
            }

            const endHeight = openSection ? section.offsetHeight : summary.offsetHeight;

            section.style.overflow = 'hidden';
            section.style.height = `${startHeight}px`;
            // Force style flush before transitioning to the target height.
            section.offsetHeight;
            section.style.transition = 'height 240ms cubic-bezier(0.4, 0, 0.2, 1)';
            section.style.height = `${endHeight}px`;

            const onTransitionEnd = (event) => {
                if (event.propertyName !== 'height') {
                    return;
                }

                section.removeEventListener('transitionend', onTransitionEnd);
                section.style.transition = '';

                if (!openSection) {
                    section.open = false;
                }

                finishAccordionAnimation(section);
            };

            section.addEventListener('transitionend', onTransitionEnd);
        };

        accordionSections.forEach((section) => {
            const summary = section.querySelector('.mobile-accordion-summary');
            if (!summary) {
                return;
            }

            summary.addEventListener('click', (event) => {
                event.preventDefault();

                const shouldOpen = !section.open;

                if (shouldOpen) {
                    accordionSections.forEach((otherSection) => {
                        if (otherSection !== section && otherSection.open) {
                            animateAccordion(otherSection, false);
                        }
                    });
                }

                animateAccordion(section, shouldOpen);
            });
        });

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