import { Lipsync } from "wawa-lipsync";
import { create } from "zustand";

type ChatbotState = {
  audioPlayer: HTMLAudioElement | null;
  lipsyncManager: Lipsync | null;
  setupAudioPlayer: () => void;
  playAudio: (url: string) => void;
};

const useChatbot = create<ChatbotState>((set, get) => ({
  audioPlayer: null,
  lipsyncManager: null,
  setupAudioPlayer: () => {
    if (!Audio) return;
    const audioPlayer = new Audio();
    audioPlayer.crossOrigin = "anonymous";
    audioPlayer.preload = "auto";

    const lipsyncManager = new Lipsync({});

    let lipsyncManagerInitialized = false;

    audioPlayer.onplaying = () => {
      lipsyncManager.connectAudio(audioPlayer);
      lipsyncManagerInitialized = true;
    };
    set({ audioPlayer, lipsyncManager });
  },
  playAudio: (url: string) => {
    const audioPlayer = get().audioPlayer;
    if (!audioPlayer) return console.warn("Audio Player is not setup yet!");
    audioPlayer.src = url;
    audioPlayer.play();
  },
}));

useChatbot.getState().setupAudioPlayer();

export default useChatbot;
