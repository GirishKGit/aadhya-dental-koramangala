/* ============================
   AADHYA DENTAL CARE — KORAMANGALA
   Interactive Features
   Production Build — v1.0.0
   ============================ */

/* ---------- LOGGING SYSTEM ---------- */
const Logger = {
    _prefix: '[AADHYA]',
    _enabled: true,

    _format(module, level, message, data) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            level,
            module,
            message,
            ...(data ? { data } : {})
        };
        return entry;
    },

    info(module, message, data) {
        if (!this._enabled) return;
        const entry = this._format(module, 'INFO', message, data);
        console.log(`%c${this._prefix} [${module}] ${message}`, 'color: #4A8B7F; font-weight: 500', data || '');
        return entry;
    },

    warn(module, message, data) {
        const entry = this._format(module, 'WARN', message, data);
        console.warn(`${this._prefix} [${module}] ${message}`, data || '');
        return entry;
    },

    error(module, message, data) {
        const entry = this._format(module, 'ERROR', message, data);
        console.error(`${this._prefix} [${module}] ${message}`, data || '');
        return entry;
    },

    event(module, action, label, value) {
        const entry = this._format(module, 'EVENT', action, { label, value });
        console.log(`%c${this._prefix} [${module}] EVENT: ${action}`, 'color: #C4956A; font-weight: 600', { label, value });

        // Send to Google Analytics if available
        if (typeof gtag === 'function') {
            gtag('event', action, {
                event_category: module,
                event_label: label,
                value: value
            });
        }
        return entry;
    }
};

/* ---------- GLOBAL ERROR HANDLER ---------- */
window.onerror = function (message, source, lineno, colno, error) {
    Logger.error('GLOBAL', 'Uncaught error', {
        message,
        source,
        lineno,
        colno,
        stack: error?.stack
    });
    // Return false to allow default browser error handling
    return false;
};

window.addEventListener('unhandledrejection', function (event) {
    Logger.error('GLOBAL', 'Unhandled promise rejection', {
        reason: event.reason?.message || event.reason,
        stack: event.reason?.stack
    });
});

/* ---------- PERFORMANCE MONITORING ---------- */
const PerfMonitor = {
    marks: {},

    start(label) {
        this.marks[label] = performance.now();
    },

    end(label) {
        if (this.marks[label]) {
            const duration = (performance.now() - this.marks[label]).toFixed(2);
            Logger.info('PERF', `${label} completed`, { duration: `${duration}ms` });
            delete this.marks[label];
            return parseFloat(duration);
        }
    },

    reportWebVitals() {
        // Report Core Web Vitals using PerformanceObserver
        try {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                Logger.info('VITALS', 'LCP (Largest Contentful Paint)', {
                    value: `${lastEntry.startTime.toFixed(0)}ms`,
                    rating: lastEntry.startTime < 2500 ? 'GOOD' : lastEntry.startTime < 4000 ? 'NEEDS_IMPROVEMENT' : 'POOR'
                });
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    Logger.info('VITALS', 'FID (First Input Delay)', {
                        value: `${entry.processingStart - entry.startTime}ms`,
                        rating: (entry.processingStart - entry.startTime) < 100 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
                    });
                });
            });
            fidObserver.observe({ type: 'first-input', buffered: true });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                Logger.info('VITALS', 'CLS (Cumulative Layout Shift)', {
                    value: clsValue.toFixed(4),
                    rating: clsValue < 0.1 ? 'GOOD' : clsValue < 0.25 ? 'NEEDS_IMPROVEMENT' : 'POOR'
                });
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });

        } catch (e) {
            Logger.warn('VITALS', 'PerformanceObserver not fully supported', { error: e.message });
        }
    }
};

/* ---------- CTA EVENT TRACKER ---------- */
const CTATracker = {
    init() {
        // Track all CTA button clicks
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn, .floating-cta, .nav__cta, .cta-strip a, a[href^="tel:"]');
            if (!btn) return;

            const label = btn.textContent.trim().replace(/\s+/g, ' ');
            const href = btn.getAttribute('href') || '';
            let action = 'cta_click';

            // Categorize the CTA
            if (href.startsWith('tel:')) {
                action = 'phone_call';
            } else if (btn.classList.contains('floating-cta')) {
                action = 'floating_cta_click';
            } else if (btn.classList.contains('nav__cta')) {
                action = 'nav_booking_click';
            } else if (label.toLowerCase().includes('book') || label.toLowerCase().includes('schedule')) {
                action = 'booking_click';
            } else if (label.toLowerCase().includes('whatsapp')) {
                action = 'whatsapp_click';
            }

            Logger.event('CTA', action, label, 1);
        });

        Logger.info('CTA', 'CTA tracker initialized');
    }
};

