import { create } from "zustand";
import backgroundSounds from "../assets/background.mp3";
import * as THREE from "three";
import { GLTFLoader, KTX2Loader } from "three-stdlib";
import { TextureLoader } from "three";
import { TEXTURES } from "@/constants/assets";
import gsap from "gsap";

export type Mode = "day" | "night";
export type LoadingState =
  | "idle"
  | "loading-sky"
  | "loading-model"
  | "loading-textures"
  | "complete";

interface AppState {
  // Loading state
  loadingState: LoadingState;
  isLoading: boolean;

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
  loadSkyAndClouds: () => Promise<void>;
  loadModel: () => Promise<void>;
  loadDayTextures: () => Promise<void>;
  loadNightTextures: () => Promise<void>;
  moveCameraToScene: () => void;

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

// Initial camera position looking up at the sky
camera.position.set(150, 0, 0);
camera.lookAt(0, 200, 0);

export const useAppStore = create<AppState>((set, get) => ({
  loadingState: "idle",
  isLoading: false,
  audioEnabled: true,
  backgroundAudio: new Audio(backgroundSounds),
  mode: "day",
  camera,
  renderer: null,
  gltfLoader: null,
  ktx2Loader: null,
  textureLoader: null,
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

    ktx2Loader.setTranscoderPath("/basis/");
    gltfLoader.setKTX2Loader(ktx2Loader.detectSupport(renderer));

    set({
      renderer,
      gltfLoader,
      ktx2Loader,
      textureLoader,
    });

    await get().startLoadingSequence();
  },

  // Loading sequence
  startLoadingSequence: async () => {
    set({ isLoading: true, loadingState: "loading-sky" });

    console.log("startLoadingSequence");

    try {
      // Step 1: Load sky and clouds (camera already pointing up)
      await get().loadSkyAndClouds();

      console.log("loadSkyAndClouds");

      // Step 2: Load model
      set({ loadingState: "loading-model" });
      await get().loadModel();

      console.log("loadModel");

      // Step 3: Load day textures
      set({ loadingState: "loading-textures" });
      await get().loadDayTextures();

      console.log("loadDayTextures");

      // Step 4: Move camera to scene and complete
      get().moveCameraToScene();
      set({ loadingState: "complete", isLoading: false });
    } catch (error) {
      console.error("Loading sequence failed:", error);
      set({ loadingState: "idle", isLoading: false });
    }
  },

  loadSkyAndClouds: async () => {
    // Sky and clouds are loaded by Drei components, so we just wait a bit
    // to ensure they're rendered before proceeding
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
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

  moveCameraToScene: () => {
    const { camera } = get();

    // Create a target object to animate
    const target = new THREE.Vector3(0, 200, 0); // Start looking up at the sky

    // Use GSAP to animate the lookAt target
    gsap.to(target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        // Update the camera's lookAt target on each frame
        camera.lookAt(target);
      },
    });
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
