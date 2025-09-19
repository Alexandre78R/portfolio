import request from "supertest";
import express, { Response, Errback, Request } from "express";
import path from "path";

jest.mock("path", () => {
  const actualPath = jest.requireActual("path");
  return {
    ...actualPath,
    join: jest.fn(),
  };
});

const app = express();

app.get("/upload/:type/:filename", (req: Request, res: Response) => {
  const { type, filename } : any = req.params;

  if (!["image", "video"].includes(type)) {
    return res.status(400).send('Invalid type. Use "image" or "video".');
  }

  const filePath : string = path.join(__dirname, ".", "uploads", `${type}s`, filename);

  res.sendFile(filePath, (err?: Error) => {
    if (err && !res.headersSent) {
      console.error(`Fichier non trouvé : ${filePath}`);
      return res.status(404).send("Fichier non trouvé");
    }
  });
});

describe("GET /upload/:type/:filename", () => {
  let mockJoin: jest.Mock;
  let sendFileSpy: jest.SpyInstance;

  beforeEach(() => {
    mockJoin = path.join as unknown as jest.Mock<string, unknown[]>;

    sendFileSpy = jest.spyOn(express.response, "sendFile").mockImplementation(
      function (
        this: Response,
        filePath: string,
        optionsOrCb?: any,
        cb?: Errback
      ): Response {
        const callback: Errback | undefined =
          typeof optionsOrCb === "function" ? optionsOrCb : cb;

        setImmediate(() => {
          if (filePath.includes("missing")) {
            callback?.(new Error("Not found"));
          } else {
            callback?.(null as any);
            if (!this.headersSent) {
              this.status(200).send("Mock file content from sendFile mock");
            }
          }
        });

        return this;
      }
    );
  });

  afterEach(() => {
    sendFileSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("should return 400 if type is invalid", async () => {
    const res = await request(app).get("/upload/invalid/file.png");
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Invalid type. Use "image" or "video".');
  });

  it("should return 200 and call sendFile when file exists", async () => {
    const filePath : string = "/mock/path/uploads/images/file.png";
    mockJoin.mockReturnValueOnce(filePath);

    const res = await request(app).get("/upload/image/file.png");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Mock file content from sendFile mock");
    expect(sendFileSpy).toHaveBeenCalledWith(filePath, expect.any(Function));
  });

  it("should return 404 if file does not exist", async () => {
    const filePath : string = "/mock/path/uploads/images/missing.png";
    mockJoin.mockReturnValueOnce(filePath);

    const res = await request(app).get("/upload/image/missing.png");

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Fichier non trouvé");
    expect(sendFileSpy).toHaveBeenCalledWith(filePath, expect.any(Function));
  });
});