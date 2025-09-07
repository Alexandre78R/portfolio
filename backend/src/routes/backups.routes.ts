import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { authenticate } from "../middlewares/authenticate";
import { requireAdmin } from "../middlewares/requireAdmin";
import { createReadStream } from "fs";

const router = Router();

const BACKUP_DIR = path.resolve(__dirname, "..", "data");

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const backups = files.filter(f => /^bdd_\d{8}_\d{6}\.sql$/i.test(f));
    res.json(backups);
  } catch (err) {
    console.error("Erreur lecture sauvegardes:", err);
    res.status(500).send("Erreur lecture des sauvegardes");
  }
});

router.get("/:filename", authenticate, requireAdmin, async (req, res) => {
  const filename = req.params.filename;
  const fullPath = path.join(BACKUP_DIR, filename);

  if (!/^bdd_\d{8}_\d{6}\.sql$/i.test(filename)) {
    return res.status(400).send("Nom de fichier invalide");
  }

  try {
    await fs.access(fullPath);
    const content = await fs.readFile(fullPath, "utf-8");
    res.type("text/plain").send(content);
  } catch (err) {
    console.error("Erreur lecture fichier:", err);
    res.status(404).send("Fichier non trouvé");
  }
});

router.get("/:filename/download", authenticate, requireAdmin, async (req, res) => {
  const filename = req.params.filename;
  const fullPath = path.join(BACKUP_DIR, filename);

  if (!/^bdd_\d{8}_\d{6}\.sql$/i.test(filename)) {
    return res.status(400).send("Nom de fichier invalide");
  }

  try {
    await fs.access(fullPath);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/sql");
    createReadStream(fullPath).pipe(res);
  } catch (err) {
    console.error("Erreur téléchargement:", err);
    res.status(404).send("Fichier non trouvé");
  }
});

export default router;