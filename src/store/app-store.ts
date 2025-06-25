import { create } from "zustand";
import backgroundSounds from "../assets/background.mp3";
import rustleAudio from "../assets/leavesRustling2.mp3";
import * as THREE from "three";
import { GLTFLoader, KTX2Loader, DRACOLoader } from "three-stdlib";
import { TextureLoader } from "three";
import { TEXTURES } from "@/constants/assets";

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Initial camera position looking at the center
camera.position.set(-150, 0, 0);
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
  isLoading: boolean;
  started: boolean;

  // Audio state
  audioEnabled: boolean;
  backgroundAudio: HTMLAudioElement;
  rustleAudio: HTMLAudioElement;

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

  // Mode
  setDay: () => void;
  setNight: () => void;

  // Start experience
  start: () => void;

  // Set complete
  setComplete: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  loadingState: "idle",
  isLoading: false,
  started: false,
  audioEnabled: true,
  backgroundAudio: new Audio(backgroundSounds),
  rustleAudio: new Audio(rustleAudio),
  mode: "day",
  camera,
  renderer: null,
  gltfLoader: null,
  ktx2Loader: null,
  textureLoader: null,
  dracoLoader: null,
  hillMesh: null,
  objectsMesh: null,
  windowInsideMesh: null,
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
    set({ isLoading: true, loadingState: "loading-sky" });

    try {
      // Step 2: Load audio
      set({ loadingState: "loading-audio" });
      await get().loadAudio();

      console.log("loadAudio");

      // Step 3: Load model
      set({ loadingState: "loading-model" });
      await get().loadModel();

      console.log("loadModel");

      // Step 4: Load day textures
      set({ loadingState: "loading-textures" });
      await get().loadDayTextures();

      console.log("loadDayTextures");

      // Step 5: Set daytime complete and load night textures
      set({ loadingState: "daytime-complete" });
      await get().loadNightTextures();

      console.log("loadNightTextures");

      // Step 6: Set night-time complete (scene animation will set to complete)
      set({ loadingState: "night-time-complete", isLoading: false });
    } catch (error) {
      console.error("Loading sequence failed:", error);
      set({ loadingState: "idle", isLoading: false });
    }
  },

  loadAudio: async () => {
    const { backgroundAudio, rustleAudio } = get();

    const audioFiles = [backgroundAudio, rustleAudio];

    return new Promise<void>((resolve) => {
      let loadedCount = 0;
      const totalFiles = audioFiles.length;

      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalFiles) {
          resolve();
        }
      };

      audioFiles.forEach((audio) => {
        // Preload each audio file
        audio.addEventListener("canplaythrough", checkAllLoaded, {
          once: true,
        });
        audio.addEventListener(
          "error",
          (error) => {
            console.warn(
              "Audio loading failed, continuing without audio:",
              error
            );
            checkAllLoaded(); // Continue even if audio fails
          },
          { once: true }
        );

        // Start loading the audio
        audio.load();
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
