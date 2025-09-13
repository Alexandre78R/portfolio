import request from "supertest";
import express, { Express } from "express";
import type { Request, Response, NextFunction } from "express";
import backupsRouter from "../../src/routes/backups.routes";
import fs from "fs/promises";

/* -------------------------------------------------------------------------- */
/*                                   MOCKS                                    */
/* -------------------------------------------------------------------------- */

// Middlewares
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

// fs/promises
jest.mock("fs/promises");

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type MockedFsPromises = {
  readdir: jest.Mock<Promise<string[]>, [string]>;
};

const mockedFs: MockedFsPromises = fs as unknown as MockedFsPromises;

/* -------------------------------------------------------------------------- */
/*                                   TESTS                                    */
/* -------------------------------------------------------------------------- */

describe("GET /backups", (): void => {
  let app: Express;

  beforeEach((): void => {
    app = express();
    app.use("/backups", backupsRouter);
    jest.clearAllMocks();
  });

  it("should return the list of backup files if backups exist", async (): Promise<void> => {
    const filesInDirectory: string[] = [
      "bdd_20250101_120000.sql",
      "bdd_20250102_130000.sql",
      "not_a_backup.txt",
      "bdd_invalid.sql",
    ];

    mockedFs.readdir.mockImplementation(
      async (): Promise<string[]> => filesInDirectory
    );

    const response = await request(app).get("/backups");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      "bdd_20250101_120000.sql",
      "bdd_20250102_130000.sql",
    ]);

    expect(mockedFs.readdir).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array if no valid backups exist", async (): Promise<void> => {
    const filesInDirectory: string[] = [
      "random.txt",
      "image.png",
    ];

    mockedFs.readdir.mockImplementation(
      async (): Promise<string[]> => filesInDirectory
    );

    const response = await request(app).get("/backups");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return 500 if fs.readdir throws an error", async (): Promise<void> => {
    mockedFs.readdir.mockImplementation(
      async (): Promise<string[]> => {
        throw new Error("Filesystem error");
      }
    );

    const response = await request(app).get("/backups");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Erreur lecture des sauvegardes");
  });
});