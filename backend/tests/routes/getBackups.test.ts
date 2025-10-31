import request from "supertest";
import express, { type Express } from "express";
import type { Request, Response, NextFunction } from "express";
import backupsRouter from "../../src/routes/backups.routes";
import fs from "fs/promises";

jest.mock("../../src/middlewares/authenticate", () => ({
  authenticate: (
    _req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    next();
  },
}));

jest.mock("../../src/middlewares/requireAdmin", () => ({
  requireAdmin: (
    _req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    next();
  },
}));

jest.mock("fs/promises");

type FsPromisesMock = {
  readdir: jest.Mock<Promise<string[]>, [string]>;
};

const fsMock = fs as unknown as FsPromisesMock;

describe("GET /backups", (): void => {
  let app: Express;

  beforeEach((): void => {
    app = express();
    app.use("/backups", backupsRouter);
    jest.clearAllMocks();
  });

  it("should return the list of valid backup files when backups exist", async (): Promise<void> => {
    const directoryFiles: string[] = [
      "bdd_20250101_120000.sql",
      "bdd_20250102_130000.sql",
      "not_a_backup.txt",
      "bdd_invalid.sql",
    ];

    fsMock.readdir.mockResolvedValue(directoryFiles);

    const response = await request(app).get("/backups");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      "bdd_20250101_120000.sql",
      "bdd_20250102_130000.sql",
    ]);

    expect(fsMock.readdir).toHaveBeenCalledTimes(1);
    expect(fsMock.readdir).toHaveBeenCalledWith(expect.any(String));
  });

  it("should return an empty array when no valid backup files exist", async (): Promise<void> => {
    const directoryFiles: string[] = [
      "random.txt",
      "image.png",
    ];

    fsMock.readdir.mockResolvedValue(directoryFiles);

    const response = await request(app).get("/backups");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return 500 when reading the backup directory fails", async (): Promise<void> => {
    fsMock.readdir.mockRejectedValue(new Error("Filesystem error"));

    const response = await request(app).get("/backups");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Erreur lecture des sauvegardes");
  });
});