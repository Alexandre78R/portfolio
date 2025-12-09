import "reflect-metadata";
import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import { ProjectResponse } from "../../../src/types/response.types";
import prisma from "../../../src/lib/prisma";
import Cookies from "cookies";
import * as fs from "fs";
import * as fsPromises from "fs/promises";

jest.mock("fs");
jest.mock("fs/promises");
jest.mock("../../../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    project: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    projectSkill: {
      deleteMany: jest.fn(),
    },
  },
}));

describe("ProjectAdminResolver - deleteProject", () => {
  let resolver: ProjectAdminResolver;
  let mockPrisma: any;
  let mockCtx: MyContext;

  beforeEach(() => {
    resolver = new ProjectAdminResolver();
    
    mockCtx = {
      user: {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      },
      req: {} as MyContext["req"],
      res: {} as MyContext["res"],
      cookies: {} as Cookies,
      token: "mock-token",
    };

    mockPrisma = prisma as unknown as {
      project: {
        findUnique: jest.Mock;
        delete: jest.Mock;
      };
      projectSkill: {
        deleteMany: jest.Mock;
      };
    };

    Object.defineProperty(resolver, "db", {
      value: mockPrisma,
      writable: true,
    });

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    
    (fsPromises.unlink as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when user not authenticated", async () => {
    const result = await resolver.deleteProject(1, {
      user: null,
      req: {} as MyContext["req"],
      res: {} as MyContext["res"],
      cookies: {} as Cookies,
      token: "",
    } as MyContext);

    expect(result).toEqual({
      code: 401,
      message: "Authentication required",
    });
  });

  it("should return 404 when project not found", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null);

    const result: ProjectResponse = await resolver.deleteProject(1, mockCtx);

    expect(result).toEqual({
      code: 404,
      message: "Project not found",
    });
  });

  it("should delete project successfully without media", async () => {
    const mockProject: ProjectResponse["project"] = {
      id: 1,
      title: "Test Project",
      descriptionEN: "Test EN",
      descriptionFR: "Test FR",
      contentDisplay: "",
      typeDisplay: "",
      github: null,
      image: null,
      video: null,
      skills: [],
    };

    mockPrisma.project.findUnique.mockResolvedValue(mockProject);
    mockPrisma.project.delete.mockResolvedValue(mockProject);

    const result: ProjectResponse = await resolver.deleteProject(1, mockCtx);

    expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockPrisma.project.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result.code).toBe(200);
    expect(result.message).toBe("Project deleted successfully");
  });

  it("should delete project and its media file", async () => {
    const mockProject: ProjectResponse["project"] = {
      id: 1,
      title: "Test Project",
      descriptionEN: "Test EN",
      descriptionFR: "Test FR",
      contentDisplay: "project-1-123456.mp4",
      typeDisplay: "video",
      github: null,
      image: null,
      video: null,
      skills: [],
    };

    mockPrisma.project.findUnique.mockResolvedValue(mockProject);
    mockPrisma.project.delete.mockResolvedValue(mockProject);

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsPromises.unlink as jest.Mock).mockResolvedValue(undefined);

    const result: ProjectResponse = await resolver.deleteProject(1, mockCtx);

    expect(mockPrisma.project.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect((fsPromises.unlink as jest.Mock)).toHaveBeenCalled();
    expect(result.code).toBe(200);
    expect(result.message).toBe("Project deleted successfully");
  });

  it("should delete project even if media file does not exist", async () => {
    const mockProject: ProjectResponse["project"] = {
      id: 1,
      title: "Test Project",
      descriptionEN: "Test EN",
      descriptionFR: "Test FR",
      contentDisplay: "project-1-123456.png",
      typeDisplay: "image",
      github: null,
      image: null,
      video: null,
      skills: [],
    };

    mockPrisma.project.findUnique.mockResolvedValue(mockProject);
    mockPrisma.project.delete.mockResolvedValue(mockProject);

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result: ProjectResponse = await resolver.deleteProject(1, mockCtx);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project deleted successfully");
    expect(mockPrisma.project.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect((fsPromises.unlink as jest.Mock)).not.toHaveBeenCalled();
  });

  it("should return 500 on database delete error", async () => {
    const mockProject: ProjectResponse["project"] = {
      id: 1,
      title: "Test Project",
      descriptionEN: "Test EN",
      descriptionFR: "Test FR",
      contentDisplay: "",
      typeDisplay: "",
      github: null,
      image: null,
      video: null,
      skills: [],
    };

    mockPrisma.project.findUnique.mockResolvedValue(mockProject);
    mockPrisma.project.delete.mockRejectedValueOnce(
      new Error("Database connection error")
    );

    const result: ProjectResponse = await resolver.deleteProject(1, mockCtx);

    expect(result.code).toBe(500);
    expect(result.message).toContain("Database connection error");
  });

  it("should verify project existence before deletion", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null);

    const result: ProjectResponse = await resolver.deleteProject(99, mockCtx);

    expect(mockPrisma.project.delete).not.toHaveBeenCalled();
    expect(result.code).toBe(404);
  });
});
