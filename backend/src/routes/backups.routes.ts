import { Router, type Request, type Response } from "express";
import fs from "fs/promises";
import path from "path";
import { authenticate } from "../middlewares/authenticate";
import { requireAdmin } from "../middlewares/requireAdmin";
import { createReadStream, type ReadStream } from "fs";

type BackupListResponse = string[];
type ErrorResponse = string;

type FilenameParams = {
  filename: string;
};

const router: Router = Router();

const BACKUP_DIR: string = path.resolve(__dirname, "../..", "backups");

router.get(
  "/",
  authenticate,
  requireAdmin,
  async (
    _req: Request,
    res: Response<BackupListResponse | ErrorResponse>
  ): Promise<void> => {
    try {
      const files: string[] = await fs.readdir(BACKUP_DIR);

      const backups: BackupListResponse = files.filter(
        (file: string) => /^bdd_\d{8}_\d{6}\.sql$/i.test(file)
      );

      res.status(200).json(backups);
    } catch (error: unknown) {
      console.error("Erreur lecture sauvegardes:", error);
      res.status(500).send("Erreur lecture des sauvegardes");
    }
  }
);

router.get(
  "/:filename",
  authenticate,
  requireAdmin,
  async (
    req: Request<FilenameParams>,
    res: Response<string | ErrorResponse>
  ): Promise<void> => {
    const { filename }: FilenameParams = req.params;
    const fullPath: string = path.join(BACKUP_DIR, filename);

    if (!/^bdd_\d{8}_\d{6}\.sql$/i.test(filename)) {
      res.status(400).send("Nom de fichier invalide");
      return;
    }

    try {
      await fs.access(fullPath);

      const content: string = await fs.readFile(fullPath, "utf-8");

      res.status(200).type("text/plain").send(content);
    } catch (error: unknown) {
      console.error("Erreur lecture fichier:", error);
      res.status(404).send("Fichier non trouvé");
    }
  }
);

router.get(
  "/:filename/download",
  authenticate,
  requireAdmin,
  async (
    req: Request<FilenameParams>,
    res: Response<void | ErrorResponse>
  ): Promise<void> => {
    const { filename }: FilenameParams = req.params;
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
    } catch (error: unknown) {
      console.error("Erreur téléchargement:", error);
      res.status(404).send("Fichier non trouvé");
    }
  }
);

export default router;