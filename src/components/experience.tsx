import { OrbitControls } from "@react-three/drei";

export const Experience = () => (
  <>
    <OrbitControls />
    <mesh>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  </>
);
