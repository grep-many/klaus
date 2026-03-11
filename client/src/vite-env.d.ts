/// <reference types="vite/client" />

declare module "*.glb" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_CHAT_API_URL: string;
  readonly VITE_TTS_API_URL: string;
  readonly VITE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
