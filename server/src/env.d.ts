declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LLAMA_API_URL: string;
      PORT?: number;
      LLAMA_API_KEY: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
