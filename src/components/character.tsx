import { KlausGLB } from "@/assets";
import useChatbot from "@/hooks/use-chatbot";
import { isSkinnedMesh } from "@/utils/validate-mesh";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { type JSX } from "react";
import type { Object3D, SkinnedMesh } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { VISEMES } from "wawa-lipsync";

type Props = JSX.IntrinsicElements["group"];

export const Character = ({ ...props }: Props) => {
  const { scene, animations } = useGLTF(KlausGLB);

  const lipsyncManager = useChatbot((state) => state.lipsyncManager);

  const { actions } = useAnimations(animations, scene);

  const avatarSkinMesh = React.useMemo(() => {
    const meshes: SkinnedMesh[] = [];
    scene.traverse((child: Object3D) => {
      if (isSkinnedMesh(child)) {
        meshes.push(child);
      }
    });
    return meshes;
  }, [scene]);

  const lerpMorphTarget = React.useCallback(
    (target: VISEMES, value: number, speed = 0.1) => {
      avatarSkinMesh.forEach((mesh) => {
        if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
        const morphIndex = mesh.morphTargetDictionary[target];
        if (!morphIndex) return;
        const current = mesh.morphTargetInfluences[morphIndex];
        mesh.morphTargetInfluences[morphIndex] = lerp(current, value, speed);
      });
    },
    [avatarSkinMesh],
  );

  useFrame(() => {
    if (!lipsyncManager) return;
    lipsyncManager.processAudio();
    const current = lipsyncManager.viseme;

    Object.values(VISEMES).forEach((viseme) =>
      lerpMorphTarget(viseme, viseme === current ? 1 : 0, 0.1),
    );
  });

  const characterActions = actions as CharacterAnimations;

  React.useEffect(() => {
    characterActions["Idle"].play();
  }, [characterActions]);

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload(KlausGLB);
