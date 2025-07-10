import { create } from "zustand";
import backgroundNightAudioFile from "../assets/backgroundNight.mp3";
import leavesRustlingAudioFile from "../assets/leavesRustling.mp3";
import backgroundDayAudioFile from "../assets/backgroundDay.wav";
import fireCracklingAudioFile from "../assets/fireCrackling.wav";
import * as THREE from "three";
import { GLTFLoader, KTX2Loader, DRACOLoader } from "three-stdlib";
import { TextureLoader } from "three";
import { TEXTURES } from "@/constants/assets";
import { AUDIO_VOLUMES, FIRE_AUDIO_DISTANCES } from "@/constants/audio";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";

const isMobile = window.innerWidth < 750;
const CAMERA_INIT_X = isMobile ? -180 : -140;

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Initial camera position looking at the center
camera.position.set(CAMERA_INIT_X, 0, 0);
camera.lookAt(0, 0, 0);

export type Mode = "day" | "night";
export type LoadingState =
  | "idle"
  | "initialised"
  | "daytime-loaded"
  | "daytime-audio-loaded"
  | "complete";

interface AppState {
  // Loading state
  loadingState: LoadingState;
  started: boolean;

  // Audio state
  audioEnabled: boolean;
  audioLoaded: boolean;
  backgroundDayAudio: HTMLAudioElement | null;
  backgroundNightAudio: HTMLAudioElement | null;
  rustleAudio: HTMLAudioElement | null;
  fireCracklingAudio: HTMLAudioElement | null;
  currentBackgroundAudio: HTMLAudioElement | null;

  // Mode
  mode: Mode;

  // Three.js references
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera;

  // Three.js loaders
  gltfLoader: GLTFLoader | null;
  ktx2Loader: KTX2Loader | null;
  textureLoader: TextureLoader | null;
  dracoLoader: DRACOLoader | null;

  // Individual meshes
  hillMesh: THREE.Mesh | null;
  objectsMesh: THREE.Mesh | null;
  windowInsideMesh: THREE.Mesh | null;

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
  startLoadingSequence: () => void;
  loadDaytimeAudio: () => Promise<void>;
  loadNightAudio: () => Promise<void>;
  loadModel: () => Promise<void>;
  loadDayTextures: () => Promise<void>;
  loadNightTextures: () => Promise<void>;

  // Audio
  toggleAudio: () => void;
  startBackgroundAudio: () => void;
  stopBackgroundAudio: () => void;
  transitionToDayAudio: () => void;
  transitionToNightAudio: () => void;
  updateFireAudioVolume: (distance: number) => void;

  // Mode
  setDay: () => void;
  setNight: () => void;

  // Start experience
  start: () => void;

  // Set complete
  setComplete: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Loading
  loadingState: "idle",
  started: false,

  // Audio
  audioEnabled: true,
  audioLoaded: false,
  backgroundDayAudio: null,
  backgroundNightAudio: null,
  rustleAudio: null,
  fireCracklingAudio: null,
  currentBackgroundAudio: null,
  // Mode
  mode: "day",

  // Three.js references
  camera,
  renderer: null,
  gltfLoader: null,
  ktx2Loader: null,
  textureLoader: null,
  dracoLoader: null,

  // Individual meshes
  hillMesh: null,
  objectsMesh: null,
  windowInsideMesh: null,

  // Textures
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
  init: async (renderer: THREE.WebGLRenderer) => {
    const { loadingState, ktx2Loader, gltfLoader } = get();

    // Prevent multiple initializations - check if we already have loaders
    if (ktx2Loader || gltfLoader || loadingState !== "idle") {
      console.log("Already initialized, skipping init");
      return;
    }

    const newKtx2Loader = new KTX2Loader();
    const newGltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();
    const dracoLoader = new DRACOLoader();

    // Set up DRACO compression
    dracoLoader.setDecoderPath("/draco/");
    dracoLoader.setDecoderConfig({ type: "js" });

    newKtx2Loader.setTranscoderPath("/basis/");
    newGltfLoader.setKTX2Loader(newKtx2Loader.detectSupport(renderer));
    newGltfLoader.setDRACOLoader(dracoLoader);

    set({
      renderer,
      gltfLoader: newGltfLoader,
      ktx2Loader: newKtx2Loader,
      textureLoader,
      dracoLoader,
    });

    await get().startLoadingSequence();
  },

