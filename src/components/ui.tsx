import { WelcomeMP3 } from "@/assets";
import useChatbot from "@/hooks/use-chatbot";

export const UI = () => {
  const playAudio = useChatbot((state) => state.playAudio);

  return (
    <main className="pointer-events-none fixed inset-0 z-10">
      <button className="pointer-events-auto cursor-pointer" onClick={() => playAudio(WelcomeMP3)}>
        {" "}
        Play Audio
      </button>
    </main>
  );
};
