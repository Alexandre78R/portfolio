import "reflect-metadata";
import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import * as fs from "fs";
import * as fsPromises from "fs/promises";

jest.mock("fs");
jest.mock("fs/promises");

describe("ProjectAdminResolver - deleteProjectMedia", () => {
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
      cookies: {} as MyContext["cookies"],
      token: "mock-token",
    };

    mockPrisma = {
      project: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    Object.defineProperty(resolver, "db", {
      value: mockPrisma,
      writable: true,
    });

    (resolver as unknown).transformProject = jest
      .fn()
      .mockImplementation((project) => ({
        id: project.id,
        title: project.title,
        descriptionEN: project.descriptionEN,
        descriptionFR: project.descriptionFR,
        typeDisplay: project.typeDisplay,
        contentDisplay: project.contentDisplay,
        github: project.github,
        skills: project.skills || [],
      }));

    (resolver as unknown).deleteMediaFile = jest
      .fn()
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when user not authenticated", async () => {
    const result: ProjectResponse = await resolver.deleteProjectMedia(1, {
      user: null,
      req: {} as MyContext["req"],
      res: {} as MyContext["res"],
      cookies: {} as MyContext["cookies"],
      token: "",
    } as MyContext);

    expect(result).toEqual({
      code: 401,
      message: "Authentication required",
    });
  });

  it("should return 404 when project not found", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null);

    const result: ProjectResponse = await resolver.deleteProjectMedia(1, mockCtx);

    expect(result).toEqual({
      code: 404,
      message: "Project not found",
    });
  });

  it("should delete media file and update project", async () => {
    const mockProject: ProjectResponse["project"] = {
      id: 1,
      title: "Test Project",
      descriptionEN: "Test EN",
      descriptionFR: "Test FR",
      userId: 1,
      contentDisplay: "video.mp4",
      typeDisplay: "VIDEO",
      github: null,
      skills: [],
    };

    mockPrisma.project.findUnique.mockResolvedValue(mockProject);
    mockPrisma.project.update.mockResolvedValue({
      ...mockProject,
      contentDisplay: "",
      typeDisplay: "",
    });

    const result: ProjectResponse = await resolver.deleteProjectMedia(1, mockCtx);

    expect((resolver as ).deleteMediaFile).toHaveBeenCalledWith(
      "video.mp4",
      "VIDEO"
    );
    expect(mockPrisma.project.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        contentDisplay: "",
        typeDisplay: "",
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
    expect((resolver as unknown).transformProject).toHaveBeenCalled();
    expect(result.code).toBe(200);
    expect(result.message).toBe("Media deleted successfully");
  });

  it("should handle deletion when no media file exists", async () => {
    const mockProject: ProjectResponse["project"] = {
      id: 1,
      title: "Test Project",
      descriptionEN: "Test EN",
      descriptionFR: "Test FR",
      userId: 1,
      contentDisplay: "",
      typeDisplay: "",
      github: null,
      skills: [],
    };

    mockPrisma.project.findUnique.mockResolvedValue(mockProject);
    mockPrisma.project.update.mockResolvedValue(mockProject);

    const result: ProjectResponse = await resolver.deleteProjectMedia(1, mockCtx);

    expect((resolver as unknown).deleteMediaFile).not.toHaveBeenCalled();
    expect(result.code).toBe(200);
    expect(result.message).toBe("Media deleted successfully");
  });
});
