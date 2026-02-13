import express, { Application } from "express";
import cors from "cors";
import aiRoute from "./routes/ai.route";
import dotenv from "dotenv";
import ttsRoute from "./routes/tts.route";

dotenv.config({
  quiet: true,
  path: ".env.local",
});

class Server {
  public app: Application;
  public get port() {
    return Number(process.env.PORT) || 8000;
  }

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }
  private routes(): void {
    this.app.use("/api/ai", aiRoute);
    this.app.use("/api/tts", ttsRoute);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server spinning on port ${port}`);
    });
  }
}

export default Server;
