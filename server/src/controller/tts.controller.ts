import { Request, Response } from "express";
import * as googleTTS from "google-tts-api";
import axios from "axios";

class TTSController {
  public async getVoice(req: Request, res: Response) {
    const text = (req.query.text as string) || "Ho ho ho!";
    try {
      const url = googleTTS.getAudioUrl(text, {
        lang: "en",
        slow: false,
        host: "https://translate.google.com",
      });

      // Instead of res.redirect, we fetch the audio and stream it
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
      });

      res.set({
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      });

      response.data.pipe(res);
    } catch (error) {
      console.error("TTS Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch audio from Google" });
    }
  }
}
export const ttsController = new TTSController();