  // Loading sequence
  startLoadingSequence: async () => {
    set({ loadingState: "initialised" });

    try {
      // Step 1: Load model and day textures simultaneously
      await Promise.all([get().loadModel(), get().loadDayTextures()]);

      console.log("Model and day textures loaded");
      set({ loadingState: "daytime-loaded" });

      // Step 2: Load daytime audio (rustling + background day)
      await get().loadDaytimeAudio();

      console.log("Daytime audio loaded");
      set({ loadingState: "daytime-audio-loaded" });

      // Step 3: Load night textures and night audio
      await Promise.all([get().loadNightTextures(), get().loadNightAudio()]);

      console.log("Night textures and audio loaded");
      get().setComplete();
    } catch (error) {
      console.error("Loading sequence failed:", error);
      set({ loadingState: "idle" });
    }
  },

  loadDaytimeAudio: async () => {
    const {
      backgroundDayAudio: existingBackgroundDay,
      rustleAudio: existingRustle,
    } = get();

    // Prevent multiple audio loading
    if (existingBackgroundDay && existingRustle) {
      console.log("Daytime audio already loaded, skipping");
      return;
    }

    console.log("Starting daytime audio loading...");

    // Check if browser supports audio
    if (typeof Audio === "undefined") {
      console.warn("Audio not supported in this browser");
      return;
    }

    // Create daytime audio elements
    const newBackgroundDayAudio = new Audio(backgroundDayAudioFile);
    newBackgroundDayAudio.loop = true;
    newBackgroundDayAudio.volume = AUDIO_VOLUMES.BACKGROUND_DAY;
    newBackgroundDayAudio.preload = "auto";

    const newRustleAudio = new Audio(leavesRustlingAudioFile);
    newRustleAudio.loop = true;
    newRustleAudio.volume = AUDIO_VOLUMES.RUSTLE;
    newRustleAudio.preload = "auto";

    const audioFiles = [newBackgroundDayAudio, newRustleAudio];

    return new Promise<void>((resolve) => {
      let loadedCount = 0;
      const totalFiles = audioFiles.length;

      const checkAllLoaded = () => {
        loadedCount++;
        console.log(`Daytime audio loaded: ${loadedCount}/${totalFiles}`);

        if (loadedCount === totalFiles) {
          console.log("All daytime audio files loaded successfully");
          set({
            audioLoaded: true,
            backgroundDayAudio: newBackgroundDayAudio,
            rustleAudio: newRustleAudio,
            currentBackgroundAudio: newBackgroundDayAudio,
          });
          resolve();
        }
      };

      audioFiles.forEach((audio, index) => {
        const audioNames = ["backgroundDay", "rustle"];
        const audioName = audioNames[index];

        if (audio && audio.readyState >= 2) {
          console.log(`${audioName} already loaded`);
          checkAllLoaded();
        } else {
          if (audio) {
            audio.addEventListener(
              "canplaythrough",
              () => {
                console.log(`${audioName} loaded successfully`);
                checkAllLoaded();
              },
              { once: true }
            );

            audio.addEventListener(
              "error",
              (error: Event) => {
                console.error(`${audioName} loading failed:`, error);
                checkAllLoaded();
              },
              { once: true }
            );
          }
        }
      });

      setTimeout(() => {
        if (loadedCount < totalFiles) {
          console.warn(
            "Daytime audio loading timeout, continuing with loaded files"
          );
          set({
            backgroundDayAudio: loadedCount > 0 ? newBackgroundDayAudio : null,
            rustleAudio: loadedCount > 1 ? newRustleAudio : null,
            currentBackgroundAudio: newBackgroundDayAudio,
          });
          resolve();
        }
      }, 5000);
    });
  },

