import request from "supertest";
import express, { Express, Request, Response } from "express";
import path from "path";
import { captchaImageMap } from "../../src/CaptchaMap";
import captchaRoutes from "../../src/routes/captcha.routes";

jest.mock("path", () => {
  const actualPath = jest.requireActual("path");
  return {
    ...actualPath,
    join: jest.fn(),
  };
});

describe("Captcha Routes - GET /:id", () => {
  let app: Express;
  let mockPathJoin: jest.Mock;

  beforeEach(() => {
    app = express();

    // On mock res.sendFile pour ne jamais toucher le FS
    app.use((req: Request, res: Response, next) => {
      const originalSendFile = res.sendFile.bind(res);
      res.sendFile = jest.fn((filePath: string) => {
        return res.status(200).send(`Mock sendFile called with ${filePath}`);
      }) as any;
      next();
    });

    app.use("/captcha", captchaRoutes);

    mockPathJoin = path.join as jest.Mock;
    mockPathJoin.mockClear();

    for (const key in captchaImageMap) {
      delete captchaImageMap[key];
    }
  });

  it("should return 200 and call sendFile if captcha exists", async () => {
    const testImageId : string = "mock-id";
    const testFilename:  string = "mock-image.png";

    captchaImageMap[testImageId] = testFilename;

    mockPathJoin.mockReturnValueOnce(`/mock/path/to/images/${testFilename}`);

    const response = await request(app).get(`/captcha/${testImageId}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`Mock sendFile called with /mock/path/to/images/${testFilename}`);
    expect(mockPathJoin).toHaveBeenCalledWith(expect.any(String), "../images/captcha", testFilename);
  });

  it("should return 404 if captcha does not exist", async () => {
    const response = await request(app).get("/captcha/non-existent-id");

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Image not found");
    expect(mockPathJoin).not.toHaveBeenCalled();
  });
});