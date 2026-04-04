(function () {
    function isProjectTemplatePage() {
        return window.location.pathname.endsWith('project-template.html');
    }

    function ensurePremiumBodyClass() {
        if (!document.body || isProjectTemplatePage()) {
            return false;
        }

        document.body.classList.add('ei-site');
        return true;
    }

    function markRevealTargets() {
        const targets = document.querySelectorAll([
            '.hero-content',
            '.section-header',
            '.contact-intro',
            '.projects-intro',
            '.year-badge',
            '.about-card',
            '.info-card',
            '.contact-container',
            '.president-card',
            '.exec-card',
            '.dept-card',
            '.advisor-card',
            '.team-section',
            '.team-head',
            '.team-member',
            '.section-content',
            '.section-text',
            '.section-image',
            '.team-link-section',
            '.cta-section',
            '.sky-ui-hint',
            '.sky-tool-bar',
            '.social-links',
            '.tile.reveal',
            '.fade-section',
        ].join(', '));

        return Array.from(targets).filter((element) => {
            if (element.closest('.mobile-menu-overlay') || element.closest('.dropdown-menu')) {
                return false;
            }

            return !element.classList.contains('ei-reveal');
        });
    }

    function initRevealAnimations() {
        if (window.__eiRevealBound) {
            return;
        }

        if (!ensurePremiumBodyClass()) {
            return;
        }

        const revealTargets = markRevealTargets();
        if (revealTargets.length === 0) {
            document.body.classList.add('ei-ready');
            window.__eiRevealBound = true;
            return;
        }

        revealTargets.forEach((element, index) => {
            element.classList.add('ei-reveal');
            element.style.setProperty('--ei-reveal-delay', `${Math.min(index * 55, 360)}ms`);
        });

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!('IntersectionObserver' in window) || prefersReducedMotion) {
            revealTargets.forEach((element) => {
                element.classList.add('is-visible');
            });
            document.body.classList.add('ei-ready');
            window.__eiRevealBound = true;
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.14,
            rootMargin: '0px 0px -8% 0px',
        });

        revealTargets.forEach((element) => {
            observer.observe(element);
        });

        document.body.classList.add('ei-ready');
        window.__eiRevealBound = true;
    }

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
        ensurePremiumBodyClass();
        initNavbarScroll();
        initDropdownMenus();
        initMobileMenu();
        initRevealAnimations();
    }

    document.addEventListener('shared-header-loaded', initializeSharedSiteUI);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSharedSiteUI);
    } else {
        initializeSharedSiteUI();
    }

    window.initializeSharedSiteUI = initializeSharedSiteUI;
})();