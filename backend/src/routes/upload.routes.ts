import { Router } from "express";
import path from "path";
import fs from "fs";

const router : Router = Router();

router.get("/:type/:filename", (req, res) => {
  const { type, filename } : { type: string; filename: string } = req.params;
  if (!['images', 'videos'].includes(type)) {
    return res.status(400).send('Type invalide (image ou video attendu)');
  }

  const possiblePaths: string[] = [
    path.join(__dirname, "..", "uploads", type, filename),
    path.join(__dirname, "../..", "uploads", type, filename),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log("Serving file:", filePath);
      return res.sendFile(filePath, err => {
        if (err && !res.headersSent) {
          console.error("Erreur envoi fichier:", filePath);
          res.status(500).send("Erreur lors de l'envoi du fichier");
        }
      });
    }
  }

  console.error("Fichier non trouvé dans aucun chemin:", possiblePaths);
  res.status(404).send("Fichier non trouvé");
});

export default router;