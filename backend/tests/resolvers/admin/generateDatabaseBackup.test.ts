import "reflect-metadata";
import * as child_process from "child_process";
import * as fs from "fs";
import { AdminResolver } from "../../../src/resolvers/admin.resolver";
import { BackupResponse } from "../../../src/types/response.types";

jest.mock("fs");
jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("AdminResolver - generateDatabaseBackup", () => {
  let resolver: AdminResolver;

  const execMock = child_process.exec as unknown as jest.MockedFunction<
    (command: string, callback: (
      error: child_process.ExecException | null,
      stdout: string,
      stderr: string
    ) => void) => child_process.ChildProcess
  >;

  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach(() => {
    resolver = new AdminResolver();

    jest.clearAllMocks();

    (fs.existsSync as unknown as jest.Mock<boolean, [fs.PathLike]>)
      .mockReturnValue(true);

    (fs.mkdirSync as unknown as jest.Mock<
      string | undefined,
      [fs.PathLike, fs.Mode | fs.MakeDirectoryOptions | null | undefined]
    >).mockImplementation(() => undefined);

    execMock.mockImplementation(
      (
        command: string,
        callback: (
          error: child_process.ExecException | null,
          stdout: string,
          stderr: string
        ) => void
      ): child_process.ChildProcess => {
        callback(null, "stdout fake", "");
        return {} as child_process.ChildProcess;
      }
    );

    process.env = {
      ...originalEnv,
      DATABASE_URL: "mysql://user:password@localhost:3306/mydatabase",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should create the data folder if it does not exist", async () => {
    (fs.existsSync as unknown as jest.Mock<boolean, [fs.PathLike]>)
      .mockReturnValue(false);

    const result: BackupResponse = await resolver.generateDatabaseBackup();

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), {
      recursive: true,
    });
    expect(execMock).toHaveBeenCalled();

    expect(result.code).toBe(200);
    expect(result.message).toMatch(/Database backup generated successfully/);
    expect(result.path).toMatch(/^bdd_\d{8}_\d{6}\.sql$/);
  });

  it("should not try to create data folder if it already exists", async () => {
    (fs.existsSync as unknown as jest.Mock<boolean, [fs.PathLike]>)
      .mockReturnValue(true);

    const mkdirSpy = jest.spyOn(fs, "mkdirSync");

    await resolver.generateDatabaseBackup();

    expect(mkdirSpy).not.toHaveBeenCalled();
  });

  it("should run mysqldump command with correct parameters", async () => {
    await resolver.generateDatabaseBackup();

    expect(execMock).toHaveBeenCalled();

    const callArg = execMock.mock.calls[0][0] as string;

    expect(callArg).toContain("-h localhost");
    expect(callArg).toContain("-P 3306");
    expect(callArg).toContain("-u user");
    expect(callArg).toContain('-p"password"');
    expect(callArg).toContain("mydatabase");
    expect(callArg).toMatch(/bdd_\d{8}_\d{6}\.sql/);
  });

  it("should return error response if DATABASE_URL is not set", async () => {
    process.env.DATABASE_URL = "";

    const result: BackupResponse = await resolver.generateDatabaseBackup();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/DATABASE_URL non défini/);
  });

  it("should return error if exec fails", async () => {
    execMock.mockImplementation(
      (
        command: string,
        callback: (
          error: child_process.ExecException | null,
          stdout: string,
          stderr: string
        ) => void
      ): child_process.ChildProcess => {
        callback(new Error("exec error"), "", "");
        return {} as child_process.ChildProcess;
      }
    );

    const result: BackupResponse = await resolver.generateDatabaseBackup();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/exec error/);
  });

  it("should return error if mkdirSync fails", async () => {
    (fs.existsSync as unknown as jest.Mock<boolean, [fs.PathLike]>)
      .mockReturnValue(false);

    (fs.mkdirSync as unknown as jest.Mock<
      string | undefined,
      [fs.PathLike, fs.Mode | fs.MakeDirectoryOptions | null | undefined]
    >).mockImplementation(() => {
      throw new Error("Permission denied");
    });

    const result: BackupResponse = await resolver.generateDatabaseBackup();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/Permission denied/);
  });

  it("should return the backup path in response", async () => {
    const result: BackupResponse = await resolver.generateDatabaseBackup();

    expect(result.code).toBe(200);
    expect(result.path).toBeDefined();
    expect(result.path).toMatch(/^bdd_\d{8}_\d{6}\.sql$/);
  });
});