import { Environment, Gltf } from "@react-three/drei";
import { } from "./character";
import { CameraManager, Character } from "@/components";
import { degToRad } from "three/src/math/MathUtils.js";
import { SceneGLB } from "@/assets";

export const Experience = () => (
  <>
    <CameraManager />
    <Character />
    <Environment preset="sunset" />
    <Gltf rotation-y={degToRad(-20)} position-y={7.72} src={SceneGLB}/>
  </>
);
