import KlausGLB from "./models/klaus.glb";
import SceneGLB from "./models/scene.glb";
import StarPNG from "./textures/star_07.png";
import WelcomeMP3 from "./audio/welcome-message.mp3";
import FallbackMP3 from "./audio/welcome-message.mp3";

export const chatApi = import.meta.env.VITE_CHAT_API_URL;
export const ttsApi = import.meta.env.VITE_TTS_API_URL;
export const apiKey = import.meta.env.VITE_API_KEY;

export { KlausGLB, FallbackMP3, SceneGLB, StarPNG, WelcomeMP3 };
