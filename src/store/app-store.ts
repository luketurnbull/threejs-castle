import { create } from "zustand";
import backgroundSounds from "../assets/background.mp3";

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
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  status: "loading",
  audioEnabled: true,
  backgroundAudio: new Audio(backgroundSounds),
  mode: "day",

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
    set({ mode: "day" });
  },

  setNight: () => {
    set({ mode: "night" });
  },
}));
