declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LLAMA_API_URL: string;
      PORT?: number;
      LLAMA_API_KEY: string;
      CLIENT_URL: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
