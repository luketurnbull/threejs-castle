import { create } from "zustand";
import backgroundSounds from "../assets/background.mp3";
import * as THREE from "three";
import { GLTFLoader, KTX2Loader } from "three-stdlib";

export type Mode = "day" | "night";

export enum LoadingStep {
  INIT_APP = 0,
  LOADING_DAY_TIME = 1,
  LOADING_NIGHT_TIME = 2,
  LOADING_AUDIO = 3,
  LOADING_COMPLETE = 4,
}

interface AppState {
  loadingStep: LoadingStep;

  // Audio state
  audioEnabled: boolean;
  backgroundAudio: HTMLAudioElement;

  // Mode
  mode: Mode;

  // Three.js references
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.Camera | null;
  gltfLoader: GLTFLoader | null;
  ktx2Loader: KTX2Loader | null;

  // Actions
  setLoadingStep: (status: LoadingStep) => void;
  init: (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void;

  // Audio
  toggleAudio: () => void;
  startBackgroundAudio: () => void;
  stopBackgroundAudio: () => void;

  // Mode
  setDay: () => void;
  setNight: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  loadingStep: LoadingStep.INIT_APP,
  audioEnabled: true,
  backgroundAudio: new Audio(backgroundSounds),
  mode: "day",
  renderer: null,
  camera: null,
  gltfLoader: null,
  ktx2Loader: null,

  init: (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    const ktx2Loader = new KTX2Loader();
    const gltfLoader = new GLTFLoader();
    ktx2Loader.setTranscoderPath("/basis/");
    gltfLoader.setKTX2Loader(ktx2Loader.detectSupport(renderer));

    set({
      camera,
      renderer,
      gltfLoader,
      ktx2Loader,
      loadingStep: LoadingStep.LOADING_DAY_TIME,
    });
  },

  setLoadingStep: (step: LoadingStep) => {
    set({ loadingStep: step });
  },

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

  setDay: () => {
    set({ mode: "day" });
  },

  setNight: () => {
    set({ mode: "night" });
  },
}));
