# DNA Explorer 3D 🧬

An interactive 3D visualization of DNA structure using Three.js, featuring scroll-based storytelling and immersive educational content.

![DNA Explorer 3D](https://via.placeholder.com/800x400/0a0a0a/00ffff?text=DNA+Explorer+3D)

## ✨ Features

### 🎯 Core Functionality
- **Interactive 3D DNA Model**: Realistic double helix structure with animated base pairs (A, T, G, C)
- **Scroll-based Storytelling**: Camera moves through different DNA components as you scroll
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Educational Content**: Comprehensive explanations of DNA structure and components

### 🎮 Interactive Controls
- **Mouse Controls**: 
  - Drag to rotate the DNA helix
  - Scroll to move through the educational journey
  - Hover over components for detailed tooltips
- **Control Panel**:
  - ⏸️ Pause/Play animation
  - 🔲 Toggle wireframe visualization mode
  - 🔄 Reset camera position

### 🎨 Visual Elements
- **Realistic Materials**: Glowing DNA bases with emissive materials
- **Dynamic Lighting**: Accent lights highlighting different DNA components
- **Particle System**: Subtle background particles for atmospheric effect
- **Smooth Animations**: GSAP-powered smooth transitions and camera movements

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser with WebGL support

### Installation

1. **Clone the repository** (or use the existing project):
   ```bash
   cd ~/Projects/dna-explorer-3d
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Alternative: Simple HTTP Server
```bash
npm run serve
# Opens on http://localhost:8080
```

## 📁 Project Structure

```
dna-explorer-3d/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling and animations
├── js/
│   └── main.js         # Three.js application logic
├── src/                # Additional source files
├── assets/             # Images and other assets
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🧬 DNA Components Explained

The visualization includes accurate representations of:

1. **Double Helix Structure**: Two complementary strands wound around each other
2. **Sugar-Phosphate Backbone**: Structural framework providing stability
3. **Nitrogenous Bases**: A, T, G, C bases storing genetic information
4. **Hydrogen Bonds**: Weak bonds holding base pairs together
5. **Base Pairing Rules**: A-T (2 bonds) and G-C (3 bonds) complementarity

## 🎓 Educational Journey

The scroll-based experience takes users through:

- **Introduction**: Overview of DNA's importance
- **Double Helix**: Structure and discovery
- **Backbone**: Sugar-phosphate framework
- **Bases**: The four nucleotide types
- **Hydrogen Bonds**: Molecular interactions
- **Pairing Rules**: Chargaff's complementary base pairing
- **Conclusion**: DNA's role as the code of life

## 🛠️ Technical Details

### Technologies Used
- **Three.js**: 3D graphics and rendering
- **GSAP**: Smooth animations and scroll triggers
- **Vite**: Modern build tool for fast development
- **Vanilla JS**: No framework dependencies for maximum performance

### Key Features Implementation
- **DNA Geometry**: Procedurally generated using mathematical helical curves
- **Materials**: PBR materials with emissive properties for realistic glow
- **Camera System**: Smooth interpolation between predefined viewpoints
- **Responsive**: CSS Grid and Flexbox for adaptive layouts
- **Performance**: Optimized geometry and efficient rendering loop

### Browser Compatibility
- Chrome 60+ ✅
- Firefox 55+ ✅
- Safari 12+ ✅
- Edge 79+ ✅
- Mobile browsers with WebGL support ✅

## 🎨 Customization

### Modify DNA Parameters
Edit the DNA structure in `js/main.js`:
```javascript
// DNA parameters in createDNAStructure()
const helixHeight = 20;     // Height of DNA structure
const helixRadius = 2;      // Radius of helix
const turns = 3;            // Number of complete turns
const basePairsPerTurn = 10; // Base pairs per turn
```

### Adjust Visual Style
Modify colors and materials:
```javascript
// In createDNAMaterials()
adenine: new THREE.MeshPhongMaterial({
    color: 0xff6b6b,        // Base color
    shininess: 100,         // Glossiness
    emissive: 0x331111      // Glow color
})
```

### Camera Journey Points
Customize the scroll-based camera path:
```javascript
this.cameraPoints = [
    { position: { x: 0, y: 0, z: 15 }, lookAt: { x: 0, y: 0, z: 0 } },
    // Add more points for different viewing angles
];
```

## 📱 Mobile Optimization

The application is fully responsive with:
- Touch controls for 3D navigation
- Optimized particle counts for mobile performance
- Responsive typography and layout
- Reduced texture sizes on low-end devices

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Serve with simple HTTP server
npm run serve
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Watson & Crick for discovering the DNA double helix structure
- The Three.js community for excellent 3D graphics tools
- GSAP for smooth animation capabilities
- The open-source community for inspiration and tools

## 🔗 Links

- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://greensock.com/docs/)
- [DNA Structure Reference](https://en.wikipedia.org/wiki/DNA)

---

**Built with ❤️ and modern web technologies**