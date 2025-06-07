import * as THREE from "three";
import { useEffect, useRef, type JSX } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { type GLTF } from "three-stdlib";
import "./grass-material/grassMaterial";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    hill: THREE.Mesh;
    towerMainShaft: THREE.Mesh;
    windowInside: THREE.Mesh;
  };
};

export function Tower(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF(
    "/tower-with-hill-3.glb",
    true
  ) as unknown as GLTFResult;

  const diffuse = useTexture("./towerDiffuse.png");
  diffuse.flipY = false;

  useEffect(() => {
    const geometry = nodes.towerMainShaft.geometry;
    geometry.attributes.uv = geometry.attributes.uv1;
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  const shadowMap = useTexture("./hillShadow.png");
  shadowMap.flipY = false;

  return (
    <group {...props} dispose={null}>
      <Grass />
      <mesh
        geometry={nodes.towerMainShaft.geometry}
        position={[-1.617, 0, 0.229]}
        scale={10}
      >
        <meshStandardMaterial map={diffuse} />
      </mesh>
      <mesh
        geometry={nodes.windowInside.geometry}
        material={nodes.windowInside.material}
        position={[-11.648, 28.151, -0.501]}
        rotation={[-0.012, 0.044, 0.001]}
        scale={[0.226, 0.226, 0.5]}
      />
    </group>
  );
}

function createBladeGeometry() {
  // Simple vertical plane for a grass blade
  const geometry = new THREE.PlaneGeometry(0.12, 1, 1, 4);
  geometry.translate(0, 0.5, 0); // Move base to y=0
  return geometry;
}

function Grass() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { nodes } = useGLTF(
    "/tower-with-hill-3.glb",
    true
  ) as unknown as GLTFResult;
  const hillRef = useRef<THREE.Mesh>(null!);

  const texture = useTexture("./blade_diffuse.jpg");
  const alphaMap = useTexture("./blade_alpha.jpg");
  const aoMap = useTexture("./hillShadow.png");

  const NUM_BLADES = 80000;
  const baseGeom = createBladeGeometry();
  const hillGeom = nodes.hill.geometry;
  const hillScale = new THREE.Vector3(119.355, 60.27, 119.355);

  const offsets = [];
  const orientations = [];
  const stretches = [];
  const halfRootAngleSin = [];
  const halfRootAngleCos = [];
  const hillUVs = [];

  for (let i = 0; i < NUM_BLADES; i++) {
    // Sample point, normal, and barycentric info
    const position = hillGeom.attributes.position;
    const index = hillGeom.index;
    const faceCount = index ? index.count / 3 : position.count / 3;
    const faceIndex = Math.floor(Math.random() * faceCount);

    let a, b, c;

    if (index) {
      a = index.getX(faceIndex * 3);
      b = index.getX(faceIndex * 3 + 1);
      c = index.getX(faceIndex * 3 + 2);
    } else {
      a = faceIndex * 3;
      b = faceIndex * 3 + 1;
      c = faceIndex * 3 + 2;
    }

    const vA = new THREE.Vector3().fromBufferAttribute(position, a);
    const vB = new THREE.Vector3().fromBufferAttribute(position, b);
    const vC = new THREE.Vector3().fromBufferAttribute(position, c);

    // Barycentric coordinates
    const r1 = Math.random();
    const r2 = Math.random();
    const sqrtR1 = Math.sqrt(r1);
    const u = 1 - sqrtR1;
    const v = sqrtR1 * (1 - r2);
    const w = sqrtR1 * r2;
    const point = new THREE.Vector3()
      .addScaledVector(vA, u)
      .addScaledVector(vB, v)
      .addScaledVector(vC, w);

    // Normal
    const nA = new THREE.Vector3().fromBufferAttribute(
      hillGeom.attributes.normal,
      a
    );

    const nB = new THREE.Vector3().fromBufferAttribute(
      hillGeom.attributes.normal,
      b
    );

    const nC = new THREE.Vector3().fromBufferAttribute(
      hillGeom.attributes.normal,
      c
    );

    const normal = new THREE.Vector3()
      .addScaledVector(nA, u)
      .addScaledVector(nB, v)
      .addScaledVector(nC, w)
      .normalize();

    // Interpolated UV
    const uvAttr = hillGeom.attributes.uv;
    const uvA = new THREE.Vector2().fromBufferAttribute(
      uvAttr as THREE.BufferAttribute,
      a
    );

    const uvB = new THREE.Vector2().fromBufferAttribute(
      uvAttr as THREE.BufferAttribute,
      b
    );

    const uvC = new THREE.Vector2().fromBufferAttribute(
      uvAttr as THREE.BufferAttribute,
      c
    );

    const uv = new THREE.Vector2()
      .addScaledVector(uvA, u)
      .addScaledVector(uvB, v)
      .addScaledVector(uvC, w);
    hillUVs.push(uv.x, uv.y);

    // Apply scale
    point.multiply(hillScale);
    offsets.push(point.x, point.y, point.z);

    // Orientation: align Y axis with normal
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
    orientations.push(quat.x, quat.y, quat.z, quat.w);

    // Random stretch
    const stretch = 0.7 + Math.random() * 0.6;
    stretches.push(stretch);

    // Random root angle for bending
    const rootAngle = Math.random() * Math.PI * 2;
    halfRootAngleSin.push(Math.sin(0.5 * rootAngle));
    halfRootAngleCos.push(Math.cos(0.5 * rootAngle));
  }
  const grassAttributes = {
    offsets,
    orientations,
    stretches,
    halfRootAngleSin,
    halfRootAngleCos,
    hillUVs,
  };

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <group>
      <mesh>
        <instancedBufferGeometry
          index={baseGeom.index}
          attributes-position={baseGeom.attributes.position}
          attributes-uv={baseGeom.attributes.uv}
        >
          <instancedBufferAttribute
            attach={"attributes-offset"}
            args={[new Float32Array(grassAttributes.offsets), 3]}
          />
          <instancedBufferAttribute
            attach={"attributes-orientation"}
            args={[new Float32Array(grassAttributes.orientations), 4]}
          />
          <instancedBufferAttribute
            attach={"attributes-stretch"}
            args={[new Float32Array(grassAttributes.stretches), 1]}
          />
          <instancedBufferAttribute
            attach={"attributes-halfRootAngleSin"}
            args={[new Float32Array(grassAttributes.halfRootAngleSin), 1]}
          />
          <instancedBufferAttribute
            attach={"attributes-halfRootAngleCos"}
            args={[new Float32Array(grassAttributes.halfRootAngleCos), 1]}
          />
          <instancedBufferAttribute
            attach={"attributes-hillUv"}
            args={[new Float32Array(grassAttributes.hillUVs), 2]}
          />
        </instancedBufferGeometry>
        <grassMaterial
          ref={materialRef}
          map={texture}
          alphaMap={alphaMap}
          toneMapped={false}
          transparent={true}
          side={THREE.DoubleSide}
          bladeHeight={4}
          brightness={5.0}
          aoMap={aoMap}
        />
      </mesh>
      <mesh
        ref={hillRef}
        geometry={nodes.hill.geometry}
        scale={[119.355, 60.27, 119.355]}
        visible={true}
      >
        <meshStandardMaterial color="#270f0a" />
      </mesh>
    </group>
  );
}

useGLTF.preload("/tower-with-hill-3.glb", true);
