import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * DNA Explorer 3D - Main Application Class
 * Interactive 3D DNA structure visualization using Three.js
 */
class DNAExplorer {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // DNA structure components
        this.dnaGroup = null;
        this.dnaStrands = [];
        this.basePairs = [];
        this.backbones = [];
        
        // Animation and interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.tooltip = null;
        this.hoveredObject = null;
        
        // Control states
        this.isAnimationPaused = false;
        this.isWireframeMode = false;
        this.animationSpeed = 1;
        
        // Camera journey points for scroll-based movement
        this.cameraPoints = [
            { position: { x: 0, y: 0, z: 15 }, lookAt: { x: 0, y: 0, z: 0 } },
            { position: { x: 5, y: 5, z: 10 }, lookAt: { x: 0, y: 0, z: 0 } },
            { position: { x: 8, y: 0, z: 5 }, lookAt: { x: 0, y: 0, z: 0 } },
            { position: { x: 3, y: -3, z: 8 }, lookAt: { x: 0, y: -2, z: 0 } },
            { position: { x: -5, y: 2, z: 6 }, lookAt: { x: 0, y: 0, z: 0 } },
            { position: { x: 0, y: 8, z: 4 }, lookAt: { x: 0, y: 0, z: 0 } },
            { position: { x: 0, y: 0, z: 12 }, lookAt: { x: 0, y: 0, z: 0 } }
        ];
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLighting();
            this.setupControls();
            this.createDNAStructure();
            this.setupEventListeners();
            this.setupScrollAnimation();
            this.createParticleSystem();
            this.startAnimation();
            