/* ---------- APP INITIALIZATION ---------- */
document.addEventListener('DOMContentLoaded', () => {
    PerfMonitor.start('DOMContentLoaded');
    Logger.info('APP', 'Initializing Aadhya Dental Care — Koramangala', { version: '1.0.0' });

    try {
        initThemeToggle();
        initNavbar();
        initScrollAnimations();
        initTestimonialCarousel();
        initMobileMenu();
        initCountUp();
        initFloatingCTA();
        initSmoothScroll();
        CTATracker.init();
        PerfMonitor.reportWebVitals();

        PerfMonitor.end('DOMContentLoaded');
        Logger.info('APP', 'All modules initialized successfully');
    } catch (error) {
        Logger.error('APP', 'Initialization failed', { error: error.message, stack: error.stack });
    }
});

// Log page load timing
window.addEventListener('load', () => {
    const timing = performance.getEntriesByType('navigation')[0];
    if (timing) {
        Logger.info('PERF', 'Page load complete', {
            domContentLoaded: `${timing.domContentLoadedEventEnd.toFixed(0)}ms`,
            fullLoad: `${timing.loadEventEnd.toFixed(0)}ms`,
            domInteractive: `${timing.domInteractive.toFixed(0)}ms`,
            transferSize: `${(timing.transferSize / 1024).toFixed(1)}KB`
        });
    }
});

/* ---------- STICKY NAVBAR ---------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        Logger.warn('NAV', 'Navbar element not found');
        return;
    }

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('nav--scrolled');
        } else {
            navbar.classList.remove('nav--scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('nav__link--active');
            }
        });
    }, { passive: true });

    Logger.info('NAV', 'Navbar initialized');
}

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!fadeElements.length) {
        Logger.warn('ANIM', 'No fade-in elements found');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
    Logger.info('ANIM', `Scroll animations initialized for ${fadeElements.length} elements`);
}

/* ---------- TESTIMONIAL CAROUSEL ---------- */
function initTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    if (!track) {
        Logger.warn('CAROUSEL', 'Testimonial track not found');
        return;
    }

    const cards = track.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let totalSlides = Math.ceil(cards.length / cardsPerView);
    let autoPlayTimer;

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        totalSlides = Math.ceil(cards.length / cardsPerView);
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('testimonials__dot');
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function getCardsPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex >= totalSlides) currentIndex = 0;
        if (currentIndex < 0) currentIndex = totalSlides - 1;

        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginLeft) + parseInt(getComputedStyle(cards[0]).marginRight);
        const offset = currentIndex * cardsPerView * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        document.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', startAutoPlay);

    // Handle resize
    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        totalSlides = Math.ceil(cards.length / cardsPerView);
        createDots();
        goToSlide(0);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });

    // Initialize
    createDots();
    startAutoPlay();
    Logger.info('CAROUSEL', `Testimonial carousel initialized with ${cards.length} cards`);
}

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!hamburger || !mobileMenu) {
        Logger.warn('MENU', 'Mobile menu elements not found');
        return;
    }

    const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

    function toggleMenu() {
        const isOpening = !mobileMenu.classList.contains('active');
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';

        if (isOpening) {
            Logger.event('MENU', 'mobile_menu_open', 'hamburger', 1);
        }
    }

    hamburger.addEventListener('click', toggleMenu);

    // Keyboard support: close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.focus();
            Logger.info('MENU', 'Mobile menu closed via Escape key');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    Logger.info('MENU', 'Mobile menu initialized');
}

/* ---------- COUNT UP ANIMATION ---------- */
function initCountUp() {
    const numbers = document.querySelectorAll('.trust__number[data-count]');

    if (!numbers.length) {
        Logger.warn('COUNTUP', 'No count-up elements found');
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-count'));
                const isDecimal = el.hasAttribute('data-decimal');
                const duration = 2000;
                const start = performance.now();

                function animate(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = easeOut * target;

                    if (isDecimal) {
                        el.textContent = current.toFixed(1);
                    } else if (target >= 1000) {
                        el.textContent = Math.floor(current).toLocaleString() + '+';
                    } else {
                        el.textContent = Math.floor(current) + '+';
                    }

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }

                requestAnimationFrame(animate);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    numbers.forEach(num => observer.observe(num));
    Logger.info('COUNTUP', `Count-up animations initialized for ${numbers.length} elements`);
}

/* ---------- FLOATING CTA ---------- */
function initFloatingCTA() {
    const floatingCta = document.getElementById('floatingCta');
    if (!floatingCta) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
    }, { passive: true });

    Logger.info('CTA', 'Floating CTA initialized');
}

/* ---------- SMOOTH SCROLL ---------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                Logger.info('NAV', `Smooth scroll to ${href}`);
            }
        });
    });

    Logger.info('NAV', 'Smooth scroll initialized');
}

/* ---------- THEME TOGGLE (DARK MODE) ---------- */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) {
        Logger.warn('THEME', 'Theme toggle button not found');
        return;
    }

    const STORAGE_KEY = 'aadhya-theme';

    // Determine initial theme: localStorage > system preference > light
    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return stored;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        Logger.info('THEME', `Theme set to ${theme}`);
    }

    // Apply initial theme immediately
    setTheme(getPreferredTheme());

    // Toggle on click
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
        Logger.event('THEME', 'theme_toggle', next, 1);
    });

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    Logger.info('THEME', 'Theme toggle initialized');
}
