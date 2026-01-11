/**
 * MCV Teknik - Theme Toggle
 * Handles light/dark mode switching with localStorage persistence
 */

(function () {
    'use strict';

    const THEME_KEY = 'mcv-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    // Get stored theme or system preference
    function getStoredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK;
        }
        return LIGHT;
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggleIcon(theme);
    }

    // Update toggle button icon
    function updateToggleIcon(theme) {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('i');
        if (!icon) return;

        if (theme === DARK) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Toggle theme
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || LIGHT;
        const newTheme = current === DARK ? LIGHT : DARK;

        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
    }

    // Initialize
    function init() {
        // Apply stored theme immediately
        const theme = getStoredTheme();
        applyTheme(theme);

        // Add event listener to toggle button
        document.addEventListener('DOMContentLoaded', function () {
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', toggleTheme);
            }
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                if (!localStorage.getItem(THEME_KEY)) {
                    applyTheme(e.matches ? DARK : LIGHT);
                }
            });
        }
    }

    init();
})();
