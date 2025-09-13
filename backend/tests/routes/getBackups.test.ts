import request from "supertest";
import express, { Express } from "express";
import backupsRouter from "../../src/routes/backups.routes";
import fs from "fs/promises";

// 🔧 Mock des middlewares
jest.mock("../../src/middlewares/authenticate", () => ({
  authenticate: (_req: any, _res: any, next: any) => next(),
}));

jest.mock("../../src/middlewares/requireAdmin", () => ({
  requireAdmin: (_req: any, _res: any, next: any) => next(),
}));

// 🔧 Mock fs.promises
jest.mock("fs/promises");

describe("GET /backups", () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use("/backups", backupsRouter);

    jest.clearAllMocks();
  });

  it("should return the list of backup files if backups exist", async () => {
    // 🧪 Fichiers présents dans le dossier
    (fs.readdir as jest.Mock).mockResolvedValue([
      "bdd_20250101_120000.sql",
      "bdd_20250102_130000.sql",
      "not_a_backup.txt",
      "bdd_invalid.sql",
    ]);

    const response = await request(app).get("/backups");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      "bdd_20250101_120000.sql",
      "bdd_20250102_130000.sql",
    ]);

    expect(fs.readdir).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array if no valid backups exist", async () => {
    (fs.readdir as jest.Mock).mockResolvedValue([
      "random.txt",
      "image.png",
    ]);

    const response = await request(app).get("/backups");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return 500 if fs.readdir throws an error", async () => {
    (fs.readdir as jest.Mock).mockRejectedValue(
      new Error("Filesystem error")
    );

    const response = await request(app).get("/backups");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Erreur lecture des sauvegardes");
  });
});