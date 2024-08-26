import {
    Arg,
    Authorized,
    Float,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import { createWriteStream } from "fs";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
    GenerateImageFrom,
    GenerateImageResponse
} from '../types/generateImage.types'

import { createCanvas, loadImage } from 'canvas';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

@Resolver()
export class GenerateImageResolver {

    // @Mutation(() => String)
    // async generateImage(
    //     @Arg('data', () => GenerateImageFrom) data: GenerateImageFrom,
    //     @Arg('image', () => GraphQLUpload) image: FileUpload,
    // ): Promise<string> {
    //     const { createReadStream, filename, mimetype } = await image;
    //     const uploadPath = path.join(__dirname, `../public/images/${filename}`);

    //     // Créer un flux de lecture et de sortie pour enregistrer l'image
    //     const stream = createReadStream();
    //     const out = fs.createWriteStream(uploadPath);
    //     stream.pipe(out);

    //     await new Promise((resolve, reject) => {
    //         stream.on('end', resolve);
    //         stream.on('error', reject);
    //     });

    //     // Créer l'image avec Canvas
    //     const width = 800;
    //     const height = 600;
    //     const canvas = createCanvas(width, height);
    //     const context = canvas.getContext('2d');

    //     context.fillStyle = data.backgroundColor;
    //     context.fillRect(0, 0, width, height);

    //     if (data.logoUrl) {
    //         const logo = await loadImage(data.logoUrl);
    //         context.drawImage(logo, width / 2 - 50, height / 2 - 50, 100, 100);
    //     }

    //     context.fillStyle = 'black';
    //     context.font = '30px Arial';
    //     context.fillText(data.text, 50, 550);

    //     // Enregistrer le canvas comme fichier PNG
    //     const imageFileName = `image_${Date.now()}.png`;
    //     const imagePath = path.join(__dirname, `../public/images/${imageFileName}`);
    //     const outStream = fs.createWriteStream(imagePath);
    //     const streamPng = canvas.createPNGStream();
    //     streamPng.pipe(outStream);

    //     // Renvoyer l'URL de l'image enregistrée
    //     const imageUrl = `http://localhost:4000/images/${imageFileName}`;
    //     return imageUrl;
    // }
    
}