import { Router, Request, Response } from "express";
import { generateBadgeSvg } from "../lib/badgeGenerator";
import { loadedLogos, Logo } from "../lib/logoLoader";
import { PrismaClient } from "@prisma/client";
import { BadgeParams, BadgeQuery } from "../types/badge.types";

const prisma: PrismaClient = new PrismaClient();
const router: Router = Router();

router.get(
  '/:label/:message/:messageColor/:labelColor/:logo?',
  (req: Request<BadgeParams, any, any, BadgeQuery>, res: Response) => {
    const params: BadgeParams = req.params;
    const query: BadgeQuery = req.query;

    const label: string = decodeURIComponent(params.label);
    const message: string = decodeURIComponent(params.message);
    const messageColor: string = decodeURIComponent(params.messageColor);
    const labelColor: string = decodeURIComponent(params.labelColor);

    const logoName: string | undefined = params.logo;
    const logoObj: Logo | undefined = logoName ? loadedLogos.get(logoName.toLowerCase()) : undefined;

    const logoColor: string | undefined = query.logoColor ? String(query.logoColor) : undefined;
    const logoPosition: "left" | "right" = query.logoPosition === "right" ? "right" : "left";

    try {
      const svg: string = generateBadgeSvg(label, message, messageColor, labelColor, logoObj, logoColor, logoPosition);

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(svg);
    } catch (error: unknown) {
      console.error("Erreur badge SVG:", error);
      res.status(500).send("Erreur génération badge");
    }
  }
);

router.get('/stats/projects-count', async (_req: Request, res: Response) => {
  try {
    const count: number = await prisma.project.count();
    const logoObj: Logo | undefined = loadedLogos.get('github');

    const svg: string = generateBadgeSvg(
      'Projets',
      String(count),
      '4CAF50',
      '2F4F4F',
      logoObj,
      'white',
      'right'
    );

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(svg);
  } catch (err: unknown) {
    console.error("Erreur badge projets:", err);
    res.status(500).send("Erreur génération badge");
  }
});

export default router;