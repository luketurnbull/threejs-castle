import { create } from "zustand";
import backgroundSounds from "../assets/background.mp3";

export type AppStatus = "loading" | "ready" | "started";

interface AppState {
  // App status
  status: AppStatus;

  // Audio state
  audioEnabled: boolean;
  backgroundAudio: HTMLAudioElement | null;

  // Actions
  setStatus: (status: AppStatus) => void;
  toggleAudio: () => void;
  startBackgroundAudio: () => void;
  stopBackgroundAudio: () => void;
  initializeAudio: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  status: "loading",
  audioEnabled: true,
  backgroundAudio: null,

  // Actions
  setStatus: (status: AppStatus) => {
    set({ status });
  },

  toggleAudio: () => {
    const { audioEnabled, backgroundAudio } = get();
    const newAudioEnabled = !audioEnabled;

    set({ audioEnabled: newAudioEnabled });

    if (backgroundAudio) {
      if (newAudioEnabled) {
        backgroundAudio.play().catch(console.error);
      } else {
        backgroundAudio.pause();
      }
    }
  },

  startBackgroundAudio: () => {
    const { backgroundAudio, audioEnabled } = get();
    if (backgroundAudio && audioEnabled) {
      backgroundAudio.loop = true;
      backgroundAudio.volume = 0.5;
      backgroundAudio.play().catch(console.error);
    }
  },

  stopBackgroundAudio: () => {
    const { backgroundAudio } = get();
    if (backgroundAudio) {
      backgroundAudio.pause();
    }
  },

  initializeAudio: () => {
    const audio = new Audio(backgroundSounds);
    set({ backgroundAudio: audio });
  },
}));
