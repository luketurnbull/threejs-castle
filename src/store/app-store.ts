import { create } from "zustand";
import backgroundNightAudioFile from "../assets/backgroundNight.mp3";
import leavesRustlingAudioFile from "../assets/leavesRustling.mp3";
import backgroundDayAudioFile from "../assets/backgroundDay.wav";
import fireCracklingAudioFile from "../assets/fireCrackling.wav";
import * as THREE from "three";
import { GLTFLoader, KTX2Loader, DRACOLoader } from "three-stdlib";
import { TextureLoader } from "three";
import { TEXTURES } from "@/constants/assets";
import { AUDIO_VOLUMES } from "@/constants/audio";
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
  | "loading-sky"
  | "loading-audio"
  | "loading-model"
  | "loading-textures"
  | "daytime-complete"
  | "night-time-complete"
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
  loadAudio: () => Promise<void>;
  loadModel: () => Promise<void>;
  loadDayTextures: () => Promise<void>;
  loadNightTextures: () => Promise<void>;

  // Audio
  toggleAudio: () => void;
  startBackgroundAudio: () => void;
  stopBackgroundAudio: () => void;
  transitionToDayAudio: () => void;
  transitionToNightAudio: () => void;

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
    const ktx2Loader = new KTX2Loader();
    const gltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();
    const dracoLoader = new DRACOLoader();

    // Set up DRACO compression
    dracoLoader.setDecoderPath("/draco/");
    dracoLoader.setDecoderConfig({ type: "js" });

    ktx2Loader.setTranscoderPath("/basis/");
    gltfLoader.setKTX2Loader(ktx2Loader.detectSupport(renderer));
    gltfLoader.setDRACOLoader(dracoLoader);

    set({
      renderer,
      gltfLoader,
      ktx2Loader,
      textureLoader,
      dracoLoader,
    });

    await get().startLoadingSequence();
  },

  // Loading sequence
  startLoadingSequence: async () => {
    console.log("Starting loading sequence");
    set({ loadingState: "loading-sky" });

    console.log("App initialized, loading audio");

    try {
      // Step 2: Load audio
      set({ loadingState: "loading-audio" });
      await get().loadAudio();

      console.log("Audio loaded, loading model");

      // Step 3: Load model
      set({ loadingState: "loading-model" });
      await get().loadModel();

      console.log("Model loaded, loading day textures");

      // Step 4: Load day textures
      set({ loadingState: "loading-textures" });
      await get().loadDayTextures();

      console.log("Day textures loaded, loading night textures");

      // Step 5: Set daytime complete and load night textures
      set({ loadingState: "daytime-complete" });
      await get().loadNightTextures();
    } catch (error) {
      console.error("Loading sequence failed:", error);
      set({ loadingState: "idle" });
    }
  },

  loadAudio: async () => {
    // Create audio elements during loading
    const backgroundDayAudio = new Audio(backgroundDayAudioFile);
    // Set initial properties
    backgroundDayAudio.loop = true;
    backgroundDayAudio.volume = AUDIO_VOLUMES.BACKGROUND_DAY;

    const backgroundNightAudio = new Audio(backgroundNightAudioFile);
    backgroundNightAudio.loop = true;
    backgroundNightAudio.volume = AUDIO_VOLUMES.BACKGROUND_NIGHT;

    const rustleAudio = new Audio(leavesRustlingAudioFile);
    rustleAudio.loop = true;
    rustleAudio.volume = AUDIO_VOLUMES.RUSTLE;

    const fireCracklingAudio = new Audio(fireCracklingAudioFile);
    fireCracklingAudio.loop = true;
    fireCracklingAudio.volume = AUDIO_VOLUMES.FIRE_CRACKLING;

    const audioFiles = [
      backgroundDayAudio,
      backgroundNightAudio,
      rustleAudio,
      fireCracklingAudio,
    ];

    return new Promise<void>((resolve) => {
      let loadedCount = 0;
      const totalFiles = audioFiles.length;

      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalFiles) {
          set({
            audioLoaded: true,
            backgroundDayAudio,
            backgroundNightAudio,
            rustleAudio,
            fireCracklingAudio,
            currentBackgroundAudio: backgroundDayAudio, // Start with day audio
          });

          resolve();
        }
      };

      audioFiles.forEach((audio) => {
        // Check if audio is already loaded
        if (audio && audio.readyState >= 2) {
          // HAVE_CURRENT_DATA
          checkAllLoaded();
        } else {
          // Wait for audio to be ready
          if (audio) {
            audio.addEventListener("canplaythrough", checkAllLoaded, {
              once: true,
            });

            audio.addEventListener(
              "error",
              (error: Event) => {
                console.warn(
                  "Audio loading failed, continuing without audio:",
                  error
                );
                checkAllLoaded(); // Continue even if audio fails
              },
              { once: true }
            );
          }
        }
      });
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
    const { audioEnabled, currentBackgroundAudio, started } = get();
    const newAudioEnabled = !audioEnabled;

    set({ audioEnabled: newAudioEnabled });

    if (newAudioEnabled && started && currentBackgroundAudio) {
      currentBackgroundAudio.play().catch(console.error);
    } else {
      if (currentBackgroundAudio) {
        currentBackgroundAudio.pause();
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

  // Mode
  setDay: () => {
    const { mode } = get();
    if (mode !== "day") {
      set({ mode: "day" });
      get().transitionToDayAudio();
    }
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