            // Hide loading screen after everything is loaded
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000);
            
        } catch (error) {
            console.error('Error initializing DNA Explorer:', error);
        }
    }
    
    /**
     * Set up the Three.js scene
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 20, 100);
    }
    
    /**
     * Set up the camera
     */
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 15);
    }
    
    /**
     * Set up the WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('three-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
    }
    
    /**
     * Set up lighting for the scene
     */
    setupLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Accent lights for DNA highlighting
        const accentLight1 = new THREE.PointLight(0x00ffff, 0.5, 20);
        accentLight1.position.set(-5, 5, 5);
        this.scene.add(accentLight1);
        
        const accentLight2 = new THREE.PointLight(0xff00ff, 0.5, 20);
        accentLight2.position.set(5, -5, 5);
        this.scene.add(accentLight2);
    }
    
    /**
     * Set up orbit controls
     */
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 30;
        this.controls.maxPolarAngle = Math.PI;
    }
    
    /**
     * Create the DNA double helix structure
     */
    createDNAStructure() {
        this.dnaGroup = new THREE.Group();
        
        // DNA parameters
        const helixHeight = 20;
        const helixRadius = 2;
        const turns = 3;
        const basePairsPerTurn = 10;
        const totalBasePairs = turns * basePairsPerTurn;
        
        // Create materials for different components
        const materials = this.createDNAMaterials();
        
        // Create sugar-phosphate backbones
        this.createBackbones(helixHeight, helixRadius, turns, materials.backbone);
        
        // Create base pairs
        this.createBasePairs(helixHeight, helixRadius, totalBasePairs, materials);
        
        // Add DNA group to scene
        this.scene.add(this.dnaGroup);
        
        // Position DNA at origin
        this.dnaGroup.position.set(0, 0, 0);
    }
    
    /**
     * Create materials for DNA components
     */
    createDNAMaterials() {
        return {
            backbone: new THREE.MeshPhongMaterial({
                color: 0x888888,
                shininess: 100,
                transparent: true,
                opacity: 0.9
            }),
            adenine: new THREE.MeshPhongMaterial({
                color: 0xff6b6b,
                shininess: 100,
                emissive: 0x331111
            }),
            thymine: new THREE.MeshPhongMaterial({
                color: 0x4834d4,
                shininess: 100,
                emissive: 0x111133
            }),
            guanine: new THREE.MeshPhongMaterial({
                color: 0x00d2d3,
                shininess: 100,
                emissive: 0x003333
            }),
            cytosine: new THREE.MeshPhongMaterial({
                color: 0xff9ff3,
                shininess: 100,
                emissive: 0x331133
            }),
            bond: new THREE.LineBasicMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.8
            })
        };
    }
    
    /**
     * Create sugar-phosphate backbones
     */
    createBackbones(height, radius, turns, material) {
        const points1 = [];
        const points2 = [];
        const segments = 200;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * turns * Math.PI * 2;
            const y = (t - 0.5) * height;
            
            // First strand
            points1.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            ));
            
            // Second strand (opposite side)
            points2.push(new THREE.Vector3(
                Math.cos(angle + Math.PI) * radius,
                y,
                Math.sin(angle + Math.PI) * radius
            ));
        }
        
        // Create tubes for backbones
        const curve1 = new THREE.CatmullRomCurve3(points1);
        const curve2 = new THREE.CatmullRomCurve3(points2);
        
        const tubeGeometry1 = new THREE.TubeGeometry(curve1, 100, 0.15, 8, false);
        const tubeGeometry2 = new THREE.TubeGeometry(curve2, 100, 0.15, 8, false);
        
        const backbone1 = new THREE.Mesh(tubeGeometry1, material);
        const backbone2 = new THREE.Mesh(tubeGeometry2, material);
        
        backbone1.userData = { type: 'backbone', description: 'Sugar-phosphate backbone - provides structural support' };
        backbone2.userData = { type: 'backbone', description: 'Sugar-phosphate backbone - provides structural support' };
        
        this.backbones.push(backbone1, backbone2);
        this.dnaGroup.add(backbone1, backbone2);
    }
    
    /**
     * Create base pairs
     */
    createBasePairs(height, radius, totalBasePairs, materials) {
        const baseTypes = ['A', 'T', 'G', 'C'];
        const basePairings = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' };
        const baseMaterials = {
            'A': materials.adenine,
            'T': materials.thymine,
            'G': materials.guanine,
            'C': materials.cytosine
        };
        
        for (let i = 0; i < totalBasePairs; i++) {
            const t = i / totalBasePairs;
            const angle = t * 3 * Math.PI * 2; // 3 turns
            const y = (t - 0.5) * height;
            
            // Randomly select base type
            const base1Type = baseTypes[Math.floor(Math.random() * baseTypes.length)];
            const base2Type = basePairings[base1Type];
            
            // Create base geometries
            const baseGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            
            // Position bases
            const base1Position = new THREE.Vector3(
                Math.cos(angle) * (radius - 0.5),
                y,
                Math.sin(angle) * (radius - 0.5)
            );
            
            const base2Position = new THREE.Vector3(
                Math.cos(angle + Math.PI) * (radius - 0.5),
                y,
                Math.sin(angle + Math.PI) * (radius - 0.5)
            );
            
            // Create base meshes
            const base1 = new THREE.Mesh(baseGeometry, baseMaterials[base1Type]);
            const base2 = new THREE.Mesh(baseGeometry, baseMaterials[base2Type]);
            
            base1.position.copy(base1Position);
            base2.position.copy(base2Position);
            
            // Add metadata for interaction
            base1.userData = {
                type: 'base',
                baseType: base1Type,
                description: this.getBaseDescription(base1Type)
            };
            
            base2.userData = {
                type: 'base',
                baseType: base2Type,
                description: this.getBaseDescription(base2Type)
            };
            
            this.basePairs.push(base1, base2);
            this.dnaGroup.add(base1, base2);
            
            // Create hydrogen bonds between bases
            this.createHydrogenBond(base1Position, base2Position, materials.bond);
        }
    }
    
    /**
     * Create hydrogen bond visualization
     */
    createHydrogenBond(pos1, pos2, material) {
        const points = [pos1, pos2];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const bond = new THREE.Line(geometry, material);
        
        bond.userData = {
            type: 'bond',
            description: 'Hydrogen bond - holds base pairs together'
        };
        
        this.dnaGroup.add(bond);
    }
    
    /**
     * Get description for base types
     */
    getBaseDescription(baseType) {
        const descriptions = {
            'A': 'Adenine - Purine base, pairs with Thymine (2 H-bonds)',
            'T': 'Thymine - Pyrimidine base, pairs with Adenine (2 H-bonds)',
            'G': 'Guanine - Purine base, pairs with Cytosine (3 H-bonds)',
            'C': 'Cytosine - Pyrimidine base, pairs with Guanine (3 H-bonds)'
        };
        return descriptions[baseType] || 'DNA base';
    }
    
    /**
     * Create particle system for background effect
     */
    createParticleSystem() {
        const particleCount = 200;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            // Random colors (cyan to magenta)
            const hue = Math.random() * 0.3 + 0.5; // 0.5 to 0.8 range
            const color = new THREE.Color().setHSL(hue, 1, 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse movement for tooltip
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Control buttons
        document.getElementById('pause-btn').addEventListener('click', () => this.toggleAnimation());
        document.getElementById('wireframe-btn').addEventListener('click', () => this.toggleWireframe());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetCamera());
        
        // Tooltip element
        this.tooltip = document.getElementById('tooltip');
    }
    
    /**
     * Set up GSAP ScrollTrigger animations
     */
    setupScrollAnimation() {
        const sections = document.querySelectorAll('.content-section');
        
        // Animate section content visibility
        sections.forEach((section, index) => {
            const content = section.querySelector('.section-content');
            
            ScrollTrigger.create({
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => content.classList.add('visible'),
                onLeave: () => content.classList.remove('visible'),
                onEnterBack: () => content.classList.add('visible'),
                onLeaveBack: () => content.classList.remove('visible')
            });
        });
        
        // Camera journey animation
        ScrollTrigger.create({
            trigger: '.content-wrapper',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const pointIndex = Math.floor(progress * (this.cameraPoints.length - 1));
                const nextPointIndex = Math.min(pointIndex + 1, this.cameraPoints.length - 1);
                const localProgress = (progress * (this.cameraPoints.length - 1)) % 1;
                
                if (this.cameraPoints[pointIndex] && this.cameraPoints[nextPointIndex]) {
                    const currentPoint = this.cameraPoints[pointIndex];
                    const nextPoint = this.cameraPoints[nextPointIndex];
                    
                    // Interpolate camera position
                    this.camera.position.x = THREE.MathUtils.lerp(
                        currentPoint.position.x,
                        nextPoint.position.x,
                        localProgress
                    );
                    this.camera.position.y = THREE.MathUtils.lerp(
                        currentPoint.position.y,
                        nextPoint.position.y,
                        localProgress
                    );
                    this.camera.position.z = THREE.MathUtils.lerp(
                        currentPoint.position.z,
                        nextPoint.position.z,
                        localProgress
                    );
                    
                    // Update controls target
                    this.controls.target.x = THREE.MathUtils.lerp(
                        currentPoint.lookAt.x,
                        nextPoint.lookAt.x,
                        localProgress
                    );
                    this.controls.target.y = THREE.MathUtils.lerp(
                        currentPoint.lookAt.y,
                        nextPoint.lookAt.y,
                        localProgress
                    );
                    this.controls.target.z = THREE.MathUtils.lerp(
                        currentPoint.lookAt.z,
                        nextPoint.lookAt.z,
                        localProgress
                    );
                    
                    this.controls.update();
                }
            }
        });
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Handle mouse movement for tooltips
     */
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.dnaGroup.children);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            if (this.hoveredObject !== object && object.userData.description) {
                this.hoveredObject = object;
                this.showTooltip(event.clientX, event.clientY, object.userData.description);
            }
        } else {
            if (this.hoveredObject) {
                this.hoveredObject = null;
                this.hideTooltip();
            }
        }
    }
    
    /**
     * Show tooltip
     */
    showTooltip(x, y, text) {
        this.tooltip.textContent = text;
        this.tooltip.style.left = x + 10 + 'px';
        this.tooltip.style.top = y + 10 + 'px';
        this.tooltip.classList.add('visible');
    }
    
    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }
    
    /**
     * Toggle animation
     */
    toggleAnimation() {
        this.isAnimationPaused = !this.isAnimationPaused;
        const btn = document.getElementById('pause-btn');
        btn.textContent = this.isAnimationPaused ? '▶️' : '⏸️';
    }
    
    /**
     * Toggle wireframe mode
     */
    toggleWireframe() {
        this.isWireframeMode = !this.isWireframeMode;
        
        this.dnaGroup.children.forEach(child => {
            if (child.material) {
                child.material.wireframe = this.isWireframeMode;
            }
        });
        
        const btn = document.getElementById('wireframe-btn');
        btn.style.background = this.isWireframeMode ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.7)';
    }
    
    /**
     * Reset camera position
     */
    resetCamera() {
        gsap.to(this.camera.position, {
            duration: 1.5,
            x: 0,
            y: 0,
            z: 15,
            ease: 'power2.inOut'
        });
        
        gsap.to(this.controls.target, {
            duration: 1.5,
            x: 0,
            y: 0,
            z: 0,
            ease: 'power2.inOut'
        });
    }
    
    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    /**
     * Start the animation loop
     */
    startAnimation() {
        const animate = (time) => {
            requestAnimationFrame(animate);
            
            if (!this.isAnimationPaused && this.dnaGroup) {
                // Rotate DNA slowly
                this.dnaGroup.rotation.y += 0.005 * this.animationSpeed;
                
                // Subtle oscillation
                this.dnaGroup.position.y = Math.sin(time * 0.0005) * 0.2;
            }
            
            // Update controls
            this.controls.update();
            
            // Render scene
            this.renderer.render(this.scene, this.camera);
        };
        
        animate(0);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DNAExplorer();
});