import { Gltf, useTexture } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { AppearanceMode, RenderMode, VFXEmitter, VFXParticles } from "wawa-vfx";
import { CameraManager } from "./camera-manager";
import { Character } from "./character";
import { SceneGLB, StarPNG } from "@/assets";

useTexture.preload(StarPNG);

export const Experience = () => {
  const snowTexture = useTexture(StarPNG);

  return (
    <>
      <CameraManager />

      {/* Character */}
      <Character rotation-y={degToRad(10)} scale={0.6} />

      {/* Lights */}
      <directionalLight
        position={[-10, 15, 10]}
        intensity={2.5}
        color="white"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[3, 3, 10]} intensity={1.2} color="mediumpurple" />
      <directionalLight position={[0, 0, -10]} intensity={9} color="orange" />

      {/* Shadow receiving plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial color="#21282a" opacity={0.5} />
      </mesh>

      {/* Scene GLB */}
      <Gltf rotation-y={degToRad(-20)} position-y={7.72} src={SceneGLB} receiveShadow />

      {/* Snow VFX */}
      <VFXParticles
        name="snow"
        settings={{
          nbParticles: 10000,
          gravity: [1, -3, 0],
          renderMode: RenderMode.Billboard,
          appearance: AppearanceMode.Circular,
          intensity: 18,
          fadeSize: [0, 0.5],
          fadeAlpha: [0, 0],
        }}
        alphaMap={snowTexture}
      />
      <VFXEmitter
        emitter="snow"
        settings={{
          duration: 2,
          nbParticles: 1000,
          loop: true,
          spawnMode: "time",
          startPositionMin: [-20, 25, -50],
          startPositionMax: [10, 20, 50],
          directionMin: [-5, 0, 5],
          directionMax: [5, -1, 5],
          particlesLifetime: [0.5, 5],
          speed: [0.1, 4],
          size: [0.01, 1],
          colorStart: ["white", "skyblue", "#fff98b"],
        }}
      />
    </>
  );
};
