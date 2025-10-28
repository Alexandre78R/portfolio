import "reflect-metadata";

// Mock type-graphql BEFORE any imports
jest.mock("type-graphql", (): Record<string, unknown> => ({
  Resolver: (): ClassDecorator => (): void => {},
  Query: (): MethodDecorator => (): void => {},
  Mutation: (): MethodDecorator => (): void => {},
  Arg: (): ParameterDecorator => (): void => {},
  Args: (): ParameterDecorator => (): void => {},
  Ctx: (): ParameterDecorator => (): void => {},
  Authorized: (): MethodDecorator => (): void => {},
  Field: (): PropertyDecorator => (): void => {},
  ObjectType: (): ClassDecorator => (): void => {},
  InputType: (): ClassDecorator => (): void => {},
  ArgsType: (): ClassDecorator => (): void => {},
  Int: (): PropertyDecorator => (): void => {},
  Float: (): PropertyDecorator => (): void => {},
  ID: (): PropertyDecorator => (): void => {},
  registerEnumType: jest.fn<void, unknown[]>(),
}));

// Mock TypeORM BEFORE any imports to prevent native module loading
jest.mock("typeorm", (): Record<string, unknown> => ({
  Entity: (): ClassDecorator => (): void => {},
  PrimaryGeneratedColumn: (): PropertyDecorator => (): void => {},
  Column: (): PropertyDecorator => (): void => {},
  CreateDateColumn: (): PropertyDecorator => (): void => {},
  UpdateDateColumn: (): PropertyDecorator => (): void => {},
  ManyToOne: (): PropertyDecorator => (): void => {},
  OneToMany: (): PropertyDecorator => (): void => {},
  JoinColumn: (): PropertyDecorator => (): void => {},
  DataSource: jest.fn<unknown, unknown[]>(),
  Repository: jest.fn<unknown, unknown[]>(),
}));

// Mock fs BEFORE imports
jest.mock("fs", (): {
  existsSync: jest.Mock<boolean, [fs.PathLike]>;
  promises: { unlink: jest.Mock<Promise<void>, [fs.PathLike]> };
  __existsSyncMock: jest.Mock<boolean, [fs.PathLike]>;
  __unlinkMock: jest.Mock<Promise<void>, [fs.PathLike]>;
} => {
  const existsSyncMock: jest.Mock<boolean, [fs.PathLike]> = jest.fn<boolean, [fs.PathLike]>();
  const unlinkMock: jest.Mock<Promise<void>, [fs.PathLike]> = jest.fn<Promise<void>, [fs.PathLike]>();

  return {
    existsSync: existsSyncMock,
    promises: {
      unlink: unlinkMock,
    },
    __existsSyncMock: existsSyncMock,
    __unlinkMock: unlinkMock,
  };
});

// NOW import modules after mocks are set up
import * as fs from "fs";
import * as path from "path";
import { AdminResolver } from "../../../src/resolvers/admin.resolver";
import { Response } from "../../../src/types/response.types";

//  Extract mocks with proper typing
const { __existsSyncMock: existsSyncMock, __unlinkMock: unlinkMock } = fs as unknown as {
  __existsSyncMock: jest.Mock<boolean, [fs.PathLike]>;
  __unlinkMock: jest.Mock<Promise<void>, [fs.PathLike]>;
};

describe("AdminResolver - deleteBackupFile", (): void => {
  let resolver: AdminResolver;
  let consoleErrorSpy: jest.SpyInstance<void, [message?: unknown, ...optionalParams: unknown[]], unknown>;

  beforeEach((): void => {
    // Optional injection of db = undefined to avoid loading Prisma/DataSource
    resolver = new AdminResolver(undefined);

    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation((): void => {});
  });

  afterEach((): void => {
    consoleErrorSpy.mockRestore();
  });

  it("should delete file successfully", async (): Promise<void> => {
    const fileName: string = "backup.sql";
    existsSyncMock.mockReturnValue(true);
    unlinkMock.mockResolvedValue(undefined);

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(existsSyncMock).toHaveBeenCalledWith(expect.stringContaining(fileName));
    expect(unlinkMock).toHaveBeenCalledWith(expect.stringContaining(fileName));
    expect(result.code).toBe(200);
    expect(result.message).toMatch(/deleted successfully/);
  });

  it("should reject deletion if path traversal detected", async (): Promise<void> => {
    const fileName: string = "../evil.sql";

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(result.code).toBe(400);
    expect(result.message).toMatch(/Invalid file path/);
    expect(existsSyncMock).not.toHaveBeenCalled();
    expect(unlinkMock).not.toHaveBeenCalled();
  });

  it("should return 404 if file does not exist", async (): Promise<void> => {
    const fileName: string = "missing.sql";
    existsSyncMock.mockReturnValue(false);

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(existsSyncMock).toHaveBeenCalledWith(expect.stringContaining(fileName));
    expect(unlinkMock).not.toHaveBeenCalled();
    expect(result.code).toBe(404);
    expect(result.message).toMatch(/not found/);
  });

  it("should return 500 on unlink failure", async (): Promise<void> => {
    const fileName: string = "fileToDelete.sql";
    const error: Error = new Error("unlink failed");

    existsSyncMock.mockReturnValue(true);
    unlinkMock.mockRejectedValue(error);

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(existsSyncMock).toHaveBeenCalledWith(expect.stringContaining(fileName));
    expect(unlinkMock).toHaveBeenCalledWith(expect.stringContaining(fileName));
    expect(result.code).toBe(500);
    expect(result.message).toBe("unlink failed");
  });

  it("should reject deletion if fileName is empty", async (): Promise<void> => {
    const fileName: string = "";

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(result.code).toBe(400);
    expect(result.message).toMatch(/Invalid file path/);
    expect(existsSyncMock).not.toHaveBeenCalled();
    expect(unlinkMock).not.toHaveBeenCalled();
  });
});