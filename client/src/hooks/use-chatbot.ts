import { chatApi, FallbackMP3, ttsApi } from "@/assets";
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
  status: "loading" | "idle" | "playing";
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

    audioPlayer.onerror = (err) => console.error("Audio failed:", err);

    audioPlayer.onplaying = () => {
      if (!lipsyncManagerInitialized) {
        lipsyncManager.connectAudio(audioPlayer);
        lipsyncManagerInitialized = true;
      }
      set({ status: "playing" });
    };

    audioPlayer.onended = () => set({ status: "idle" });
    set({ audioPlayer, lipsyncManager });
  },

  playAudio: async (url: string) => {
    const { lipsyncManager, audioPlayer } = get();
    if (!lipsyncManager || !audioPlayer) return;

    try {
      const response = await fetch(url);
      const data = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(data);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Adjust speed and pitch for Klaus
      source.playbackRate.value = 1.3;
      source.detune.value = -1000;

      const destination = audioContext.createMediaStreamDestination();

      // --- CRITICAL CHANGE ---
      // Remove: source.connect(audioContext.destination);
      // We ONLY connect to the destination stream to avoid "double voice"
      source.connect(destination);

      audioPlayer.srcObject = destination.stream;

      // Ensure lipsync is watching the player
      lipsyncManager.connectAudio(audioPlayer);

      source.start(0);

      // The audioPlayer is now the only thing outputting sound to speakers
      await audioPlayer.play();

      set({ status: "playing" });

      source.onended = () => {
        set({ status: "idle" });
        audioPlayer.srcObject = null;
        audioContext.close();
      };
    } catch (err) {
      console.error("Klaus Playback Error:", err);
      set({ status: "idle" });
    }
  },

  sendMessage: async (message) => {
    let reply: string;
    set((state) => ({
      messages: [...recentData(2, state.messages), { text: message, sender: "user" }],
      status: "loading",
    }));
    try {
      const res = await fetch(`${chatApi}${encodeURIComponent(message)}`);
      const data = await res.json(); // or res.text() depending on your API
      reply = data.response;

      get().playAudio(ttsApi + reply);
    } catch {
      reply = "Ho ho ho! I didn't understand that!";
      get().playAudio(FallbackMP3);
    }
    set((state) => ({
      messages: [...recentData(2, state.messages), { text: reply, sender: "klaus" }],
      status: "idle",
    }));
  },
}));

useChatbot.getState().setupAudioPlayer();

export default useChatbot;
