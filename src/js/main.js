/**
 * MCV Teknik - Main JavaScript
 * Handles interactivity, animations, and UI components
 */

(function () {
    'use strict';

    // ========== MOBILE MENU ==========
    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.navbar-nav');

        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
                toggle.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }

    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.navbar').offsetHeight || 0;
                    const targetPosition = target.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========== NAVBAR SCROLL EFFECT ==========
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollIndicator = document.getElementById('scrollIndicator');
        if (!navbar) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function () {
            const currentScroll = window.scrollY;

            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show scroll indicator based on scroll position
            if (scrollIndicator) {
                if (currentScroll > 50) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            }

            lastScroll = currentScroll;
        });
    }

    // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');

                    // Trigger counter animation if it's a stat
                    if (entry.target.classList.contains('stat-card')) {
                        animateCounter(entry.target.querySelector('.stat-number'));
                    }
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll, .glass-card, .stat-card, .value-card').forEach(function (el) {
            el.classList.add('animate-hidden');
            observer.observe(el);
        });
    }

    // ========== COUNTER ANIMATION ==========
    function animateCounter(element) {
        if (!element || element.dataset.animated) return;

        element.dataset.animated = 'true';

        const target = element.textContent;
        const numericPart = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/[0-9]/g, '');

        if (isNaN(numericPart)) return;

        const duration = 2000;
        const steps = 60;
        const increment = numericPart / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(function () {
            step++;
            current = Math.min(Math.round(increment * step), numericPart);
            element.textContent = current + suffix;

            if (step >= steps) {
                clearInterval(timer);
                element.textContent = target;
            }
        }, duration / steps);
    }

    // ========== CONTACT FORM ==========
    function initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Lütfen tüm zorunlu alanları doldurun.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Lütfen geçerli bir e-posta adresi girin.');
                return;
            }

            // TODO: Send form data to server
            console.log('Form data:', data);
            alert('Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.');
            form.reset();
        });
    }

    // ========== LOGO CAROUSEL ==========
    function initLogoCarousel() {
        const carousel = document.querySelector('.logo-carousel');
        if (!carousel) return;

        // Duplicate logos for infinite scroll
        const logos = carousel.innerHTML;
        carousel.innerHTML = logos + logos;
    }

    // ========== CSS CLASSES FOR ANIMATIONS ==========
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-hidden {
                opacity: 0;
                transform: translateY(30px);
            }
            
            .animate-visible {
                opacity: 1;
                transform: translateY(0);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .navbar.scrolled {
                background: var(--glass-bg-hover);
                box-shadow: var(--shadow-md);
            }
            
            .navbar-nav.active {
                display: flex;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                flex-direction: column;
                background: var(--bg-primary);
                padding: var(--spacing-lg);
                border-bottom: 1px solid var(--glass-border);
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(5px, -5px);
            }
        `;
        document.head.appendChild(style);
    }

    // ========== ACTIVE SECTION DETECTION ==========
    function initActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        // Use scroll event for more precise control
        function updateActiveSection() {
            const scrollPosition = window.scrollY + window.innerHeight / 3;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;

            // Check if at bottom of page (for last section)
            const isAtBottom = window.scrollY + windowHeight >= documentHeight - 100;

            let currentSection = null;

            sections.forEach(function (section) {
                const sectionTop = section.offsetTop - 100;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section.getAttribute('id');
                }
            });

            // If at bottom, activate last section with nav link
            if (isAtBottom) {
                const lastSectionWithNav = Array.from(sections).reverse().find(function (section) {
                    return document.querySelector('.nav-link[href="#' + section.getAttribute('id') + '"]');
                });
                if (lastSectionWithNav) {
                    currentSection = lastSectionWithNav.getAttribute('id');
                }
            }

            // Update active class
            navLinks.forEach(function (link) {
                link.classList.remove('active');
            });

            if (currentSection) {
                const activeLink = document.querySelector('.nav-link[href="#' + currentSection + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }

        window.addEventListener('scroll', updateActiveSection);
        updateActiveSection(); // Initial call
    }

    // ========== INITIALIZE ==========
    function init() {
        document.addEventListener('DOMContentLoaded', function () {
            addAnimationStyles();
            initMobileMenu();
            initSmoothScroll();
            initNavbarScroll();
            initScrollAnimations();
            initContactForm();
            initLogoCarousel();
            initActiveSection();
        });
    }

    init();
})();
