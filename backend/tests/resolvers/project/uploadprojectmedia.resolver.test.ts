import "reflect-metadata";
import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import { ProjectResponse } from "../../../src/types/response.types";
import { FileUpload } from "graphql-upload-ts";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";

// ================= TYPES SIMPLES =================
interface TestProject {
  id: number;
  title: string;
  descriptionEN: string;
  descriptionFR: string;
  typeDisplay: string;
  github: string | null;
  contentDisplay: string;
}

// ================= MOCK FILE UPLOAD =================
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

describe("ProjectAdminResolver.uploadProjectMedia", () => {
  let resolver: ProjectAdminResolver;
  let mockContext: MyContext;
  const mockAdminUser = { id: 1, role: UserRole.admin };

  beforeEach(() => {
    resolver = new ProjectAdminResolver();
    
    // ✅ MOCK CRITIQUE : override this.db complètement
    (resolver as any).db = {
      project: {
        findUnique: jest.fn(),
        update: jest.fn()
      }
    };

    // ✅ MOCK des méthodes privées du resolver
    (resolver as any).deleteMediaFile = jest.fn().mockResolvedValue(undefined);
    (resolver as any).transformProject = jest.fn((project: TestProject) => ({
      ...project,
      skills: []
    }));

    mockContext = {
      user: mockAdminUser,
      req: {} as MyContext["req"],
      res: {} as MyContext["res"],
      cookies: {},
      token: "mock-token"
    } as MyContext;

    // ✅ Mock FS global
    jest.spyOn(fs, "mkdir").mockResolvedValue(undefined as any);
    jest.spyOn(fs, "unlink").mockResolvedValue(undefined as any);
    jest.spyOn(fsSync, "existsSync").mockReturnValue(false);
    
    const mockWriteStream = {
      on: jest.fn().mockImplementation((event: string, cb?: () => void) => {
        if (event === "finish" && cb) setImmediate(cb);
        return mockWriteStream;
      })
    };
    (fsSync as any).createWriteStream = jest.fn().mockReturnValue(mockWriteStream);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("✅ Success cases", () => {
    it.each([
      { filename: "test.jpg", mimetype: "image/jpeg", expectedType: "image" },
      { filename: "demo.mp4", mimetype: "video/mp4", expectedType: "video" }
    ])("uploads $filename successfully", async ({ filename, mimetype, expectedType }) => {
      // Arrange
      const projectId = 1;
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

      (resolver as any).db.project.findUnique.mockResolvedValue(existingProject);
      (resolver as any).db.project.update.mockResolvedValue(updatedProject);

      // Act
      const result = await resolver.uploadProjectMedia(
        projectId,
        createMockFileUpload(filename, mimetype),
        mockContext
      );

      // Assert
      expect(result.code).toBe(200);
      expect(result.project!.typeDisplay).toBe(expectedType);
    });
  });

  describe("🔄 File replacement", () => {
    it("deletes old file when new uploaded", async () => {
      // Arrange
      const projectId = 1;
      const oldFile = "old-media.jpg";
      const existingProject: TestProject = {
        id: projectId,
        title: "Test",
        descriptionEN: "",
        descriptionFR: "",
        typeDisplay: "image",
        github: null,
        contentDisplay: oldFile
      };

      (resolver as any).db.project.findUnique.mockResolvedValue(existingProject);

      // Act
      await resolver.uploadProjectMedia(
        projectId,
        createMockFileUpload("new.jpg", "image/jpeg"),
        mockContext
      );

      // Assert
      expect((resolver as any).deleteMediaFile).toHaveBeenCalledWith(oldFile, "image");
    });
  });

  describe("🚫 Auth & Validation", () => {
    it("returns 401 without user", async () => {
      const result = await resolver.uploadProjectMedia(
        1,
        createMockFileUpload("test.jpg", "image/jpeg"),
        { ...mockContext, user: null }
      );
      expect(result.code).toBe(401);
    });

    it("returns 404 for non-existing project", async () => {
      (resolver as any).db.project.findUnique.mockResolvedValue(null);
      const result = await resolver.uploadProjectMedia(
        999,
        createMockFileUpload("test.jpg", "image/jpeg"),
        mockContext
      );
      expect(result.code).toBe(404);
    });

    it("rejects PDF files", async () => {
      (resolver as any).db.project.findUnique.mockResolvedValue({ id: 1 } as TestProject);
      const result = await resolver.uploadProjectMedia(
        1,
        createMockFileUpload("doc.pdf", "application/pdf"),
        mockContext
      );
      expect(result.code).toBe(400);
      expect(result.message).toBe("Only images and videos are allowed");
    });
  });

  describe("💥 Error handling", () => {
    it("returns 500 on DB error", async () => {
      (resolver as any).db.project.findUnique.mockResolvedValue({ id: 1 } as TestProject);
      (resolver as any).db.project.update.mockRejectedValue(new Error("DB Error"));

      const result = await resolver.uploadProjectMedia(
        1,
        createMockFileUpload("test.jpg", "image/jpeg"),
        mockContext
      );

      expect(result.code).toBe(500);
      expect(result.message).toContain("DB Error");
    });
  });
});
