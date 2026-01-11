/**
 * MCV Teknik - Cookie Consent Manager
 * KVKK uyumlu çerez onay yönetimi
 */

(function () {
    'use strict';

    const CONSENT_KEY = 'mcv_cookie_consent';
    const CONSENT_VERSION = '1.0';

    // Çerez kategorileri
    const COOKIE_CATEGORIES = {
        necessary: {
            name: 'Zorunlu Çerezler',
            description: 'Web sitesinin düzgün çalışması için gerekli çerezler.',
            required: true
        },
        analytics: {
            name: 'Analitik Çerezler',
            description: 'Ziyaretçi davranışlarını analiz etmek için kullanılır (Google Analytics, Microsoft Clarity).',
            required: false
        }
    };

    // Consent state
    let currentConsent = null;

    /**
     * Kaydedilmiş onay durumunu al
     */
    function getStoredConsent() {
        try {
            const stored = localStorage.getItem(CONSENT_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.version === CONSENT_VERSION) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Cookie consent read error:', e);
        }
        return null;
    }

    /**
     * Onay durumunu kaydet
     */
    function saveConsent(consent) {
        try {
            const data = {
                version: CONSENT_VERSION,
                timestamp: new Date().toISOString(),
                categories: consent
            };
            localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
            currentConsent = data;
        } catch (e) {
            console.warn('Cookie consent save error:', e);
        }
    }

    /**
     * Analitik izni var mı kontrol et
     */
    function hasAnalyticsConsent() {
        if (!currentConsent) return false;
        return currentConsent.categories && currentConsent.categories.analytics === true;
    }

    /**
     * Analitik scriptleri yükle
     */
    function loadAnalytics() {
        if (!hasAnalyticsConsent()) {
            console.log('Analytics consent not given, skipping...');
            return;
        }

        // Google Analytics 4 (placeholder - kullanıcı ID'sini ekleyecek)
        const gaId = window.GA_MEASUREMENT_ID || null;
        if (gaId && gaId !== 'G-XXXXXXXXXX') {
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
            document.head.appendChild(gaScript);

            gaScript.onload = function () {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', gaId, { 'anonymize_ip': true });
                console.log('Google Analytics loaded');
            };
        }

        // Microsoft Clarity (placeholder - kullanıcı ID'sini ekleyecek)
        const clarityId = window.CLARITY_PROJECT_ID || null;
        if (clarityId && clarityId !== 'YOUR_CLARITY_ID') {
            (function (c, l, a, r, i, t, y) {
                c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
                t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", clarityId);
            console.log('Microsoft Clarity loaded');
        }
    }

    /**
     * Banner'ı göster
     */
    function showBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.add('visible');
            // Not: KVKK gereği scroll kilitleme yapılmıyor (cookie wall yasak)
        }
    }

    /**
     * Banner'ı gizle
     */
    function hideBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.remove('visible');
        }
    }

    /**
     * Tüm çerezleri kabul et
     */
    function acceptAll() {
        const consent = {
            necessary: true,
            analytics: true
        };
        saveConsent(consent);
        hideBanner();
        loadAnalytics();
    }

    /**
     * Sadece zorunlu çerezleri kabul et
     */
    function acceptNecessaryOnly() {
        const consent = {
            necessary: true,
            analytics: false
        };
        saveConsent(consent);
        hideBanner();
    }

    /**
     * Ayarları kaydet (detaylı seçim)
     */
    function saveSettings() {
        const analyticsCheckbox = document.getElementById('cookieAnalytics');
        const consent = {
            necessary: true,
            analytics: analyticsCheckbox ? analyticsCheckbox.checked : false
        };
        saveConsent(consent);
        hideBanner();
        if (consent.analytics) {
            loadAnalytics();
        }
    }

    /**
     * Ayarlar panelini aç/kapat
     */
    function toggleSettings() {
        const settingsPanel = document.getElementById('cookieSettings');
        if (settingsPanel) {
            settingsPanel.classList.toggle('visible');
        }
    }

    /**
     * Başlatma
     */
    function init() {
        currentConsent = getStoredConsent();

        // Banner butonlarına event listener ekle
        document.addEventListener('click', function (e) {
            if (e.target.id === 'cookieAcceptAll' || e.target.closest('#cookieAcceptAll')) {
                acceptAll();
            } else if (e.target.id === 'cookieAcceptNecessary' || e.target.closest('#cookieAcceptNecessary')) {
                acceptNecessaryOnly();
            } else if (e.target.id === 'cookieSettingsBtn' || e.target.closest('#cookieSettingsBtn')) {
                toggleSettings();
            } else if (e.target.id === 'cookieSaveSettings' || e.target.closest('#cookieSaveSettings')) {
                saveSettings();
            } else if (e.target.id === 'cookieClose' || e.target.closest('#cookieClose')) {
                hideBanner(); // Sadece gizle, tercih kaydetme
            }
        });

        // Onay yoksa banner göster, varsa analitik yükle
        if (!currentConsent) {
            // DOM hazır olduğunda banner göster
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', showBanner);
            } else {
                setTimeout(showBanner, 500); // Kısa gecikme ile göster
            }
        } else {
            // Onay varsa analitik yükle
            loadAnalytics();
        }
    }

    // Global erişim için
    window.CookieConsent = {
        acceptAll: acceptAll,
        acceptNecessaryOnly: acceptNecessaryOnly,
        hasAnalyticsConsent: hasAnalyticsConsent,
        showBanner: showBanner,
        reset: function () {
            localStorage.removeItem(CONSENT_KEY);
            currentConsent = null;
            showBanner();
        }
    };

    // Başlat
    init();

})();
