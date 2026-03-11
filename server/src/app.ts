import express, { Application, Request, Response, NextFunction } from "express";
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
  private rateLimitStore = new Map<string, { count: number; resetAt: number }>();

  public get port() {
    return Number(process.env.PORT) || 8000;
  }

  private get apiKey(): string | undefined {
    const key = process.env.API_KEY?.trim();
    return key ? key : undefined;
  }

  private get rateLimitWindowMs(): number {
    const value = Number(process.env.RATE_LIMIT_WINDOW_MS);
    return Number.isFinite(value) && value > 0 ? value : 60_000;
  }

  private get rateLimitMax(): number {
    const value = Number(process.env.RATE_LIMIT_MAX);
    return Number.isFinite(value) ? value : 60;
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

    this.app.set("trust proxy", 1);
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (allowAll) return callback(null, true);
          if (!origin) return callback(null, false);
          if (origins.includes(origin)) return callback(null, true);
          return callback(new Error("CORS: Origin not allowed"));
        },
        allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
        methods: ["GET", "POST", "OPTIONS"],
      }),
    );
    this.app.use(express.json());
    this.security();
  }

  private security(): void {
    const rateLimitMax = this.rateLimitMax;
    const rateLimitWindowMs = this.rateLimitWindowMs;

    if (rateLimitMax > 0) {
      this.app.use("/api", (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "OPTIONS") return next();

        const key = req.ip || "unknown";
        const now = Date.now();
        let entry = this.rateLimitStore.get(key);

        if (!entry || entry.resetAt <= now) {
          entry = { count: 0, resetAt: now + rateLimitWindowMs };
          this.rateLimitStore.set(key, entry);
        }

        entry.count += 1;

        if (entry.count > rateLimitMax) {
          const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
          res.setHeader("Retry-After", String(retryAfter));
          return res.status(429).json({ error: "Too many requests" });
        }

        return next();
      });
    }

    const apiKey = this.apiKey;
    if (apiKey) {
      this.app.use("/api", (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "OPTIONS") return next();

        const headerValue = req.header("x-api-key") ?? req.header("authorization");
        const token =
          headerValue?.toLowerCase().startsWith("bearer ")
            ? headerValue.slice(7).trim()
            : headerValue?.trim();

        if (!token) return res.status(401).json({ error: "Missing API key" });
        if (token !== apiKey) return res.status(403).json({ error: "Invalid API key" });

        return next();
      });
    }
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
