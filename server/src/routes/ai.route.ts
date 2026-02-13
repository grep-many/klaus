import { Router, type Request, type Response } from "express";
import { aiController } from "../controller/ai.controller";

class AIRouter {
  public router = Router();

  constructor() {
    this.routes();
  }

  private routes() {
    // Note: Using GET as per your frontend: fetch(`${chatApi}${message}`)
    this.router.get("/", this.handleChatRequest);
  }

  private handleChatRequest = async (req: Request, res: Response) => {
    const userMessage = req.query.message as string;

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided!" });
    }

    try {
      const reply = await aiController.getChatResponse(userMessage);

      // Matches your frontend's 'reply = data.response' logic
      return res.json({ response: reply?.split("#")[0] });
    } catch (err: any) {
      return res.status(500).json({ response: "Ho ho ho! Something went wrong!" });
    }
  };
}

export default new AIRouter().router;
