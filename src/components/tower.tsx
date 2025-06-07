import * as THREE from "three";
import { useEffect, useMemo, useRef, type JSX } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { Geometry, type GLTF } from "three-stdlib";
import { createNoise2D } from "simplex-noise";
import "./grassMaterial";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    hill: THREE.Mesh;
    towerMainShaft: THREE.Mesh;
    windowInside: THREE.Mesh;
  };
};

export function Tower(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/tower-with-hill-3.glb") as unknown as GLTFResult;

  const diffuse = useTexture("./towerDiffuse.png");
  diffuse.flipY = false;

  useEffect(() => {
    const geometry = nodes.towerMainShaft.geometry;

    // Check which UV map has the correct layout
    console.log("UV map 0 (uv):", geometry.attributes.uv.array.slice(0, 10));
    console.log("UV map 1 (uv1):", geometry.attributes.uv1.array.slice(0, 10));

    // Use the second UV map (likely your baking UV)
    geometry.attributes.uv = geometry.attributes.uv1;

    // Force geometry to update
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  const shadowMap = useTexture("./hillShadow.png");
  shadowMap.flipY = false;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.hill.geometry}
        scale={[119.355, 60.27, 119.355]}
      >
        <meshStandardMaterial color={"green"} aoMap={shadowMap} />
      </mesh>
      <Grass />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.towerMainShaft.geometry}
        position={[-1.617, 0, 0.229]}
        scale={10}
      >
        <meshStandardMaterial map={diffuse} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windowInside.geometry}
        material={nodes.windowInside.material}
        position={[-11.648, 28.151, -0.501]}
        rotation={[-0.012, 0.044, 0.001]}
        scale={[0.226, 0.226, 0.5]}
      />
    </group>
  );
}

useGLTF.preload("/tower-with-hill-3.glb");

const noise2D = createNoise2D();

function Grass({
  options = { bW: 0.12, bH: 1, joints: 5 },
  width = 100,
  instances = 50000,
  ...props
}) {
  const { bW, bH, joints } = options;
  const materialRef = useRef(null!);

  const texture = useTexture("./blade_diffuse.jpg");
  const alphaMap = useTexture("./blade_alpha.jpg");

  const attributeData = useMemo(
    () => getAttributeData(instances, width),
    [instances, width]
  );

  const baseGeom = useMemo(
    () => new THREE.PlaneGeometry(bW, bH, 1, joints).translate(0, bH / 2, 0),
    [options]
  );

  const groundGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const segments = 32;
    const vertices = [];
    const indices = [];

    // Create vertices
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments) * width - width / 2;
        const z = (j / segments) * width - width / 2;
        const y = getYPosition(x, z);
        vertices.push(x, y, z);
      }
    }

    // Create indices
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return geo;
  }, [width]);

  useFrame(
    (state) =>
      (materialRef.current.uniforms.time.value = state.clock.elapsedTime / 4)
  );

  return (
    <group {...props}>
      <mesh>
        <instancedBufferGeometry
          index={baseGeom.index}
          attributes-position={baseGeom.attributes.position}
          attributes-uv={baseGeom.attributes.uv}
        >
          <instancedBufferAttribute
            attach={"attributes-offset"}
            args={[new Float32Array(attributeData.offsets), 3]}
          />
          <instancedBufferAttribute
            attach={"attributes-orientation"}
            args={[new Float32Array(attributeData.orientations), 4]}
          />
          <instancedBufferAttribute
            attach={"attributes-stretch"}
            args={[new Float32Array(attributeData.stretches), 1]}
          />
          <instancedBufferAttribute
            attach={"attributes-halfRootAngleSin"}
            args={[new Float32Array(attributeData.halfRootAngleSin), 1]}
          />
          <instancedBufferAttribute
            attach={"attributes-halfRootAngleCos"}
            args={[new Float32Array(attributeData.halfRootAngleCos), 1]}
          />
        </instancedBufferGeometry>
        <grassMaterial
          ref={materialRef}
          map={texture}
          alphaMap={alphaMap}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0]} geometry={groundGeo}>
        <meshStandardMaterial color="#000f00" />
      </mesh>
    </group>
  );
}

function getAttributeData(instances, width) {
  const offsets = [];
  const orientations = [];
  const stretches = [];
  const halfRootAngleSin = [];
  const halfRootAngleCos = [];

  let quaternion_0 = new THREE.Vector4();
  const quaternion_1 = new THREE.Vector4();

  //The min and max angle for the growth direction (in radians)
  const min = -0.25;
  const max = 0.25;

  //For each instance of the grass blade
  for (let i = 0; i < instances; i++) {
    //Offset of the roots
    const offsetX = Math.random() * width - width / 2;
    const offsetZ = Math.random() * width - width / 2;
    const offsetY = getYPosition(offsetX, offsetZ);
    offsets.push(offsetX, offsetY, offsetZ);

    //Define random growth directions
    //Rotate around Y
    let angle = Math.PI - Math.random() * (2 * Math.PI);
    halfRootAngleSin.push(Math.sin(0.5 * angle));
    halfRootAngleCos.push(Math.cos(0.5 * angle));

    let RotationAxis = new THREE.Vector3(0, 1, 0);
    let x = RotationAxis.x * Math.sin(angle / 2.0);
    let y = RotationAxis.y * Math.sin(angle / 2.0);
    let z = RotationAxis.z * Math.sin(angle / 2.0);
    let w = Math.cos(angle / 2.0);
    quaternion_0.set(x, y, z, w).normalize();

    //Rotate around X
    angle = Math.random() * (max - min) + min;
    RotationAxis = new THREE.Vector3(1, 0, 0);
    x = RotationAxis.x * Math.sin(angle / 2.0);
    y = RotationAxis.y * Math.sin(angle / 2.0);
    z = RotationAxis.z * Math.sin(angle / 2.0);
    w = Math.cos(angle / 2.0);
    quaternion_1.set(x, y, z, w).normalize();

    //Combine rotations to a single quaternion
    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

    //Rotate around Z
    angle = Math.random() * (max - min) + min;
    RotationAxis = new THREE.Vector3(0, 0, 1);
    x = RotationAxis.x * Math.sin(angle / 2.0);
    y = RotationAxis.y * Math.sin(angle / 2.0);
    z = RotationAxis.z * Math.sin(angle / 2.0);
    w = Math.cos(angle / 2.0);
    quaternion_1.set(x, y, z, w).normalize();

    //Combine rotations to a single quaternion
    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

    orientations.push(
      quaternion_0.x,
      quaternion_0.y,
      quaternion_0.z,
      quaternion_0.w
    );

    //Define variety in height
    if (i < instances / 3) {
      stretches.push(Math.random() * 1.8);
    } else {
      stretches.push(Math.random());
    }
  }

  return {
    offsets,
    orientations,
    stretches,
    halfRootAngleCos,
    halfRootAngleSin,
  };
}

function multiplyQuaternions(q1, q2) {
  const x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
  const y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
  const z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
  const w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
  return new THREE.Vector4(x, y, z, w);
}

function getYPosition(x, z) {
  let y = 2 * noise2D(x / 50, z / 50);
  y += 4 * noise2D(x / 100, z / 100);
  y += 0.2 * noise2D(x / 10, z / 10);
  return y;
}
