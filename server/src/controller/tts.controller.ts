// tts.controller.ts
import { Request, Response } from "express";
import * as googleTTS from "google-tts-api";

class TTSController {
  public async getVoice(req: Request, res: Response) {
    const text = (req.query.text as string) || "Ho ho ho!";
    try {
      const url = googleTTS.getAudioUrl(text, {
        lang: "en",
        slow: false,
        host: "https://translate.google.com",
      });
      // Redirect to the Google URL or fetch and pipe it
      res.redirect(url);
    } catch (error) {
      res.status(500).json({ error: "Failed to get voice" });
    }
  }
}
export const ttsController = new TTSController();
