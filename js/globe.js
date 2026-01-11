/**
 * MCV Teknik - 3D Globe Background
 * Three.js based wireframe globe with continent mesh visualization
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        globeRadius: 300,
        rotationSpeed: 0.0008,
        axialTilt: 45 * (Math.PI / 180),
        additionalTilt: 20 * (Math.PI / 180),
        lightModeOpacity: 0.5,
        darkModeOpacity: 0.7,
        accentColor: 0xFF6B00,
        continentPointSize: 6,  // Larger points
        continentDensity: 3     // Points per landmass area
    };

    // Detailed continent outlines with more points
    const CONTINENT_DATA = {
        // Europe - dense points
        europe: [
            // Western Europe
            [48, 2], [49, 2], [50, 3], [51, 0], [52, 1], [53, 0],
            [50, -5], [51, -3], [52, -2], [53, -6], [54, -6],
            [52, 4], [52, 5], [51, 4], [50, 4], [49, 6],
            [48, 7], [47, 7], [47, 8], [46, 8], [47, 9],
            [48, 11], [49, 11], [50, 12], [51, 13], [52, 13],
            [48, 14], [49, 14], [50, 14], [48, 16], [47, 16],
            [46, 14], [45, 12], [44, 12], [45, 9], [44, 8], [43, 7],
            [43, 5], [42, 3], [41, 2], [43, -2], [42, -4], [41, -4],
            [40, -4], [39, -4], [38, -5], [37, -6], [36, -6],
            [37, -8], [38, -9], [40, -8], [41, -8], [42, -9],
            // Scandinavia
            [56, 10], [57, 12], [58, 12], [59, 11], [60, 10],
            [59, 18], [60, 18], [61, 17], [62, 17], [63, 18],
            [64, 20], [65, 22], [66, 24], [68, 20], [69, 19], [70, 25],
            // Eastern Europe
            [50, 20], [51, 21], [52, 21], [53, 23], [54, 24],
            [55, 21], [54, 18], [53, 18], [52, 17], [51, 17],
            [50, 19], [49, 19], [48, 17], [47, 18], [46, 18],
            [45, 20], [44, 22], [43, 24], [44, 26], [45, 26],
            [46, 24], [47, 22], [48, 21],
            [55, 37], [56, 38], [57, 40], [58, 42], [59, 44], [60, 46],
        ],

        // Asia - extensive coverage
        asia: [
            // Turkey (special focus)
            [39, 32], [40, 33], [41, 32], [40, 30], [39, 28],
            [38, 27], [37, 28], [36, 30], [37, 32], [38, 34],
            [39, 35], [40, 36], [41, 36], [42, 35], [41, 34],
            [40, 32], [39, 30], [38, 29], [37, 30], [36, 32],
            [41, 28], [41, 29], [40, 29], [39, 29],
            // Middle East
            [33, 35], [32, 35], [31, 35], [30, 35], [29, 35],
            [32, 44], [31, 44], [30, 46], [29, 48], [28, 50],
            [25, 51], [24, 51], [23, 52], [22, 55], [25, 55],
            [26, 56], [24, 57], [23, 58], [25, 60],
            // Central Asia
            [42, 59], [43, 62], [44, 65], [45, 68], [44, 70],
            [43, 72], [42, 74], [40, 70], [38, 68], [36, 65],
            [34, 62], [35, 60], [37, 58], [39, 55], [41, 52],
            // South Asia
            [28, 77], [27, 78], [26, 80], [24, 82], [22, 84],
            [20, 86], [22, 88], [24, 90], [26, 92], [28, 94],
            [25, 75], [23, 73], [21, 72], [19, 73], [17, 74],
            [15, 75], [13, 76], [11, 77], [9, 78], [8, 79],
            [10, 80], [12, 80], [14, 80], [16, 80], [18, 80],
            // East Asia
            [40, 116], [39, 117], [38, 118], [37, 119], [36, 120],
            [35, 119], [34, 118], [33, 118], [32, 120], [31, 121],
            [30, 121], [29, 120], [28, 118], [27, 116], [26, 114],
            [25, 112], [24, 110], [23, 108], [22, 106], [21, 104],
            [20, 102], [19, 100], [18, 99], [17, 100], [16, 102],
            [15, 104], [14, 106], [13, 103], [12, 105], [10, 104],
            [8, 104], [6, 102], [4, 103], [2, 104], [1, 104],
            // Japan
            [35, 139], [36, 140], [37, 140], [38, 140], [39, 140],
            [40, 140], [41, 141], [42, 142], [43, 144], [44, 145],
            [34, 135], [35, 134], [34, 132], [33, 130], [32, 131],
            // Korea
            [35, 127], [36, 127], [37, 127], [38, 126], [39, 126],
            [37, 129], [38, 128], [39, 128],
        ],

        // Africa
        africa: [
            // North Africa
            [37, 10], [36, 8], [35, 6], [34, 4], [33, 2], [32, 0],
            [31, -2], [30, -4], [29, -6], [28, -8], [27, -10],
            [35, -6], [34, -6], [33, -7], [32, -8], [30, -10],
            [32, 13], [31, 10], [30, 10], [29, 10], [28, 9],
            [27, 8], [26, 6], [25, 4], [24, 2], [23, 0],
            [30, 31], [29, 30], [28, 29], [27, 30], [26, 32],
            [25, 33], [24, 34], [23, 35], [22, 36], [21, 37],
            // West Africa
            [20, -17], [18, -16], [16, -16], [14, -17], [12, -16],
            [10, -15], [8, -14], [6, -12], [5, -10], [4, -8],
            [5, -5], [6, -3], [5, 0], [6, 2], [7, 4], [8, 6],
            [10, 7], [12, 8], [14, 10], [16, 12], [18, 14],
            // Central Africa
            [4, 9], [3, 10], [2, 11], [1, 12], [0, 12],
            [-1, 12], [-2, 13], [-3, 14], [-4, 15], [-5, 16],
            [-4, 18], [-3, 20], [-2, 22], [-1, 24], [0, 26],
            // East Africa
            [12, 42], [11, 43], [10, 44], [9, 45], [8, 46],
            [6, 44], [4, 42], [2, 40], [0, 38], [-2, 36],
            [-4, 38], [-6, 40], [-8, 42], [-10, 44], [-12, 44],
            // Southern Africa
            [-15, 28], [-17, 26], [-19, 24], [-21, 22], [-23, 20],
            [-25, 18], [-27, 16], [-29, 17], [-31, 18], [-33, 18],
            [-34, 20], [-34, 22], [-33, 24], [-32, 26], [-30, 28],
            [-28, 30], [-26, 32], [-24, 33], [-22, 34], [-20, 35],
            [-18, 36], [-16, 38], [-14, 40],
        ],

        // North America
        northAmerica: [
            // Alaska & Canada
            [70, -160], [68, -165], [66, -165], [64, -160], [62, -155],
            [60, -150], [58, -145], [56, -135], [54, -130], [52, -128],
            [64, -140], [63, -135], [62, -130], [61, -125], [60, -120],
            [58, -115], [56, -110], [54, -105], [52, -100], [50, -95],
            [48, -90], [46, -85], [44, -80], [42, -82], [44, -78],
            [46, -75], [48, -70], [50, -65], [52, -60], [54, -58],
            // USA East Coast
            [45, -70], [44, -69], [43, -70], [42, -71], [41, -72],
            [40, -74], [39, -75], [38, -76], [37, -76], [36, -76],
            [35, -76], [34, -78], [33, -80], [32, -81], [31, -81],
            [30, -82], [29, -83], [28, -82], [27, -80], [26, -80],
            [25, -80], [24, -81], [25, -82], [26, -82],
            // USA Gulf Coast
            [30, -88], [29, -90], [30, -92], [29, -94], [28, -96],
            [27, -97], [26, -97], [25, -97], [24, -98],
            // USA West Coast
            [32, -117], [33, -118], [34, -119], [35, -120], [36, -122],
            [37, -122], [38, -123], [39, -124], [40, -124], [42, -124],
            [44, -124], [46, -124], [48, -123], [49, -123],
            // Mexico
            [28, -106], [26, -104], [24, -102], [22, -100], [20, -98],
            [18, -96], [17, -94], [16, -92], [15, -90], [18, -88],
            [20, -87], [21, -86], [20, -90], [19, -96], [20, -100],
        ],

        // South America
        southAmerica: [
            // North coast
            [12, -72], [11, -74], [10, -75], [9, -76], [8, -77],
            [7, -78], [6, -77], [5, -76], [4, -74], [3, -72],
            [4, -70], [5, -68], [6, -66], [7, -64], [8, -62],
            [9, -60], [8, -58], [7, -56], [6, -54], [5, -52],
            [4, -50], [3, -48], [2, -46], [1, -44], [0, -50],
            // Brazil
            [-2, -44], [-4, -42], [-6, -38], [-8, -36], [-10, -37],
            [-12, -38], [-14, -40], [-16, -42], [-18, -44], [-20, -44],
            [-22, -43], [-23, -44], [-24, -46], [-26, -48], [-28, -49],
            [-30, -51], [-32, -52],
            // West coast
            [-4, -81], [-6, -80], [-8, -79], [-10, -78], [-12, -77],
            [-14, -76], [-16, -75], [-18, -71], [-20, -70], [-22, -70],
            [-24, -70], [-26, -71], [-28, -71], [-30, -72], [-33, -72],
            [-35, -72], [-38, -73], [-40, -73], [-42, -74], [-45, -74],
            [-48, -74], [-50, -74], [-52, -72], [-54, -70], [-55, -68],
            // East coast
            [-34, -58], [-35, -57], [-36, -57], [-38, -58], [-40, -62],
            [-42, -64], [-44, -66], [-46, -68], [-48, -66], [-50, -68],
        ],

        // Oceania
        oceania: [
            // Australia
            [-12, 130], [-14, 128], [-16, 124], [-18, 122], [-20, 118],
            [-22, 114], [-24, 114], [-26, 113], [-28, 114], [-30, 115],
            [-32, 116], [-34, 118], [-35, 120], [-34, 124], [-33, 128],
            [-34, 132], [-35, 136], [-36, 138], [-38, 145], [-37, 150],
            [-34, 151], [-32, 152], [-30, 153], [-28, 154], [-26, 153],
            [-24, 152], [-22, 150], [-20, 148], [-18, 146], [-16, 144],
            [-14, 142], [-12, 140], [-12, 136], [-14, 134], [-16, 132],
            // New Zealand
            [-35, 174], [-36, 175], [-38, 176], [-40, 176], [-42, 174],
            [-44, 172], [-46, 170], [-45, 168], [-44, 170],
            // Papua New Guinea
            [-3, 141], [-4, 143], [-5, 145], [-6, 147], [-7, 148],
            [-8, 147], [-9, 146], [-10, 148], [-8, 150], [-6, 152],
            [-4, 152], [-3, 150], [-2, 147], [-3, 144],
        ]
    };

    let scene, camera, renderer, globe, animationId;
    let container;

    function init() {
        container = document.querySelector('.globe-container');
        if (!container) {
            console.warn('Globe container not found');
            return;
        }

        // Clear existing CSS globe
        const oldGlobe = container.querySelector('.geometric-globe');
        if (oldGlobe) {
            oldGlobe.style.display = 'none';
        }

        // Create Three.js scene
        scene = new THREE.Scene();

        // Camera setup
        const aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
        camera.position.z = 800;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Style the canvas
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.pointerEvents = 'none';
        renderer.domElement.style.zIndex = '0';

        container.appendChild(renderer.domElement);

        // Create globe
        createGlobe();

        // Position globe to the right
        positionGlobe();

        // Start animation
        animate();

        // Handle resize
        window.addEventListener('resize', onResize);

        // Listen for theme changes
        observeThemeChanges();
    }

    function createGlobe() {
        const group = new THREE.Group();

        // Get current theme opacity
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const opacity = isDark ? CONFIG.darkModeOpacity : CONFIG.lightModeOpacity;

        // Outer sphere outline (very subtle)
        const outlineGeometry = new THREE.SphereGeometry(CONFIG.globeRadius, 32, 32);
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.accentColor,
            wireframe: true,
            transparent: true,
            opacity: opacity * 0.15
        });
        const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
        group.add(outline);

        // Add continent mesh points
        Object.values(CONTINENT_DATA).forEach(continentPoints => {
            const mesh = createContinentMesh(continentPoints, opacity);
            group.add(mesh);
        });

        // Add equator and prime meridian for reference
        const equator = createLatitudeRing(0, opacity * 0.4);
        group.add(equator);

        // Add atmospheric glow effect (subtle, layered)
        const glowGroup = createAtmosphericGlow(opacity);
        group.add(glowGroup);

        // Apply axial tilt
        group.rotation.z = CONFIG.axialTilt;
        group.rotation.x = CONFIG.additionalTilt;

        globe = group;
        scene.add(globe);
    }

    function createAtmosphericGlow(opacity) {
        const glowGroup = new THREE.Group();

        // Core glow (closest to globe, brightest)
        const coreGlowGeometry = new THREE.SphereGeometry(CONFIG.globeRadius * 1.01, 32, 32);
        const coreGlowMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.accentColor,
            transparent: true,
            opacity: opacity * 0.15,
            side: THREE.BackSide
        });
        const coreGlow = new THREE.Mesh(coreGlowGeometry, coreGlowMaterial);
        glowGroup.add(coreGlow);

        // Inner glow layer
        const innerGlowGeometry = new THREE.SphereGeometry(CONFIG.globeRadius * 1.05, 32, 32);
        const innerGlowMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.accentColor,
            transparent: true,
            opacity: opacity * 0.12,
            side: THREE.BackSide
        });
        const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
        glowGroup.add(innerGlow);

        // Middle glow layer
        const midGlowGeometry = new THREE.SphereGeometry(CONFIG.globeRadius * 1.12, 32, 32);
        const midGlowMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.accentColor,
            transparent: true,
            opacity: opacity * 0.08,
            side: THREE.BackSide
        });
        const midGlow = new THREE.Mesh(midGlowGeometry, midGlowMaterial);
        glowGroup.add(midGlow);

        // Outer glow layer
        const outerGlowGeometry = new THREE.SphereGeometry(CONFIG.globeRadius * 1.22, 32, 32);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.accentColor,
            transparent: true,
            opacity: opacity * 0.05,
            side: THREE.BackSide
        });
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        glowGroup.add(outerGlow);

        // Far glow layer (softest, widest)
        const farGlowGeometry = new THREE.SphereGeometry(CONFIG.globeRadius * 1.35, 32, 32);
        const farGlowMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.accentColor,
            transparent: true,
            opacity: opacity * 0.025,
            side: THREE.BackSide
        });
        const farGlow = new THREE.Mesh(farGlowGeometry, farGlowMaterial);
        glowGroup.add(farGlow);

        return glowGroup;
    }

    function createContinentMesh(points, opacity) {
        const meshGroup = new THREE.Group();

        points.forEach(([lat, lon]) => {
            const position = latLonToVector3(lat, lon, CONFIG.globeRadius + 3);

            // Core point (brightest)
            const geometry = new THREE.SphereGeometry(CONFIG.continentPointSize, 12, 12);
            const material = new THREE.MeshBasicMaterial({
                color: CONFIG.accentColor,
                transparent: true,
                opacity: opacity * 1.0
            });

            const point = new THREE.Mesh(geometry, material);
            point.position.copy(position);
            meshGroup.add(point);

            // Inner glow layer
            const innerGlowGeometry = new THREE.SphereGeometry(CONFIG.continentPointSize * 1.8, 8, 8);
            const innerGlowMaterial = new THREE.MeshBasicMaterial({
                color: CONFIG.accentColor,
                transparent: true,
                opacity: opacity * 0.5
            });
            const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
            innerGlow.position.copy(position);
            meshGroup.add(innerGlow);

            // Middle glow layer
            const midGlowGeometry = new THREE.SphereGeometry(CONFIG.continentPointSize * 2.8, 8, 8);
            const midGlowMaterial = new THREE.MeshBasicMaterial({
                color: CONFIG.accentColor,
                transparent: true,
                opacity: opacity * 0.25
            });
            const midGlow = new THREE.Mesh(midGlowGeometry, midGlowMaterial);
            midGlow.position.copy(position);
            meshGroup.add(midGlow);

            // Outer glow layer (softest)
            const outerGlowGeometry = new THREE.SphereGeometry(CONFIG.continentPointSize * 4, 6, 6);
            const outerGlowMaterial = new THREE.MeshBasicMaterial({
                color: CONFIG.accentColor,
                transparent: true,
                opacity: opacity * 0.1
            });
            const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
            outerGlow.position.copy(position);
            meshGroup.add(outerGlow);
        });

        return meshGroup;
    }

    function createLatitudeRing(latitude, opacity) {
        const latRad = latitude * (Math.PI / 180);
        const ringRadius = CONFIG.globeRadius * Math.cos(latRad);
        const y = CONFIG.globeRadius * Math.sin(latRad);

        const geometry = new THREE.TorusGeometry(ringRadius, 1, 8, 64);
        const material = new THREE.MeshBasicMaterial({
            color: CONFIG.accentColor,
            transparent: true,
            opacity: opacity
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.position.y = y;
        ring.rotation.x = Math.PI / 2;

        return ring;
    }

    function latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
    }

    function positionGlobe() {
        const rightOffset = window.innerWidth * 0.35;
        camera.position.x = -rightOffset;
    }

    function updateGlobeOpacity() {
        if (!globe) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const baseOpacity = isDark ? CONFIG.darkModeOpacity : CONFIG.lightModeOpacity;

        globe.traverse(function (child) {
            if (child.material) {
                const geo = child.geometry;
                if (geo) {
                    if (geo.type === 'SphereGeometry') {
                        const params = geo.parameters;
                        if (params.radius === CONFIG.continentPointSize) {
                            // Continent points
                            child.material.opacity = baseOpacity * 0.9;
                        } else if (params.radius === CONFIG.continentPointSize * 2) {
                            // Glow
                            child.material.opacity = baseOpacity * 0.3;
                        } else if (params.radius === CONFIG.globeRadius) {
                            // Outer wireframe
                            child.material.opacity = baseOpacity * 0.15;
                        }
                    } else if (geo.type === 'TorusGeometry') {
                        // Equator
                        child.material.opacity = baseOpacity * 0.4;
                    }
                }
                child.material.needsUpdate = true;
            }
        });
    }

    function observeThemeChanges() {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'data-theme') {
                    updateGlobeOpacity();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    function animate() {
        animationId = requestAnimationFrame(animate);

        if (globe) {
            globe.rotation.y += CONFIG.rotationSpeed;
        }

        renderer.render(scene, camera);
    }

    function onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        positionGlobe();
    }

    function cleanup() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        if (renderer) {
            renderer.dispose();
        }
        window.removeEventListener('resize', onResize);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

})();
