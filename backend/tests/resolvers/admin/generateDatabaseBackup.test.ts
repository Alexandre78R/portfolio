import "reflect-metadata";
import * as util from "util";
import * as child_process from "child_process";
import * as fs from "fs";
import { AdminResolver } from "../../../src/resolvers/admin.resolver";

jest.mock("fs");
jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("AdminResolver - generateDatabaseBackup", () => {
  let resolver: AdminResolver;

  const execMock = child_process.exec as jest.MockedFunction<typeof child_process.exec>;

  const originalEnv = process.env;

  beforeEach(() => {
    resolver = new AdminResolver();

    jest.clearAllMocks();

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

    execMock.mockImplementation((command, optionsOrCallback, maybeCallback) => {
      const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback;

      if (callback) {
        callback(null, "stdout fake", "");
      }

      return {} as any;
    });

    process.env = {
      ...originalEnv,
      DATABASE_URL: "mysql://user:password@localhost:3306/mydatabase",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should create the data folder if it does not exist", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = await resolver.generateDatabaseBackup();

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    expect(execMock).toHaveBeenCalled();

    expect(result.code).toBe(200);
    expect(result.message).toMatch(/Database backup generated successfully/);
    // expect(result.path).toMatch(/data\/bdd_\d{8}_\d{6}\.sql/);
    expect(result.path).toMatch(/[\\\/]data[\\\/]bdd_\d{8}_\d{6}\.sql/);
  });

  it("should not try to create data folder if it already exists", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const mkdirSpy = jest.spyOn(fs, "mkdirSync");

    await resolver.generateDatabaseBackup();

    expect(mkdirSpy).not.toHaveBeenCalled();
  });

  it("should run mysqldump command with correct parameters", async () => {
    await resolver.generateDatabaseBackup();

    expect(execMock).toHaveBeenCalled();

    const callArg = execMock.mock.calls[0][0];

    expect(callArg).toContain("-h localhost");
    expect(callArg).toContain("-P 3306");
    expect(callArg).toContain("-u user");
    expect(callArg).toContain('-p"password"');
    expect(callArg).toContain("mydatabase");
    expect(callArg).toMatch(/bdd_\d{8}_\d{6}\.sql$/);
  });

  it("should return error response if DATABASE_URL is not set", async () => {
    process.env.DATABASE_URL = "";

    const result = await resolver.generateDatabaseBackup();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/DATABASE_URL non défini/);
  });

  it("should return error if exec fails", async () => {
    execMock.mockImplementation((command, optionsOrCallback, maybeCallback) => {
      const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback;

      if (callback) {
        callback(new Error("exec error"), "", "");
      }

      return {} as any;
    });

    const result = await resolver.generateDatabaseBackup();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/exec error/);
  });

  it("should return error if mkdirSync fails", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {
      throw new Error("Permission denied");
    });

    const result = await resolver.generateDatabaseBackup();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/Permission denied/);
  });

  it("should return the backup path in response", async () => {
    const result = await resolver.generateDatabaseBackup();

    expect(result.code).toBe(200);
    expect(result.path).toBeDefined();
    // expect(result.path).toMatch(/data\/bdd_\d{8}_\d{6}\.sql/);
    expect(result.path).toMatch(/[\\\/]data[\\\/]bdd_\d{8}_\d{6}\.sql/);
  });
});