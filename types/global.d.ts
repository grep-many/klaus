import type { AnimationAction } from "three";

declare global {
  type CharacterAnimationNames = "Idle" | "Talking" | "Talking 2 " | "Talking 3" | "Thinking";

  type CharacterAnimations = Record<CharacterAnimationNames, AnimationAction>;
}
