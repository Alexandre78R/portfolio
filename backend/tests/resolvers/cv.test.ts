import "reflect-metadata";
import fs from "fs";
import { CVResolver } from "../../src/resolvers/cv.resolver";
import type { FileUpload } from "graphql-upload-ts";
import type { ReadStream } from "fs";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("fs");

describe("CVResolver", (): void => {
  let cvResolver: CVResolver;

  beforeEach((): void => {
    cvResolver = new CVResolver();
    jest.clearAllMocks();
  });

  it("should return CV URL when CV file exists", (): void => {
    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    mockExistsSync.mockReturnValue(true);

    const url: string = cvResolver.cvUrl();
    
    expect(url).toBe("/api/uploads/cv/Alexandre-Renard-CV.pdf");
    expect(mockExistsSync).toHaveBeenCalled();
  });

  it("should throw error when CV file does not exist", (): void => {
    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    mockExistsSync.mockReturnValue(false);

    expect((): string => cvResolver.cvUrl()).toThrow("CV not found");
  });

  it("should upload a valid PDF file successfully", async (): Promise<void> => {
    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;
    const mockCreateWriteStream = fs.createWriteStream as jest.MockedFunction<typeof fs.createWriteStream>;

    // Mock write stream
    const writeStreamMock = {
      on: jest.fn((event: string, callback: () => void) => {
        if (event === "finish") {
          callback();
        }
        return writeStreamMock;
      }),
      pipe: jest.fn().mockReturnThis(),
    } as unknown as fs.WriteStream;

    mockExistsSync.mockReturnValue(false);
    mockMkdirSync.mockImplementation(jest.fn() as any);
    mockCreateWriteStream.mockReturnValue(writeStreamMock);

    // Mock read stream
    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
    } as unknown as ReadStream;

    // Mock FileUpload
    const mockFile = {
      filename: "test.pdf",
      mimetype: "application/pdf",
      encoding: "utf-8",
      createReadStream: jest.fn((): ReadStream => mockReadStream),
    } as unknown as FileUpload;

    const result: boolean = await cvResolver.uploadCV(mockFile);
    
    expect(result).toBe(true);
    expect(mockExistsSync).toHaveBeenCalledWith(expect.any(String));
    expect(mockMkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    expect(mockCreateWriteStream).toHaveBeenCalledWith(expect.any(String));
    expect(mockFile.createReadStream).toHaveBeenCalled();
  });

  it("should reject upload when file type is not PDF", async (): Promise<void> => {
    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
    } as unknown as ReadStream;

    const mockFile = {
      filename: "test.txt",
      mimetype: "text/plain",
      encoding: "utf-8",
      createReadStream: jest.fn((): ReadStream => mockReadStream),
    } as unknown as FileUpload;

    await expect(cvResolver.uploadCV(mockFile)).rejects.toThrow(
      "Invalid file type. Only PDF files are allowed."
    );
  });
});