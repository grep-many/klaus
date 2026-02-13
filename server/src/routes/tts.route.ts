import { Router } from "express";
import { ttsController } from "../controller/tts.controller"; // Adjust path as needed

class TTSRoute {
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    // Accessible via /api/tts?text=Hello
    this.router.get("/", (req, res) => ttsController.getVoice(req, res));
  }
}

export default new TTSRoute().router;
