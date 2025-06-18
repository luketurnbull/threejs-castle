import { create } from "zustand";
import backgroundSounds from "../assets/background.mp3";
import * as THREE from "three";

export type AppStatus = "loading" | "ready" | "started";
export type Mode = "day" | "night";

interface AppState {
  // App status
  status: AppStatus;

  // Audio state
  audioEnabled: boolean;
  backgroundAudio: HTMLAudioElement;

  // Mode
  mode: Mode;

  // Sun position
  sunPosition: THREE.Vector3;

  // Actions
  // Status
  setStatus: (status: AppStatus) => void;

  // Audio
  toggleAudio: () => void;
  startBackgroundAudio: () => void;
  stopBackgroundAudio: () => void;

  // Mode
  setDay: () => void;
  setNight: () => void;

  // Sun position
  setSunPosition: (position: THREE.Vector3) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  status: "loading",
  audioEnabled: true,
  backgroundAudio: new Audio(backgroundSounds),
  mode: "day",
  sunPosition: new THREE.Vector3(4, 0.25, -12),

  // Actions
  setStatus: (status: AppStatus) => {
    set({ status });
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
    set({
      mode: "day",
      sunPosition: new THREE.Vector3(4, 0.25, -12),
    });
  },

  setNight: () => {
    set({
      mode: "night",
      sunPosition: new THREE.Vector3(0, -50, 0),
    });
  },

  setSunPosition: (position: THREE.Vector3) => {
    set({ sunPosition: position });
  },
}));
