import useChatbot from "@/hooks/use-chatbot";
import { motion } from "motion/react";
import React from "react";
import { ImSpinner8 } from "react-icons/im";
import { IoSend } from "react-icons/io5";

export const UI = () => {
  const [input, setInput] = React.useState("");

  const { messages, sendMessage, status } = useChatbot();
  const loaded = true;

  const handleSend = () => {
    const value = input.trim();
    if (!value) return;
    sendMessage(value);
    setInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === "loading" || status === "playing") return;

    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (status === "loading" || status === "playing") return;
    if (e.key !== "Enter" || e.shiftKey) return setInput(input + "\n");
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-2 bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 2 }}
      >
        {!loaded && (
          <div className="flex h-full w-full items-center justify-center">
            <ImSpinner8 className="h-12 w-12 animate-spin text-white" />
          </div>
        )}
      </motion.div>
      {loaded && (
        <main className="pointer-events-none fixed inset-0 z-10 flex flex-col bg-radial from-transparent via-black/10 to-black/80">
          <div className="w-full py-10">
            <motion.h1
              className="font-display -translate-3 -rotate-6 text-center text-5xl font-bold text-red-500 lg:text-8xl"
              initial={{
                opacity: 0,
                y: -50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
              }}
            >
              Klaus
              <motion.span
                className="inline-block text-white"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{
                  delay: 0.75,
                }}
              >
                Bot
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-md text-center text-white lg:text-2xl"
              initial={{
                opacity: 0,
                y: -50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
              }}
            >
              Ask Klaus what you want for Christmas!
            </motion.p>
          </div>
          <div className="flex flex-1 flex-col justify-end overflow-y-auto p-6">
            <div className="mx-auto w-full max-w-md space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`pointer-events-auto max-w-[75%] rounded-2xl px-5 py-3 shadow-lg backdrop-blur-md ${
                      msg.sender === "user"
                        ? "rounded-br-md border border-white/30 bg-white/20 text-white"
                        : "rounded-bl-md border border-white/20 bg-black/20 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {status === "loading" && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="rounded-2xl rounded-bl-md border border-white/20 bg-black/20 px-5 py-3 shadow-lg backdrop-blur-md">
                    <ImSpinner8 className="h-5 w-5 animate-spin text-white" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          <motion.div
            className="pointer-events-auto flex flex-col items-center gap-2 pb-6"
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: status === "loading" ? 0 : 1,
              y: status === "loading" ? 50 : 0,
            }}
            transition={{
              delay: status === "loading" ? 0 : 1.5,
            }}
          >
            <div className="relative w-full max-w-md">
              <input
                autoFocus
                type="text"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full rounded-2xl border border-white/30 bg-white/15 px-5 py-3 pr-12 text-white placeholder-white/50 shadow-lg backdrop-blur-md transition-all focus:border-white/50 focus:bg-white/25 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={status === "loading" || status === "playing"}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-white/70 transition-colors hover:text-white disabled:opacity-50"
              >
                <IoSend className="h-5 w-5" />
              </button>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
              <a className="text-white" href="https://wawasensei.dev/chatbot-kit">
                Build your own chatbot with Chatbot Kit
              </a>
            </motion.div>
          </motion.div>
        </main>
      )}
    </>
  );
};
