import "reflect-metadata";
import express, { Request, Response, NextFunction, Application, Express} from "express";
import http, { Server } from "http";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import Cookies from "cookies";

import badgeRoutes from "./routes/badge.routes";
import backupsRoutes from "./routes/backups.routes";
import captchaRoutes from "./routes/captcha.routes";
import uploadRoutes from "./routes/upload.routes";
import { mountGraphQL } from "./routes/graphql.routes";
import { cleanUpExpiredCaptchas } from "./CaptchaMap";
import { loadLogos } from "./lib/logoLoader";
import { User } from "./entities/user.entity";

/* --- Typage JWT et contexte global --- */
export interface JwtPayload {
  id: number;
}

export interface MyContext {
  req: Request;
  res: Response;
  apiKey?: string;
  cookies: Cookies;
  token?: string | null;
  user: User | null;
}

/* --- Load env variables --- */
dotenv.config();

/* --- Initialisation serveur --- */
const app: Express = express();
const httpServer: Server = http.createServer(app);
const PORT: number = Number(process.env.PORT) || 4000;

/* --- Middlewares --- */
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") ?? ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

/* --- Routes REST --- */
app.use("/api/badges", badgeRoutes);           // → /api/badges/…
app.use("/api/backups", backupsRoutes);        // → /api/backups/…
app.use("/api/dynamic-images", captchaRoutes);// → /api/dynamic-images/:id
app.use("/api/upload", uploadRoutes);          // → /api/upload/:type/:filename
app.use("/api/uploads/cv", express.static(path.join(__dirname, "../uploads/cv")));// → /api/upload/ cv

/* --- Serve static files --- */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: "7d",
    immutable: true,
  })
);

/* --- Démarrage serveur --- */
(async (): Promise<void> => {
  try {
    /* ▸ Monte GraphQL */
    await mountGraphQL(app);

    /* ▸ Cleanup périodique captchas expirés */
    setInterval(cleanUpExpiredCaptchas, 15 * 60 * 1000);

    /* ▸ Load logos */
    loadLogos();

    /* ▸ Start HTTP server */
    httpServer.listen(PORT, (): void => {
      console.log(`✅  REST ready   → http://localhost:${PORT}`);
      console.log(`✅  GraphQL ready→ http://localhost:${PORT}/graphql`);
    });
  } catch (err: unknown) {
    console.error("❌ Erreur au démarrage du serveur :", err instanceof Error ? err.message : err);
    process.exit(1);
  }
})();