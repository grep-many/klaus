declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LLAMA_API_URL: string;
      PORT?: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
