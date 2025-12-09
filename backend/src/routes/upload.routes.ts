import { Router } from "express";
import path from "path";

const router : Router = Router();

router.get("/:type/:filename", (req, res) => {
  const { type, filename } : { type: string; filename: string } = req.params;
  if (!['images', 'videos'].includes(type)) {
    return res.status(400).send('Type invalide (image ou video attendu)');
  }

  const filePath : string = path.join(__dirname, "..", "uploads", `${type}`, filename);
  res.sendFile(filePath, err => {
    if (err && !res.headersSent) {
      console.error("Fichier non trouvé:", filePath);
      res.status(404).send("Fichier non trouvé");
    }
  });
});

export default router;