  loadNightAudio: async () => {
    const {
      backgroundNightAudio: existingBackgroundNight,
      fireCracklingAudio: existingFire,
    } = get();

    // Prevent multiple audio loading
    if (existingBackgroundNight && existingFire) {
      console.log("Night audio already loaded, skipping");
      return;
    }

    console.log("Starting night audio loading...");

    // Check if browser supports audio
    if (typeof Audio === "undefined") {
      console.warn("Audio not supported in this browser");
      return;
    }

    // Create night audio elements
    const newBackgroundNightAudio = new Audio(backgroundNightAudioFile);
    newBackgroundNightAudio.loop = true;
    newBackgroundNightAudio.volume = AUDIO_VOLUMES.BACKGROUND_NIGHT;
    newBackgroundNightAudio.preload = "auto";

    const newFireCracklingAudio = new Audio(fireCracklingAudioFile);
    newFireCracklingAudio.loop = true;
    newFireCracklingAudio.volume = AUDIO_VOLUMES.FIRE_CRACKLING;
    newFireCracklingAudio.preload = "auto";

    const audioFiles = [newBackgroundNightAudio, newFireCracklingAudio];

    return new Promise<void>((resolve) => {
      let loadedCount = 0;
      const totalFiles = audioFiles.length;

      const checkAllLoaded = () => {
        loadedCount++;
        console.log(`Night audio loaded: ${loadedCount}/${totalFiles}`);

        if (loadedCount === totalFiles) {
          console.log("All night audio files loaded successfully");
          set({
            backgroundNightAudio: newBackgroundNightAudio,
            fireCracklingAudio: newFireCracklingAudio,
          });
          resolve();
        }
      };

      audioFiles.forEach((audio, index) => {
        const audioNames = ["backgroundNight", "fireCrackling"];
        const audioName = audioNames[index];

        if (audio && audio.readyState >= 2) {
          console.log(`${audioName} already loaded`);
          checkAllLoaded();
        } else {
          if (audio) {
            audio.addEventListener(
              "canplaythrough",
              () => {
                console.log(`${audioName} loaded successfully`);
                checkAllLoaded();
              },
              { once: true }
            );

            audio.addEventListener(
              "error",
              (error: Event) => {
                console.error(`${audioName} loading failed:`, error);
                checkAllLoaded();
              },
              { once: true }
            );
          }
        }
      });

      setTimeout(() => {
        if (loadedCount < totalFiles) {
          console.warn(
            "Night audio loading timeout, continuing with loaded files"
          );
          set({
            backgroundNightAudio:
              loadedCount > 0 ? newBackgroundNightAudio : null,
            fireCracklingAudio: loadedCount > 1 ? newFireCracklingAudio : null,
          });
          resolve();
        }
      }, 5000);
    });
  },

  loadModel: async () => {
    const { gltfLoader } = get();

    if (!gltfLoader) {
      throw new Error("GLTF loader not initialized");
    }

    return new Promise<void>((resolve, reject) => {
      gltfLoader.load(
        "/scene.glb",
        (gltf) => {
          // Extract individual meshes from the loaded model
          const scene = gltf.scene;
          const hillMesh = scene.children.find(
            (child) => child.name === "hill"
          ) as THREE.Mesh;
          const objectsMesh = scene.children.find(
            (child) => child.name === "objects"
          ) as THREE.Mesh;
          const windowInsideMesh = scene.children.find(
            (child) => child.name === "windowInside"
          ) as THREE.Mesh;

          set({
            hillMesh,
            objectsMesh,
            windowInsideMesh,
          });

          resolve();
        },
        undefined,
        reject
      );
    });
  },

