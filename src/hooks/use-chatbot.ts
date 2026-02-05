import { chatApi, FallbackMP3, ttsApi } from "@/assets";
import { recentData } from "@/utils/recent-data";
import { Lipsync } from "wawa-lipsync";
import { create } from "zustand";

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
  playAudio: (url?: string) => {
    const audioPlayer = get().audioPlayer;
    if (!audioPlayer) return console.warn("Audio Player is not ready!");

    // Use fallback if URL missing or empty
    audioPlayer.src = url?.trim() ? url : FallbackMP3;
    audioPlayer.play().catch((err) => console.error("Play failed:", err));
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
