# Castle on a Hill

An immersive 3D castle experience built with React, Three.js, and modern web technologies. Experience a living castle environment with dynamic day/night cycles, interactive elements, and atmospheric audio.

## 🌟 Features

### Visual Experience

- **Dynamic Day/Night Cycle**: Seamless transitions between day and night with atmospheric lighting changes
- **Real-time Fire Effects**: Authentic fire simulation with flickering flames and smoke
- **Procedural Grass**: 150,000+ animated grass blades with wind effects
- **Interactive Windows**: Glowing castle windows with realistic flame lighting
- **Atmospheric Sky**: Dynamic sky system with moving clouds and stars
- **Animated Flag**: Interactive flag with hover effects and day/night color transitions

### Audio System

- **Spatial Audio**: Distance-based volume attenuation for immersive sound
- **Day/Night Audio**: Different ambient sounds for day and night modes
- **Interactive Sound Effects**: Fire crackling, leaves rustling, and background ambience
- **Audio Controls**: Toggle audio with animated SVG morphing

### Performance Optimizations

- **KTX2 Texture Compression**: Efficient texture loading with Basis Universal
- **DRACO Geometry Compression**: Optimized mesh loading
- **Instanced Rendering**: High-performance grass and object rendering
- **Adaptive DPR**: Optimal rendering across different devices
- **Progressive Loading**: Smooth loading experience with state management

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, @react-three/drei
- **State Management**: Zustand
- **Animations**: GSAP (GreenSock Animation Platform)
- **Build Tool**: Vite
- **Shaders**: Custom GLSL with vite-plugin-glsl
- **Audio**: Web Audio API with spatial audio
- **Asset Compression**: KTX2, DRACO, Basis Universal

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd castle
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to experience the castle

### Build for Production

```bash
pnpm build
# or
npm run build
```

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
```

## 🎮 Controls

- **Mouse/Touch**: Orbit camera around the castle
- **Scroll**: Zoom in/out
- **Audio Button**: Toggle sound effects and ambient audio
- **Day/Night Toggle**: Switch between day and night modes
- **Start Button**: Begin the interactive experience

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── castle.tsx       # Main 3D scene container
│   ├── experience.tsx   # Core 3D experience setup
│   ├── scene.tsx        # Scene composition
│   ├── hill.tsx         # Terrain and grass system
│   ├── windows.tsx      # Castle windows with lighting
│   ├── flag.tsx         # Interactive flag
│   ├── smoke.tsx        # Fire and smoke effects
│   ├── sky-settings.tsx # Atmospheric sky system
│   ├── cloud-settings.tsx # Cloud animations
│   ├── stars.tsx        # Night sky stars
│   ├── control-panel.tsx # UI controls
│   └── *-material/      # Custom shader materials
├── store/               # Zustand state management
├── constants/           # Asset and audio constants
├── utils/               # Utility functions
├── assets/              # Audio files
└── shaders/             # GLSL shader utilities
```

## 🎨 Custom Shaders

The project features several custom GLSL shaders:

- **Day/Night Material**: Smooth transitions between day and night textures
- **Grass Material**: Animated grass with wind effects and day/night lighting
- **Window Material**: Realistic flame lighting simulation
- **Smoke Material**: Dynamic smoke-to-fire morphing
- **Flag Material**: Interactive lighting and color transitions

## 🔊 Audio System

The audio system provides:

- Background ambient sounds for day and night
- Spatial audio for fire effects based on camera distance
- Interactive sound effects for grass and environment
- Smooth audio transitions between day/night modes

## 🎯 Performance Features

- **Asset Optimization**: KTX2 and DRACO compression for fast loading
- **Rendering Optimization**: Instanced rendering for large object counts
- **Memory Management**: Efficient texture and geometry handling
- **Responsive Design**: Adaptive rendering for different device capabilities

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Adding New Features

1. **New 3D Components**: Add to `src/components/`
2. **Custom Shaders**: Create new material folders in `src/components/`
3. **State Management**: Extend the Zustand store in `src/store/`
4. **Audio**: Add audio files to `src/assets/` and update constants

## 📝 License

This project is created for educational and portfolio purposes.

## 👨‍💻 Author

**Luke Turnbull** - A ThreeJS Project

---

_Experience the magic of interactive 3D web development with this castle on a hill!_
