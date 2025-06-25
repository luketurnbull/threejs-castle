import { create } from "zustand";
import backgroundSounds from "../assets/background.mp3";
import * as THREE from "three";
import { GLTFLoader, KTX2Loader } from "three-stdlib";
import type { Model } from "@/types/model";
import { TextureLoader } from "three";
import { TEXTURES } from "@/constants/assets";

export type Mode = "day" | "night";

interface AppState {
  // Audio state
  audioEnabled: boolean;
  backgroundAudio: HTMLAudioElement;

  // Mode
  mode: Mode;

  // Three.js references
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera;

  // Three.js loaders
  gltfLoader: GLTFLoader | null;
  ktx2Loader: KTX2Loader | null;
  textureLoader: TextureLoader | null;

  // Model
  model: Model | null;

  // Textures
  grass_diffuse: THREE.Texture | null;
  grass_alpha: THREE.Texture | null;
  hill_day: THREE.Texture | null;
  hill_night: THREE.Texture | null;
  hill_nightDim: THREE.Texture | null;
  hill_patches: THREE.Texture | null;
  objects_day: THREE.Texture | null;
  objects_night: THREE.Texture | null;
  objects_nightDim: THREE.Texture | null;
  perlinNoise: THREE.Texture | null;
  flag: THREE.Texture | null;

  // Actions
  init: (renderer: THREE.WebGLRenderer) => void;
  loadScene: () => void;

  // Audio
  toggleAudio: () => void;
  startBackgroundAudio: () => void;
  stopBackgroundAudio: () => void;

  // Mode
  setDay: () => void;
  setNight: () => void;
}

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 50, 0);
camera.lookAt(0, 100, 0);

export const useAppStore = create<AppState>((set, get) => ({
  audioEnabled: true,
  backgroundAudio: new Audio(backgroundSounds),
  mode: "day",
  camera,
  renderer: null,
  gltfLoader: null,
  ktx2Loader: null,
  textureLoader: null,
  model: null,
  grass_diffuse: null,
  grass_alpha: null,
  hill_day: null,
  hill_night: null,
  hill_nightDim: null,
  hill_patches: null,
  objects_day: null,
  objects_night: null,
  objects_nightDim: null,
  perlinNoise: null,
  flag: null,

  // Init
  init: (renderer: THREE.WebGLRenderer) => {
    const ktx2Loader = new KTX2Loader();
    const gltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();

    ktx2Loader.setTranscoderPath("/basis/");
    gltfLoader.setKTX2Loader(ktx2Loader.detectSupport(renderer));

    set({
      renderer,
      gltfLoader,
      ktx2Loader,
      textureLoader,
    });
  },

  // Loading
  loadScene: () => {
    const { gltfLoader } = get();

    if (gltfLoader) {
      gltfLoader.load("/scene.gltf", (gltf) => {
        set({ model: gltf.scene as unknown as Model });
      });
    }
  },

  loadDayTextures: () => {
    const { textureLoader, ktx2Loader } = get();

    if (textureLoader) {
      textureLoader.load(TEXTURES.BLADE_DIFFUSE, (texture) => {
        set({ grass_diffuse: texture });
      });

      textureLoader.load(TEXTURES.BLADE_ALPHA, (texture) => {
        set({ grass_alpha: texture });
      });

      textureLoader.load(TEXTURES.PERLIN_NOISE, (texture) => {
        set({ perlinNoise: texture });
      });

      textureLoader.load(TEXTURES.HILL_PATCHES, (texture) => {
        set({ hill_patches: texture });
      });
    }

    if (ktx2Loader) {
      ktx2Loader.load(TEXTURES.HILL_BAKED_COMPRESSED, (texture) => {
        set({ hill_day: texture });
      });

      ktx2Loader.load(TEXTURES.OBJECTS_DIFFUSE_COMPRESSED, (texture) => {
        set({ objects_day: texture });
      });
    }
  },

  loadNightTextures: () => {
    const { ktx2Loader } = get();

    if (ktx2Loader) {
      ktx2Loader.load(TEXTURES.HILL_BAKED_NIGHT_COMPRESSED, (texture) => {
        set({ hill_night: texture });
      });

      ktx2Loader.load(TEXTURES.HILL_BAKED_NIGHT_DIM_COMPRESSED, (texture) => {
        set({ hill_nightDim: texture });
      });

      ktx2Loader.load(TEXTURES.OBJECTS_DIFFUSE_NIGHT_COMPRESSED, (texture) => {
        set({ objects_night: texture });
      });

      ktx2Loader.load(
        TEXTURES.OBJECTS_DIFFUSE_NIGHT_DIM_COMPRESSED,
        (texture) => {
          set({ objects_nightDim: texture });
        }
      );
    }
  },

  // Audio
  toggleAudio: () => {
    const { audioEnabled, backgroundAudio } = get();
    const newAudioEnabled = !audioEnabled;

    set({ audioEnabled: newAudioEnabled });

    if (newAudioEnabled) {
      backgroundAudio.play().catch(console.error);
    } else {
      backgroundAudio.pause();
    }
  },

  startBackgroundAudio: () => {
    const { backgroundAudio, audioEnabled } = get();
    if (audioEnabled) {
      backgroundAudio.loop = true;
      backgroundAudio.volume = 0.5;
      backgroundAudio.play().catch(console.error);
    }
  },

  stopBackgroundAudio: () => {
    const { backgroundAudio } = get();
    backgroundAudio.pause();
  },

  // Mode
  setDay: () => {
    set({ mode: "day" });
  },

  setNight: () => {
    set({ mode: "night" });
  },
}));
