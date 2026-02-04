import { recentData } from "@/utils/recent-data";
import { Lipsync } from "wawa-lipsync";
import { create } from "zustand";

type Message = {
  text: string;
  sender: "user" | "klaus";
};

type ChatbotState = {
  audioPlayer: HTMLAudioElement | null;
  lipsyncManager: Lipsync | null;
  status: "loading" | "idle";
  setupAudioPlayer: () => void;
  playAudio: (url: string) => void;
  messages: Message[];
  sendMessage: (message: string) => void;
  loaded: boolean;
};

const useChatbot = create<ChatbotState>((set, get) => ({
  audioPlayer: null,
  lipsyncManager: null,
  status: "idle",
  messages: [],
  loaded: false,

  setupAudioPlayer: () => {
    if (!Audio) return;
    const audioPlayer = new Audio();
    audioPlayer.crossOrigin = "anonymous";
    audioPlayer.preload = "auto";

    const lipsyncManager = new Lipsync();

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
  sendMessage: (message) => {
    set((state) => ({
      messages: [...recentData(2, state.messages), { text: message, sender: "user" }],
      status: "loading",
    }));

    setTimeout(() => {
      set((state) => ({
        messages: [...recentData(2, state.messages), { text: message, sender: "klaus" }],
        status: "idle",
      }));
    }, 1000);
  },
}));

useChatbot.getState().setupAudioPlayer();

export default useChatbot;
