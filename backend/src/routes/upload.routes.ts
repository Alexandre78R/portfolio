import { Router } from "express";
import path from "path";

const router = Router();

router.get("/:type/:filename", (req, res) => {
  const { type, filename } = req.params;

  if (!['image', 'video'].includes(type)) {
    return res.status(400).send('Type invalide (image ou video attendu)');
  }

  const filePath = path.join(__dirname, "..", "uploads", `${type}s`, filename);

  res.sendFile(filePath, err => {
    if (err && !res.headersSent) {
      console.error("Fichier non trouvé:", filePath);
      res.status(404).send("Fichier non trouvé");
    }
  });
});

export default router;