import "reflect-metadata";
import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import { ProjectResponse } from "../../../src/types/response.types";
import { FileUpload } from "graphql-upload-ts";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import Cookies from "cookies";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";

interface TestProject {
  id: number;
  title: string;
  descriptionEN: string;
  descriptionFR: string;
  typeDisplay: string;
  github: string | null;
  contentDisplay: string;
}

const createMockFileUpload = (filename: string, mimetype: string): FileUpload => ({
  filename,
  mimetype,
  encoding: "7bit",
  fieldName: "file",
  capacitor: null as any,
  createReadStream: jest.fn().mockReturnValue({
    pipe: jest.fn(),
    on: jest.fn().mockImplementation((event: string, cb?: () => void) => {
      if (event === "finish" && cb) setImmediate(cb);
      return { pipe: jest.fn(), on: jest.fn() };
    })
  } as any)
});

describe("ProjectAdminResolver.uploadProjectMedia", (): void => {
  let resolver: ProjectAdminResolver;
  let mockContext: MyContext;
  let mockDbProject: any;

  beforeEach((): void => {
    resolver = new ProjectAdminResolver();
    
    // ✅ Mock DB with explicit types
    mockDbProject = mockDeep<any>({
      findUnique: jest.fn(),
      update: jest.fn()
    });

    Object.defineProperty(resolver, 'db', {
      value: {
        project: mockDbProject
      },
      writable: true
    });

    // ✅ Mock private methods with explicit types
    (resolver as any).deleteMediaFile = jest.fn().mockResolvedValue(undefined);
    (resolver as any).transformProject = jest.fn((project: TestProject): TestProject => ({
      ...project
    }));

    const mockReq: DeepMockProxy<Request> = mockDeep<Request>();
    const mockRes: DeepMockProxy<Response> = mockDeep<Response>();
    const mockCookies: DeepMockProxy<Cookies> = mockDeep<Cookies>();

    mockContext = {
      user: {
        id: 1,
        firstname: "Admin",
        lastname: "User",
        email: "admin@example.com",
        role: UserRole.admin,
        isPasswordChange: false
      },
      req: mockReq,
      res: mockRes,
      cookies: mockCookies,
      token: "mock-token"
    };

    jest.spyOn(fs, "mkdir").mockResolvedValue(undefined as any);
    jest.spyOn(fs, "unlink").mockResolvedValue(undefined as any);
    jest.spyOn(fsSync, "existsSync").mockReturnValue(false);
    
    const mockWriteStream: { on: jest.Mock<any, any> } = {
      on: jest.fn().mockImplementation((event: string, cb?: () => void): { on: jest.Mock<any, any> } => {
        if (event === "finish" && cb) setImmediate(cb);
        return mockWriteStream;
      })
    };
    (fsSync as any).createWriteStream = jest.fn().mockReturnValue(mockWriteStream);
  });

  afterEach((): void => {
    jest.restoreAllMocks();
  });

  describe("✅ Success cases", (): void => {
    it.each([
      { filename: "test.jpg", mimetype: "image/jpeg", expectedType: "image" },
      { filename: "demo.mp4", mimetype: "video/mp4", expectedType: "video" }
    ])("uploads $filename successfully", async ({ filename, mimetype, expectedType }): Promise<void> => {
      // Arrange
      const projectId: number = 1;
      const existingProject: TestProject = {
        id: projectId,
        title: "Test",
        descriptionEN: "",
        descriptionFR: "",
        typeDisplay: "",
        github: null,
        contentDisplay: ""
      };

      const updatedProject: TestProject = {
        ...existingProject,
        typeDisplay: expectedType,
        contentDisplay: `project-${projectId}-123.jpg`
      };

      mockDbProject.findUnique.mockResolvedValue(existingProject);
      mockDbProject.update.mockResolvedValue(updatedProject);

      const result: ProjectResponse = await resolver.uploadProjectMedia(
        projectId,
        createMockFileUpload(filename, mimetype),
        mockContext
      );

      expect(result.code).toBe(200);
      expect(result.project!.typeDisplay).toBe(expectedType);
    });
  });

  describe("🔄 File replacement", (): void => {
    it("deletes old file when new uploaded", async (): Promise<void> => {
      const projectId: number = 1;
      const oldFile: string = "old-media.jpg";
      const existingProject: TestProject = {
        id: projectId,
        title: "Test",
        descriptionEN: "",
        descriptionFR: "",
        typeDisplay: "image",
        github: null,
        contentDisplay: oldFile
      };

      mockDbProject.findUnique.mockResolvedValue(existingProject);

      await resolver.uploadProjectMedia(
        projectId,
        createMockFileUpload("new.jpg", "image/jpeg"),
        mockContext
      );

      expect((resolver as any).deleteMediaFile).toHaveBeenCalledWith(oldFile, "image");
    });
  });

  describe("🚫 Auth & Validation", (): void => {
    it("returns 401 without user", async (): Promise<void> => {
      const result: ProjectResponse = await resolver.uploadProjectMedia(
        1,
        createMockFileUpload("test.jpg", "image/jpeg"),
        { ...mockContext, user: null }
      );
      expect(result.code).toBe(401);
    });

    it("returns 404 for non-existing project", async (): Promise<void> => {
      mockDbProject.findUnique.mockResolvedValue(null);
      const result: ProjectResponse = await resolver.uploadProjectMedia(
        999,
        createMockFileUpload("test.jpg", "image/jpeg"),
        mockContext
      );
      expect(result.code).toBe(404);
    });

    it("rejects PDF files", async (): Promise<void> => {
      mockDbProject.findUnique.mockResolvedValue({ id: 1 } as TestProject);
      const result: ProjectResponse = await resolver.uploadProjectMedia(
        1,
        createMockFileUpload("doc.pdf", "application/pdf"),
        mockContext
      );
      expect(result.code).toBe(400);
      expect(result.message).toBe("Only images and videos are allowed");
    });
  });

  describe("💥 Error handling", (): void => {
    it("returns 500 on DB error", async (): Promise<void> => {
      mockDbProject.findUnique.mockResolvedValue({ id: 1 } as TestProject);
      mockDbProject.update.mockRejectedValue(new Error("DB Error"));

      const result: ProjectResponse = await resolver.uploadProjectMedia(
        1,
        createMockFileUpload("test.jpg", "image/jpeg"),
        mockContext
      );

      expect(result.code).toBe(500);
      expect(result.message).toContain("DB Error");
    });
  });
});
