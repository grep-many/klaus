import { KlausGLB } from "@/assets";
import useChatbot from "@/hooks/use-chatbot";
import { isSkinnedMesh } from "@/utils/validate-mesh";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { type JSX } from "react";
import type { Object3D, SkinnedMesh } from "three";
import { lerp, randInt } from "three/src/math/MathUtils.js";
import { VISEMES } from "wawa-lipsync";

type Props = JSX.IntrinsicElements["group"];

export const Character = ({ ...props }: Props) => {
  const { scene, animations } = useGLTF(KlausGLB);
  const [animation, setAnimation] = React.useState<CharacterAnimationNames>("Idle");
  const { lipsyncManager, status } = useChatbot();

  const { actions, mixer } = useAnimations(animations, scene);

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
    let nextAnimation: CharacterAnimationNames;
    // const talkingAnimations= ["Talking", "Talking 2", "Talking 3"] as const;
    const talkingAnimations: CharacterTalkingAnimations = ["Talking", "Talking 2 ", "Talking 3"];
    switch (status) {
      case "loading":
        nextAnimation = "Thinking";
        break;
      case "idle":
        nextAnimation = "Idle";
        break;
      case "playing":
        nextAnimation = talkingAnimations[randInt(0, talkingAnimations.length - 1)];
        break;

      default:
        nextAnimation = "Idle";
        break;
    }
    setAnimation(nextAnimation);
  }, [status]);

  React.useEffect(() => {
    const characterAnimation: CharacterAnimations[CharacterAnimationNames] =
      characterActions[animation];
    if (!characterAnimation) return;
    if (mixer.time < 0.01) {
      characterAnimation.reset().play();
    } else {
      characterAnimation.reset().fadeIn(0.5).play();
    }

    return () => {
      characterAnimation.fadeOut(0.5);
    };
  }, [characterActions, animation]);

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
