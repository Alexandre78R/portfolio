import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import badgeRoutes from "./routes/badge.routes";
import backupsRoutes from "./routes/backups.routes";
import captchaRoutes from "./routes/captcha.routes";
import uploadRoutes from "./routes/upload.routes";
import { mountGraphQL } from "./routes/graphql.routes";
import { cleanUpExpiredCaptchas } from "./CaptchaMap";
import { loadLogos } from "./lib/logoLoader";
import Cookies from "cookies";
import { User } from "./entities/user.entity"; 

export interface JwtPayload {
  id: number;
}

export interface MyContext {
  req: express.Request;
  res: express.Response;
  apiKey: string | undefined;
  cookies: Cookies;
  token : string | undefined | null;
  user: User | null;
}

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") ?? ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/badges", badgeRoutes);     // → /api/badges/…
app.use("/api/backups", backupsRoutes);  // → /api/backups/…
app.use("/api/dynamic-images", captchaRoutes);  // → /api/dynamic-images/:id
app.use("/api/upload", uploadRoutes);    // → /api/upload/:type/:filename

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: "7d",
    immutable: true,
  })
);

(async () => {

  await mountGraphQL(app);

  setInterval(cleanUpExpiredCaptchas, 15 * 60 * 1000);

  loadLogos();

  httpServer.listen(PORT, () => {
    console.log(`✅  REST ready   → http://localhost:${PORT}`);
    console.log(`✅  GraphQL ready→ http://localhost:${PORT}/graphql`);
  });
})();