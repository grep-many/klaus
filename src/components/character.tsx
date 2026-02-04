import { KlausGLB } from "@/assets";
import useChatbot from "@/hooks/use-chatbot";
import { useAnimations, useGLTF } from "@react-three/drei";
import React, { type JSX } from "react";

type Props = JSX.IntrinsicElements["group"];

export const Character = ({ ...props }: Props) => {
  const { scene, animations } = useGLTF(KlausGLB);

  const lipsync = useChatbot((state) => state.lipsyncManager);

  const { actions } = useAnimations(animations, scene);

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
