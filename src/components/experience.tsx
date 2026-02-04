import { Environment, OrbitControls } from "@react-three/drei";
import { Character } from "./character";

export const Experience = () => (
  <>
    <OrbitControls />
    <Character/>
    <Environment preset="sunset"/>
  </>
);
