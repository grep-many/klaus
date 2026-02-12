import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { Mesh, MeshPhysicalMaterial, Object3D, SkinnedMesh } from "three";
import { lerp, randInt } from "three/src/math/MathUtils.js";
import { VISEMES } from "wawa-lipsync";
import useChatbot from "@/hooks/use-chatbot";
import { KlausGLB } from "@/assets";

export const Character = ({ ...props }: JSX.IntrinsicElements["group"]) => {
  const { scene, animations } = useGLTF(KlausGLB);
  const [animation, setAnimation] = useState("Idle");
  const { lipsyncManager, status } = useChatbot();

  const { actions, mixer } = useAnimations(animations, scene);

  // --- Setup shadows and materials ---
  useEffect(() => {
    scene.traverse((child: Object3D) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = false; // Character does not need receiveShadow
        child.frustumCulled = false;

        // Convert all materials to MeshPhysicalMaterial for proper shadowing
        const oldMaterial = child.material;
        const createPhysical = (mat: MeshPhysicalMaterial) =>
          new MeshPhysicalMaterial({
            color: mat.color,
            map: mat.map,
            normalMap: mat.normalMap,
            roughness: 1,
            ior: 2.2,
            iridescence: 0.7,
            iridescenceIOR: 1.3,
            reflectivity: 1,
            transparent: false,
            opacity: 1,
          });

        if (Array.isArray(oldMaterial)) {
          child.material = oldMaterial.map((mat) => createPhysical(mat as MeshPhysicalMaterial));
        } else {
          child.material = createPhysical(oldMaterial as MeshPhysicalMaterial);
        }
      }
    });
  }, [scene]);

  // --- Skinned meshes for lip sync ---
  const avatarSkinnedMeshes = useMemo(() => {
    const meshes: SkinnedMesh[] = [];
    scene.traverse((child) => {
      if ((child as SkinnedMesh).isSkinnedMesh) meshes.push(child as SkinnedMesh);
    });
    return meshes;
  }, [scene]);

  const lerpMorphTarget = useCallback(
    (target: VISEMES, value: number, speed = 0.1) => {
      avatarSkinnedMeshes.forEach((mesh) => {
        if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
        const morphIndex = mesh.morphTargetDictionary[target];
        if (morphIndex !== undefined) {
          mesh.morphTargetInfluences[morphIndex] = lerp(
            mesh.morphTargetInfluences[morphIndex],
            value,
            speed,
          );
        }
      });
    },
    [avatarSkinnedMeshes],
  );

  useFrame(() => {
    if (!lipsyncManager) return;
    lipsyncManager.processAudio();
    const currentViseme = lipsyncManager.viseme;
    Object.values(VISEMES).forEach((viseme) =>
      lerpMorphTarget(viseme, viseme === currentViseme ? 1 : 0, 0.1),
    );
  });

  // --- Animation switching ---
  useEffect(() => {
    const id = setTimeout(() => {
      let nextAnimation: string;
      const talkingAnimations = ["Talking", "Talking 2 ", "Talking 3"];
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
      }
      setAnimation(nextAnimation);
    }, 0);

    return () => clearTimeout(id);
  }, [status]);

  useEffect(() => {
    const action = actions[animation];
    if (!action) return;
    if (mixer.time < 0.01) {
      action.reset().play();
    } else {
      action.reset().fadeIn(0.5).play();
    }
    return () => {
      action.fadeOut(0.5);
    };
  }, [animation, actions, mixer]);

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload(KlausGLB);
