import { Router } from "express";
import { generateBadgeSvg } from "../lib/badgeGenerator";
import { loadedLogos } from "../lib/logoLoader";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get('/:label/:message/:messageColor/:labelColor/:logo', (req, res) => {
  const { label, message, messageColor, labelColor, logo } = req.params;
  const { logoColor, logoPosition } = req.query;

  try {
    const svg = generateBadgeSvg(
      decodeURIComponent(label),
      decodeURIComponent(message),
      decodeURIComponent(messageColor),
      decodeURIComponent(labelColor),
      logo ? loadedLogos.get(String(logo).toLowerCase()) : undefined,
      logoColor ? String(logoColor) : undefined,
      logoPosition === 'right' ? 'right' : 'left'
    );

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(svg);
  } catch (error) {
    console.error("Erreur badge SVG:", error);
    res.status(500).send("Erreur génération badge");
  }
});

router.get('/stats/projects-count', async (req, res) => {
  try {
    const count = await prisma.project.count();
    const logo = loadedLogos.get('github');

    const svg = generateBadgeSvg(
      'Projets',
      String(count),
      '4CAF50',
      '2F4F4F',
      logo,
      'white',
      'right'
    );

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(svg);
  } catch (err) {
    console.error("Erreur badge projets:", err);
    res.status(500).send("Erreur génération badge");
  }
});

export default router;