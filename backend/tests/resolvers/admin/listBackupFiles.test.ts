import "reflect-metadata";
import * as fs from "fs";
import { AdminResolver } from "../../../src/resolvers/admin.resolver";
import { BackupFilesResponse } from "../../../src/types/response.types";

describe("AdminResolver - listBackupFiles", () => {
  let resolver: AdminResolver;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  // On force ici le type sur Promise<string[]>
  const readdirMock = jest.spyOn(
    fs.promises,
    "readdir"
  ) as unknown as jest.Mock<Promise<string[]>, [fs.PathLike | string]>;

  const statMock = jest.spyOn(fs.promises, "stat") as jest.SpyInstance<
    Promise<fs.Stats>,
    Parameters<typeof fs.promises.stat>
  >;

  beforeEach(() => {
    resolver = new AdminResolver();

    readdirMock.mockReset();
    statMock.mockReset();

    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test("should return empty files if data folder does not exist", async () => {
    const enoentError = new Error("not found") as NodeJS.ErrnoException;
    enoentError.code = "ENOENT";

    readdirMock.mockRejectedValue(enoentError);

    const result: BackupFilesResponse = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.files).toEqual([]);
  });

  test("should list backup files with their stats", async () => {
    readdirMock.mockResolvedValue(["file1.sql", "file2.sql"]);

    statMock.mockResolvedValue({
      size: 1234,
      mtime: new Date("2025-06-10T10:00:00Z"),
      ctime: new Date("2025-06-10T10:00:00Z"),
      isFile: () => true,
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
      isDirectory: () => false,
      isFIFO: () => false,
      isSocket: () => false,
      isSymbolicLink: () => false,
      dev: 0,
      ino: 0,
      mode: 0,
      nlink: 0,
      uid: 0,
      gid: 0,
      rdev: 0,
      blksize: 0,
      blocks: 0,
      atime: new Date(),
      atimeMs: 0,
      mtimeMs: 0,
      ctimeMs: 0,
      birthtime: new Date(),
      birthtimeMs: 0,
    } as fs.Stats);

    const result: BackupFilesResponse = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.message).toMatch(/Backup files listed successfully/);
    expect(result.files).toHaveLength(2);
    expect(result.files![0].fileName).toBe("file1.sql");
  });

  test("should continue if stat fails for a file and log warning", async () => {
    readdirMock.mockResolvedValue(["goodfile.sql", "badfile.sql"]);

    statMock
      .mockImplementationOnce(async () => {
        return {
          size: 5678,
          mtime: new Date("2025-06-11T12:00:00Z"),
          ctime: new Date("2025-06-11T12:00:00Z"),
          isFile: () => true,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isDirectory: () => false,
          isFIFO: () => false,
          isSocket: () => false,
          isSymbolicLink: () => false,
          dev: 0,
          ino: 0,
          mode: 0,
          nlink: 0,
          uid: 0,
          gid: 0,
          rdev: 0,
          blksize: 0,
          blocks: 0,
          atime: new Date(),
          atimeMs: 0,
          mtimeMs: 0,
          ctimeMs: 0,
          birthtime: new Date(),
          birthtimeMs: 0,
        } as fs.Stats;
      })
      .mockImplementationOnce(async () => {
        throw new Error("stat error");
      });

    const result: BackupFilesResponse = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.files).toHaveLength(1);
    expect(result.files![0].fileName).toBe("goodfile.sql");

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Could not get stats for file badfile.sql:"),
      expect.any(Error)
    );
  });

  test("should return 500 error if readdir throws unexpected error", async () => {
    readdirMock.mockRejectedValue(new Error("readdir error"));

    const result: BackupFilesResponse = await resolver.listBackupFiles();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/readdir error/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error listing backup files:",
      expect.any(Error)
    );
  });
});