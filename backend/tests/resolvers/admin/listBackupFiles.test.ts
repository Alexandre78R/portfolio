import "reflect-metadata";
import * as fs from "fs";
import path from "path";
import { AdminResolver } from "../../../src/resolvers/admin.resolver";
import { BackupFilesResponse, BackupFileInfo } from "../../../src/types/response.types";

describe("AdminResolver - listBackupFiles", () => {
  let resolver: AdminResolver;
  let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;
  let consoleWarnSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

  // Mock fs.promises.readdir
  const readdirMock: jest.MockedFunction<(path: fs.PathLike) => Promise<string[]>> =
    jest.spyOn(fs.promises, "readdir") as unknown as jest.MockedFunction<(path: fs.PathLike) => Promise<string[]>>;

  // Mock fs.promises.stat
  const statMock: jest.SpyInstance<
    Promise<fs.Stats | fs.BigIntStats>,
    [fs.PathLike, fs.StatOptions?]
  > = jest.spyOn(fs.promises, "stat");

  beforeEach(() => {
    resolver = new AdminResolver();

    readdirMock.mockReset();
    statMock.mockReset();

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test("should return empty array if backup directory does not exist", async () => {
    // Simulate ENOENT error
    const enoentError = new Error("Directory not found") as NodeJS.ErrnoException;
    enoentError.code = "ENOENT";

    readdirMock.mockRejectedValueOnce(enoentError);

    const result: BackupFilesResponse = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.files).toEqual([]);
    expect(result.message).toMatch(/No backup directory found/);
  });

  test("should list backup files with stats", async () => {
    const fakeFiles: string[] = ["file1.sql", "file2.sql"];
    readdirMock.mockResolvedValueOnce(fakeFiles);

    const fakeStats: fs.Stats = {
      size: 1234,
      mtime: new Date("2025-06-10T10:00:00Z"),
      ctime: new Date("2025-06-10T10:00:00Z"),
      atime: new Date(),
      birthtime: new Date(),
      isFile: () => true,
      isDirectory: () => false,
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
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
      atimeMs: 0,
      mtimeMs: 0,
      ctimeMs: 0,
      birthtimeMs: 0,
    } as fs.Stats;

    statMock.mockResolvedValue(fakeStats);

    const result: BackupFilesResponse = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.message).toMatch(/Backup files listed successfully/);
    expect(result.files).toHaveLength(fakeFiles.length);
    expect(result.files![0].fileName).toBe("file1.sql");
    expect(result.files![0].sizeBytes).toBe(fakeStats.size);
  });

  test("should skip files if stat fails and log a warning", async () => {
    const files: string[] = ["goodfile.sql", "badfile.sql"];
    readdirMock.mockResolvedValueOnce(files);

    const goodStats: fs.Stats = {
      size: 5678,
      mtime: new Date("2025-06-11T12:00:00Z"),
      ctime: new Date("2025-06-11T12:00:00Z"),
      atime: new Date(),
      birthtime: new Date(),
      isFile: () => true,
      isDirectory: () => false,
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
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
      atimeMs: 0,
      mtimeMs: 0,
      ctimeMs: 0,
      birthtimeMs: 0,
    } as fs.Stats;

    statMock
      .mockResolvedValueOnce(goodStats) // goodfile.sql
      .mockRejectedValueOnce(new Error("stat error")); // badfile.sql

    const result: BackupFilesResponse = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.files).toHaveLength(1);
    expect(result.files![0].fileName).toBe("goodfile.sql");

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Could not get stats for file badfile.sql:"),
      expect.any(Error)
    );
  });

  test("should return 500 error for unexpected readdir error", async () => {
    readdirMock.mockRejectedValueOnce(new Error("Unexpected readdir error"));

    const result: BackupFilesResponse = await resolver.listBackupFiles();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/Unexpected readdir error/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error listing backup files:",
      expect.any(Error)
    );
  });
});