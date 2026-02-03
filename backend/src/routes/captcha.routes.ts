import { Router } from "express";
import path from "path";
import { captchaImageMap } from "../CaptchaMap";
const router = Router();

router.get("/:id", (req, res) => {
  const imageId : string = req.params.id;
  const filename : string | undefined = captchaImageMap[imageId];

  if (filename) {
    const imagePath : string = path.join(__dirname, "../images/captcha", filename);
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
});


export default router;