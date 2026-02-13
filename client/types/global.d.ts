import type { AnimationAction } from "three";

declare global {
  type CharacterAnimationNames = "Idle" | "Talking" | "Talking 2 " | "Talking 3" | "Thinking";
  type CharacterTalkingAnimations = Readonly<
    Exclude<CharacterAnimationNames, "Idle" | "Thinking">
  >[];

  type CharacterAction = {
    playing: keyof CharacterTalkingAnimations[number];
    loading: "Thinking";
    idle: "Idle";
  };

  type CharacterAnimations = Record<CharacterAnimationNames, AnimationAction>;

  interface Message {
    text: string;
    sender: "user" | "klaus";
  }

  interface ChatbotState {
    audioPlayer: HTMLAudioElement | null;
    lipsyncManager: Lipsync | null;
    status: "loading" | "idle" | "playing";
    setupAudioPlayer: () => void;
    playAudio: (url: string) => void;
    messages: Message[];
    sendMessage: (message: string) => void;
    loaded: boolean;
  }
}
