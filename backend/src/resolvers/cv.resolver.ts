import { Resolver, Query, Mutation, Arg, } from "type-graphql";
import fs from "fs";
import path from "path";
import { GraphQLUpload, FileUpload } from "graphql-upload-ts";
import { UploadResponse } from "../types/response.types";

const UPLOAD_DIR: string = path.resolve(__dirname, "../../uploads/cv");
const CV_FILENAME: string = "Alexandre-Renard-CV.pdf";
const CV_PATH: string = path.join(UPLOAD_DIR, CV_FILENAME);
const CV_URL: string = `/api/uploads/cv/${CV_FILENAME}`;


@Resolver()
export class CVResolver {

  @Query(() => String)
  cvUrl(): string {
    if (fs.existsSync(CV_PATH)) {
      return CV_URL;
    }
    throw new Error("CV not found");
  }

  @Mutation(() => UploadResponse)
  async uploadCV(
    @Arg("file", () => GraphQLUpload) file: FileUpload
  ): Promise<UploadResponse> {
    console.log("🚀 uploadCV resolver appelé");
    console.log("📄 File reçu:", file);

    const { createReadStream, filename, mimetype, encoding }: FileUpload = file;

    console.log("📋 Détails:", { filename, mimetype, encoding });

    if (mimetype !== "application/pdf") {
      return { code: 400, message: "Invalid file type. Only PDF files are allowed." };
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const stream: NodeJS.ReadableStream = createReadStream();

    try {
      await new Promise<void>((resolve, reject) => {
        const out: fs.WriteStream = fs.createWriteStream(CV_PATH);
        stream.pipe(out);
        out.on("finish", () => {
          console.log("✅ Fichier sauvegardé:", CV_PATH);
          resolve();
        });
        out.on("error", (err: NodeJS.ErrnoException) => {
          console.error("❌ Erreur d'écriture:", err);
          reject(err);
        });
      });

      return {
        code: 200,
        message: "CV uploaded successfully!",
        url: CV_URL,
      };
    } catch (err) {
      console.error("❌ Upload failed:", err);
      return { code: 500, message: "Error saving CV file" };
    }
  }
}