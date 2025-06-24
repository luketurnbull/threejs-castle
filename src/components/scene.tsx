import type { JSX } from "react";
import Grass from "./grass";
import Windows from "./windows";
import Flag from "./flag";
import Objects from "./objects";
import Smoke from "./smoke";
import { KTX2Loader } from "three-stdlib";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { Model } from "@/types/model";

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath("/basis/");

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  const { gl } = useThree();

  const { nodes } = useGLTF("/scene.glb", true, true, (loader) => {
    loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
  }) as unknown as Model;

  return (
    <group {...props} dispose={null}>
      <Flag />
      <Windows geometry={nodes.windowInside.geometry} />
      <Objects geometry={nodes.objects.geometry} />
      <Smoke />
      <Grass geometry={nodes.hill.geometry} />
    </group>
  );
}
