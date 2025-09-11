import { Router, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { authenticate } from "../middlewares/authenticate";
import { requireAdmin } from "../middlewares/requireAdmin";
import { createReadStream, ReadStream } from "fs";

const router: Router = Router();

const BACKUP_DIR: string = path.resolve(__dirname, "../..", "backups");

/**
 * GET /backups
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const files: string[] = await fs.readdir(BACKUP_DIR);

      const backups: string[] = files.filter(
        (f: string) => /^bdd_\d{8}_\d{6}\.sql$/i.test(f)
      );

      res.json(backups);
    } catch (err: unknown) {
      console.error("Erreur lecture sauvegardes:", err);
      res.status(500).send("Erreur lecture des sauvegardes");
    }
  }
);

/**
 * GET /backups/:filename
 */
router.get(
  "/:filename",
  authenticate,
  requireAdmin,
  async (req: Request<{ filename: string }>, res: Response): Promise<void> => {
    const filename: string = req.params.filename;
    const fullPath: string = path.join(BACKUP_DIR, filename);

    if (!/^bdd_\d{8}_\d{6}\.sql$/i.test(filename)) {
      res.status(400).send("Nom de fichier invalide");
      return;
    }

    try {
      await fs.access(fullPath);

      const content: string = await fs.readFile(fullPath, "utf-8");

      res.type("text/plain").send(content);
    } catch (err: unknown) {
      console.error("Erreur lecture fichier:", err);
      res.status(404).send("Fichier non trouvé");
    }
  }
);

/**
 * GET /backups/:filename/download
 */
router.get(
  "/:filename/download",
  authenticate,
  requireAdmin,
  async (req: Request<{ filename: string }>, res: Response): Promise<void> => {
    const filename: string = req.params.filename;
    const fullPath: string = path.join(BACKUP_DIR, filename);

    if (!/^bdd_\d{8}_\d{6}\.sql$/i.test(filename)) {
      res.status(400).send("Nom de fichier invalide");
      return;
    }

    try {
      await fs.access(fullPath);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Type", "application/sql");

      const stream: ReadStream = createReadStream(fullPath);
      stream.pipe(res);
    } catch (err: unknown) {
      console.error("Erreur téléchargement:", err);
      res.status(404).send("Fichier non trouvé");
    }
  }
);

export default router;