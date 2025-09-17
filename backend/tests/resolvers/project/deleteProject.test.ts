import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { Response } from "../../../src/types/response.types";
import { Project as PrismaProject, ProjectSkill as PrismaProjectSkill } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";
import Cookies from "cookies";

describe("ProjectResolver - deleteProject", () => {
  let resolver: ProjectResolver;

  const mockCookies = mockDeep<Cookies>();

  const mockAdminUser: User = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const mockRegularUser: User = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "regular@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  const baseMockContext: MyContext = {
    req: {} as any,
    res: {} as any,
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const mockExistingProject: PrismaProject = {
    id: 100,
    title: "Project to Delete",
    descriptionEN: "Desc EN",
    descriptionFR: "Desc FR",
    typeDisplay: "Type",
    github: "github.com",
    contentDisplay: "Content",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.project.findUnique.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();
    prismaMock.project.delete.mockReset();
    resolver = new ProjectResolver(prismaMock);
    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully delete a project and its associated skills by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 3 });
    prismaMock.project.delete.mockResolvedValueOnce(mockExistingProject);

    const result: Response = await resolver.deleteProject(mockExistingProject.id, adminContext);

    expect(result).toEqual({
      code: 200,
      message: "Project deleted successfully",
    });

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: mockExistingProject.id },
    });
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({
      where: { projectId: mockExistingProject.id },
    });
    expect(prismaMock.project.delete).toHaveBeenCalledWith({
      where: { id: mockExistingProject.id },
    });
  });

  it("should return 401 if no user is authenticated", async () => {
    const context: MyContext = { ...baseMockContext, user: null };

    const result: Response = await resolver.deleteProject(mockExistingProject.id, context);

    expect(result).toEqual({ code: 401, message: "Authentication required." });

    expect(prismaMock.project.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const context: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result: Response = await resolver.deleteProject(mockExistingProject.id, context);

    expect(result).toEqual({ code: 403, message: "Access denied. Admin role required." });

    expect(prismaMock.project.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if the project to delete is not found", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result: Response = await resolver.deleteProject(999, context);

    expect(result).toEqual({ code: 404, message: "Project not found" });

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during project lookup", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.project.findUnique.mockRejectedValueOnce(new Error("DB error during findUnique"));

    const result: Response = await resolver.deleteProject(mockExistingProject.id, context);

    expect(result).toEqual({ code: 500, message: "Internal server error" });

    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during projectSkill deletion", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error("DB error during projectSkill deleteMany"));

    const result: Response = await resolver.deleteProject(mockExistingProject.id, context);

    expect(result).toEqual({ code: 500, message: "Internal server error" });

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during project deletion", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.project.delete.mockRejectedValueOnce(new Error("DB error during project delete"));

    const result: Response = await resolver.deleteProject(mockExistingProject.id, context);

    expect(result).toEqual({ code: 500, message: "Internal server error" });

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.delete).toHaveBeenCalledTimes(1);
  });
});