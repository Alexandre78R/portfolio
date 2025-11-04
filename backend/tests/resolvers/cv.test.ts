import "reflect-metadata";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import type { FileUpload } from "graphql-upload-ts";
import type { WriteStream } from "fs";
import { CVResolver } from "../../src/resolvers/cv.resolver";
import type { UploadResponse } from "../../src/types/response.types";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("fs");

describe("CVResolver", (): void => {
  let cvResolver: CVResolver;
  const MOCK_UPLOAD_DIR: string = path.resolve(__dirname, "../../uploads/cv");
  const MOCK_CV_FILENAME: string = "Alexandre-Renard-CV.pdf";
  const MOCK_CV_PATH: string = path.join(MOCK_UPLOAD_DIR, MOCK_CV_FILENAME);
  const MOCK_CV_URL: string = `/api/uploads/cv/${MOCK_CV_FILENAME}`;

  /**
   * Creates a mock WriteStream for testing file upload scenarios
   * @param shouldError - Whether the stream should emit an error event
   * @returns Mocked WriteStream instance
   */
  const createMockWriteStream = (shouldError: boolean = false): WriteStream => {
    const mockWriteStream = new Readable();
    
    Object.assign(mockWriteStream, {
      writable: true,
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn((event: string, callback: (error?: Error) => void): WriteStream => {
        if (shouldError && event === "error") {
          setImmediate(() => callback(new Error("disk error")));
        } else if (!shouldError && event === "finish") {
          setImmediate(() => callback());
        }
        return mockWriteStream as unknown as WriteStream;
      }),
      once: jest.fn((event: string, callback: (error?: Error) => void): WriteStream => {
        if (shouldError && event === "error") {
          setImmediate(() => callback(new Error("disk error")));
        } else if (!shouldError && event === "finish") {
          setImmediate(() => callback());
        }
        return mockWriteStream as unknown as WriteStream;
      }),
      emit: jest.fn(),
      pipe: jest.fn().mockReturnThis(),
    });

    return mockWriteStream as unknown as WriteStream;
  };

  /**
   * Creates a mock FileUpload object for testing
   * @param filename - Name of the file
   * @param mimetype - MIME type of the file
   * @param encoding - File encoding (default: "utf-8")
   * @returns Mocked FileUpload instance
   */
  const createMockFileUpload = (
    filename: string,
    mimetype: string,
    encoding: string = "utf-8"
  ): FileUpload => {
    const mockReadStream = new Readable({ read(): void { this.push(null); } });
    
    const mockFile = {
      filename,
      mimetype,
      encoding,
      fieldName: "file",
      capacitor: {} as unknown,
      createReadStream: jest.fn(() => mockReadStream),
    };

    return mockFile as unknown as FileUpload;
  };

  beforeEach((): void => {
    cvResolver = new CVResolver();
    jest.clearAllMocks();
  });

  describe("cvUrl", (): void => {
    it("should return CV URL when CV file exists", (): void => {
      const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
      mockExistsSync.mockReturnValue(true);

      const url: string = cvResolver.cvUrl();

      expect(url).toBe(MOCK_CV_URL);
      expect(url).toMatch(/^\/api\/uploads\/cv\//);
      expect(url).toContain(MOCK_CV_FILENAME);
      expect(mockExistsSync).toHaveBeenCalledWith(MOCK_CV_PATH);
      expect(mockExistsSync).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when CV file does not exist", (): void => {
      const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
      mockExistsSync.mockReturnValue(false);

      expect(() => cvResolver.cvUrl()).toThrow("CV not found");
      expect(() => cvResolver.cvUrl()).toThrow(Error);
      expect(mockExistsSync).toHaveBeenCalledWith(MOCK_CV_PATH);
    });
  });

  describe("uploadCV", (): void => {
    describe("successful upload scenarios", (): void => {
      it("should upload a valid PDF file successfully when folder does not exist", async (): Promise<void> => {
        const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
        const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;
        const mockCreateWriteStream = fs.createWriteStream as jest.MockedFunction<typeof fs.createWriteStream>;

        const mockWriteStream: WriteStream = createMockWriteStream(false);
        const mockFile: FileUpload = createMockFileUpload("test.pdf", "application/pdf");

        mockExistsSync.mockReturnValue(false);
        mockMkdirSync.mockImplementation(jest.fn() as unknown as typeof fs.mkdirSync);
        mockCreateWriteStream.mockReturnValue(mockWriteStream);

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.message).toBe("CV uploaded successfully!");
        expect(result.url).toBe(MOCK_CV_URL);
        expect(result.url).toMatch(/^\/api\/uploads\/cv\//);
        expect(mockExistsSync).toHaveBeenCalledWith(MOCK_UPLOAD_DIR);
        expect(mockMkdirSync).toHaveBeenCalledWith(MOCK_UPLOAD_DIR, { recursive: true });
        expect(mockMkdirSync).toHaveBeenCalledTimes(1);
        expect(mockCreateWriteStream).toHaveBeenCalledWith(MOCK_CV_PATH);
        expect(mockFile.createReadStream).toHaveBeenCalled();
      });

      it("should upload a valid PDF file successfully when folder already exists", async (): Promise<void> => {
        const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
        const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;
        const mockCreateWriteStream = fs.createWriteStream as jest.MockedFunction<typeof fs.createWriteStream>;

        const mockWriteStream: WriteStream = createMockWriteStream(false);
        const mockFile: FileUpload = createMockFileUpload("test.pdf", "application/pdf");

        mockExistsSync.mockReturnValue(true);
        mockMkdirSync.mockImplementation(jest.fn() as unknown as typeof fs.mkdirSync);
        mockCreateWriteStream.mockReturnValue(mockWriteStream);

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.message).toBe("CV uploaded successfully!");
        expect(result.url).toBe(MOCK_CV_URL);
        expect(mockExistsSync).toHaveBeenCalledWith(MOCK_UPLOAD_DIR);
        expect(mockMkdirSync).not.toHaveBeenCalled();
        expect(mockCreateWriteStream).toHaveBeenCalledWith(MOCK_CV_PATH);
      });
    });

    describe("validation scenarios", (): void => {
      it("should reject upload when file type is not PDF", async (): Promise<void> => {
        const mockFile: FileUpload = createMockFileUpload("test.txt", "text/plain");

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result).toBeDefined();
        expect(result.code).toBe(400);
        expect(result.message).toBe("Invalid file type. Only PDF files are allowed.");
        expect(result.url).toBeUndefined();
        expect(mockFile.createReadStream).not.toHaveBeenCalled();
      });

      it("should reject upload when file type is application/json", async (): Promise<void> => {
        const mockFile: FileUpload = createMockFileUpload("data.json", "application/json");

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result.code).toBe(400);
        expect(result.message).toBe("Invalid file type. Only PDF files are allowed.");
        expect(result.url).toBeUndefined();
      });

      it("should reject upload when file type is image/png", async (): Promise<void> => {
        const mockFile: FileUpload = createMockFileUpload("image.png", "image/png");

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result.code).toBe(400);
        expect(result.message).toBe("Invalid file type. Only PDF files are allowed.");
        expect(result.url).toBeUndefined();
      });
    });

    describe("error scenarios", (): void => {
      it("should return 500 error if write stream fails", async (): Promise<void> => {
        const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
        const mockCreateWriteStream = fs.createWriteStream as jest.MockedFunction<typeof fs.createWriteStream>;

        const mockWriteStream: WriteStream = createMockWriteStream(true);
        const mockFile: FileUpload = createMockFileUpload("test.pdf", "application/pdf");

        mockExistsSync.mockReturnValue(true);
        mockCreateWriteStream.mockReturnValue(mockWriteStream);

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result).toBeDefined();
        expect(result.code).toBe(500);
        expect(result.message).toBe("Error saving CV file");
        expect(result.url).toBeUndefined();
        expect(mockFile.createReadStream).toHaveBeenCalled();
      });

      it("should handle stream pipe error gracefully", async (): Promise<void> => {
        const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
        const mockCreateWriteStream = fs.createWriteStream as jest.MockedFunction<typeof fs.createWriteStream>;

        const mockWriteStream: WriteStream = createMockWriteStream(true);
        const mockFile: FileUpload = createMockFileUpload("corrupted.pdf", "application/pdf");

        mockExistsSync.mockReturnValue(true);
        mockCreateWriteStream.mockReturnValue(mockWriteStream);

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result.code).toBe(500);
        expect(result.message).toBe("Error saving CV file");
        expect(result.url).toBeUndefined();
      });
    });

    describe("edge cases", (): void => {
      it("should handle PDF file with different encoding", async (): Promise<void> => {
        const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
        const mockCreateWriteStream = fs.createWriteStream as jest.MockedFunction<typeof fs.createWriteStream>;

        const mockWriteStream: WriteStream = createMockWriteStream(false);
        const mockFile: FileUpload = createMockFileUpload("test.pdf", "application/pdf", "binary");

        mockExistsSync.mockReturnValue(true);
        mockCreateWriteStream.mockReturnValue(mockWriteStream);

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result.code).toBe(200);
        expect(result.message).toBe("CV uploaded successfully!");
        expect(result.url).toBe(MOCK_CV_URL);
      });

      it("should handle PDF file with uppercase extension", async (): Promise<void> => {
        const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
        const mockCreateWriteStream = fs.createWriteStream as jest.MockedFunction<typeof fs.createWriteStream>;

        const mockWriteStream: WriteStream = createMockWriteStream(false);
        const mockFile: FileUpload = createMockFileUpload("TEST.PDF", "application/pdf");

        mockExistsSync.mockReturnValue(true);
        mockCreateWriteStream.mockReturnValue(mockWriteStream);

        const result: UploadResponse = await cvResolver.uploadCV(mockFile);

        expect(result.code).toBe(200);
        expect(result.message).toBe("CV uploaded successfully!");
      });
    });
  });
});