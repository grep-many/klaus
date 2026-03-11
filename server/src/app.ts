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

  private get clientUrl(): string {
    return process.env.CLIENT_URL ?? "";
  }

  private get allowedOrigins(): string[] {
    return this.clientUrl
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    const isProd = process.env.NODE_ENV !== "development";
    const allowAll = !isProd;
    const origins = this.allowedOrigins;

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (allowAll) return callback(null, true);
          if (!origin) return callback(null, false);
          if (origins.includes(origin)) return callback(null, true);
          return callback(new Error("CORS: Origin not allowed"));
        },
      }),
    );
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
