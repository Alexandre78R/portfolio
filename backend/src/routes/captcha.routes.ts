import { Router } from "express";
import path from "path";
import fs from "fs";
import { captchaImageMap } from "../CaptchaMap";
const router = Router();

router.get("/:id", (req, res) => {
  const imageId = req.params.id;
  const filename = captchaImageMap[imageId];

  if (filename) {
    const imagePath = path.join(__dirname, "../images/captcha", filename);
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
});


export default router;