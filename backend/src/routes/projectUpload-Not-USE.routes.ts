// File NOT IN USE ANYMORE FOR GULLL GESTION IMAGE by VIDEO PROJECT UPLOAD (Appolo GraphQL used now) 

import { Router, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const router: Router = Router();

// Configuration du stockage multer
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = path.join(__dirname, "..", "uploads", "images");
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `project-${uniqueSuffix}${ext}`);
  },
});

// Filtre pour n'accepter que les images
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé. Seules les images sont acceptées."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

// Route pour uploader une image de projet
router.post("/", upload.single("image"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier uploadé" });
    }

    // Retourner le chemin relatif du fichier
    const filePath = `/uploads/images/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      filePath,
      filename: req.file.filename,
    });
  } catch (error: unknown) {
    console.error("Erreur upload:", error);
    res.status(500).json({ error: "Erreur lors de l'upload" });
  }
});

export default router;