  loadDayTextures: async () => {
    const { textureLoader, ktx2Loader } = get();

    if (!textureLoader || !ktx2Loader) {
      throw new Error("Loaders not initialized");
    }

    const texturePromises: Promise<THREE.Texture>[] = [];
    const ktx2Promises: Promise<THREE.Texture>[] = [];

    // Load regular textures
    texturePromises.push(
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(TEXTURES.BLADE_DIFFUSE, resolve, undefined, reject);
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(TEXTURES.BLADE_ALPHA, resolve, undefined, reject);
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          TEXTURES.PERLIN_NOISE,
          (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            resolve(texture);
          },
          undefined,
          reject
        );
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          TEXTURES.HILL_PATCHES,
          (texture) => {
            texture.flipY = false;
            resolve(texture);
          },
          undefined,
          reject
        );
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(TEXTURES.FLAG_ALPHA, resolve, undefined, reject);
      })
    );

    // Load KTX2 textures
    ktx2Promises.push(
      new Promise<THREE.Texture>((resolve, reject) => {
        ktx2Loader.load(
          TEXTURES.HILL_BAKED_COMPRESSED,
          (texture) => {
            texture.flipY = false;
            resolve(texture);
          },
          undefined,
          reject
        );
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        ktx2Loader.load(
          TEXTURES.OBJECTS_DIFFUSE_COMPRESSED,
          (texture) => {
            texture.flipY = false;
            resolve(texture);
          },
          undefined,
          reject
        );
      })
    );

    try {
      const [
        grass_diffuse,
        grass_alpha,
        perlinNoise,
        hill_patches,
        flag,
        hill_day,
        objects_day,
      ] = await Promise.all([...texturePromises, ...ktx2Promises]);

      set({
        grass_diffuse,
        grass_alpha,
        perlinNoise,
        hill_patches,
        flag,
        hill_day,
        objects_day,
      });
    } catch (error) {
      throw new Error(`Failed to load textures: ${error}`);
    }
  },

  loadNightTextures: async () => {
    const { ktx2Loader } = get();

    if (!ktx2Loader) {
      throw new Error("KTX2 loader not initialized");
    }

    const ktx2Promises: Promise<THREE.Texture>[] = [];

    // Load KTX2 night textures
    ktx2Promises.push(
      new Promise<THREE.Texture>((resolve, reject) => {
        ktx2Loader.load(
          TEXTURES.HILL_BAKED_NIGHT_COMPRESSED,
          (texture) => {
            texture.flipY = false;
            resolve(texture);
          },
          undefined,
          reject
        );
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        ktx2Loader.load(
          TEXTURES.HILL_BAKED_NIGHT_DIM_COMPRESSED,
          (texture) => {
            texture.flipY = false;
            resolve(texture);
          },
          undefined,
          reject
        );
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        ktx2Loader.load(
          TEXTURES.OBJECTS_DIFFUSE_NIGHT_COMPRESSED,
          (texture) => {
            texture.flipY = false;
            resolve(texture);
          },
          undefined,
          reject
        );
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        ktx2Loader.load(
          TEXTURES.OBJECTS_DIFFUSE_NIGHT_DIM_COMPRESSED,
          (texture) => {
            texture.flipY = false;
            resolve(texture);
          },
          undefined,
          reject
        );
      })
    );

    try {
      const [hill_night, hill_nightDim, objects_night, objects_nightDim] =
        await Promise.all(ktx2Promises);

      set({
        hill_night,
        hill_nightDim,
        objects_night,
        objects_nightDim,
      });
    } catch (error) {
      throw new Error(`Failed to load night textures: ${error}`);
    }
  },

  // Audio
  toggleAudio: () => {
    const {
      audioEnabled,
      currentBackgroundAudio,
      fireCracklingAudio,
      started,
    } = get();
    const newAudioEnabled = !audioEnabled;

    set({ audioEnabled: newAudioEnabled });

    if (newAudioEnabled && started && currentBackgroundAudio) {
      currentBackgroundAudio.play().catch(console.error);
    } else {
      if (currentBackgroundAudio) {
        currentBackgroundAudio.pause();
      }
      // Also pause fire audio when audio is toggled off
      if (fireCracklingAudio && !fireCracklingAudio.paused) {
        fireCracklingAudio.pause();
      }
    }
  },

  startBackgroundAudio: () => {
    const { currentBackgroundAudio, audioEnabled, started } = get();

    if (audioEnabled && started && currentBackgroundAudio) {
      currentBackgroundAudio.loop = true;
      currentBackgroundAudio.volume = AUDIO_VOLUMES.BACKGROUND;
      currentBackgroundAudio.play().catch(console.error);
    }
  },

  stopBackgroundAudio: () => {
    const { currentBackgroundAudio } = get();

    if (currentBackgroundAudio) {
      currentBackgroundAudio.pause();
    }
  },

  transitionToDayAudio: () => {
    const { backgroundDayAudio, backgroundNightAudio, audioEnabled, started } =
      get();

    if (!audioEnabled || !started) return;

    // Start day audio if not already playing
    if (backgroundDayAudio && backgroundDayAudio.paused) {
      backgroundDayAudio.volume = 0;
      backgroundDayAudio.play().catch(console.error);
    }

    // Fade out night audio and fade in day audio
    if (backgroundNightAudio && backgroundDayAudio) {
      const startTime = Date.now();
      const duration = NIGHT_TIME_TRANSITION_DURATION * 1000; // Convert to milliseconds

      const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (backgroundNightAudio) {
          backgroundNightAudio.volume =
            AUDIO_VOLUMES.BACKGROUND_NIGHT * (1 - progress);
        }

        if (backgroundDayAudio) {
          backgroundDayAudio.volume = AUDIO_VOLUMES.BACKGROUND_DAY * progress;
        }

        if (progress >= 1) {
          clearInterval(fadeInterval);
          if (backgroundNightAudio) {
            backgroundNightAudio.pause();
            backgroundNightAudio.volume = AUDIO_VOLUMES.BACKGROUND_NIGHT; // Reset volume
          }
          if (backgroundDayAudio) {
            backgroundDayAudio.volume = AUDIO_VOLUMES.BACKGROUND_DAY; // Ensure final volume
          }
        }
      }, 16); // ~60fps
    }

    set({ currentBackgroundAudio: backgroundDayAudio });
  },

  transitionToNightAudio: () => {
    const { backgroundDayAudio, backgroundNightAudio, audioEnabled, started } =
      get();

    if (!audioEnabled || !started) return;

    // Start night audio if not already playing
    if (backgroundNightAudio && backgroundNightAudio.paused) {
      backgroundNightAudio.volume = 0;
      backgroundNightAudio.play().catch(console.error);
    }

    // Fade out day audio and fade in night audio
    if (backgroundDayAudio && backgroundNightAudio) {
      const startTime = Date.now();
      const duration = NIGHT_TIME_TRANSITION_DURATION * 1000; // Convert to milliseconds

      const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (backgroundDayAudio) {
          backgroundDayAudio.volume =
            AUDIO_VOLUMES.BACKGROUND_DAY * (1 - progress);
        }

        if (backgroundNightAudio) {
          backgroundNightAudio.volume =
            AUDIO_VOLUMES.BACKGROUND_NIGHT * progress;
        }

        if (progress >= 1) {
          clearInterval(fadeInterval);
          if (backgroundDayAudio) {
            backgroundDayAudio.pause();
            backgroundDayAudio.volume = AUDIO_VOLUMES.BACKGROUND_DAY; // Reset volume
          }
          if (backgroundNightAudio) {
            backgroundNightAudio.volume = AUDIO_VOLUMES.BACKGROUND_NIGHT; // Ensure final volume
          }
        }
      }, 16); // ~60fps
    }

    set({ currentBackgroundAudio: backgroundNightAudio });
  },

  updateFireAudioVolume: (distance: number) => {
    const { fireCracklingAudio, mode, audioEnabled, started } = get();

    if (!fireCracklingAudio || !audioEnabled || !started) return;

    // Only play fire audio during night mode
    if (mode !== "night") {
      if (!fireCracklingAudio.paused) {
        fireCracklingAudio.pause();
      }
      return;
    }

    // Start playing if not already playing
    if (fireCracklingAudio.paused) {
      fireCracklingAudio.play().catch(console.error);
    }

    // Distance-based volume calculation
    const maxDistance = FIRE_AUDIO_DISTANCES.MAX_DISTANCE;
    const minDistance = FIRE_AUDIO_DISTANCES.MIN_DISTANCE;

    let volume = 0;
    if (distance <= minDistance) {
      volume = AUDIO_VOLUMES.FIRE_CRACKLING; // Full volume when close
    } else if (distance <= maxDistance) {
      // Linear fade from full volume to zero
      const fadeRange = maxDistance - minDistance;
      const fadeProgress = (distance - minDistance) / fadeRange;
      volume = AUDIO_VOLUMES.FIRE_CRACKLING * (1 - fadeProgress);
    } else {
      volume = 0; // No volume when too far
    }

    fireCracklingAudio.volume = volume;
  },

  // Mode
  setDay: () => {
    const { fireCracklingAudio } = get();

    // Stop fire audio when switching to day mode
    if (fireCracklingAudio && !fireCracklingAudio.paused) {
      fireCracklingAudio.pause();
    }

    set({ mode: "day" });
  },

  setNight: () => {
    const { mode } = get();

    if (mode !== "night") {
      set({ mode: "night" });
      get().transitionToNightAudio();
    }
  },

  // Start experience
  start: () => {
    set({ started: true });
    get().startBackgroundAudio();
  },

  // Set complete
  setComplete: () => {
    set({ loadingState: "complete" });
  },
}));
