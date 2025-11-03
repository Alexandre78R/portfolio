import { Resolver, Query, Mutation, Arg } from "type-graphql";
import fs from "fs";
import path from "path";
import { GraphQLUpload, FileUpload } from "graphql-upload-ts";

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

  @Mutation(() => Boolean)
  async uploadCV(
    @Arg("file", () => GraphQLUpload) file: FileUpload
  ): Promise<boolean> {
    const { createReadStream, mimetype }: FileUpload = file;

    if (mimetype !== "application/pdf") {
      throw new Error("Invalid file type. Only PDF files are allowed.");
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const finalPath: string = CV_PATH;
    const stream: NodeJS.ReadableStream = createReadStream();

    await new Promise<void>((resolve, reject) => {
      const out: fs.WriteStream = fs.createWriteStream(finalPath);
      stream.pipe(out);
      out.on("finish", () => resolve());
      out.on("error", (err: NodeJS.ErrnoException) => reject(err));
    });

    return true;
  }
}