import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { Response } from "../../../src/types/response.types";
import type { Project as PrismaProject, ProjectSkill as PrismaProjectSkill } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import Cookies from "cookies";

describe("ProjectResolver - deleteProject", () => {
  let resolver: ProjectResolver;
  let cookiesMock: DeepMockProxy<Cookies>;

  const adminUser: Readonly<User> = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const regularUser: Readonly<User> = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "regular@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  const baseContext: Readonly<MyContext> = {
    req: {} as MyContext["req"],
    res: {} as MyContext["res"],
    cookies: {} as Cookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const existingProject: Readonly<PrismaProject> = {
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
    cookiesMock = mockDeep<Cookies>();
    resolver = new ProjectResolver(prismaMock);

    prismaMock.project.findUnique.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();
    prismaMock.project.delete.mockReset();
  });

  it("should delete a project and its skills successfully by an admin", async () => {
    const context: MyContext = { ...baseContext, user: adminUser, cookies: cookiesMock };

    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 3 });
    prismaMock.project.delete.mockResolvedValueOnce(existingProject);

    const result: Response = await resolver.deleteProject(existingProject.id, context);

    expect(result).toEqual({ code: 200, message: "Project deleted successfully" });

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({ where: { id: existingProject.id } });
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({ where: { projectId: existingProject.id } });
    expect(prismaMock.project.delete).toHaveBeenCalledWith({ where: { id: existingProject.id } });
  });

  it("should return 401 if no user is authenticated", async () => {
    const result: Response = await resolver.deleteProject(existingProject.id, baseContext);

    expect(result).toEqual({ code: 401, message: "Authentication required." });

    expect(prismaMock.project.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const context: MyContext = { ...baseContext, user: regularUser, cookies: cookiesMock };
    const result: Response = await resolver.deleteProject(existingProject.id, context);

    expect(result).toEqual({ code: 403, message: "Access denied. Admin role required." });

    expect(prismaMock.project.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if the project to delete does not exist", async () => {
    const context: MyContext = { ...baseContext, user: adminUser, cookies: cookiesMock };
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result: Response = await resolver.deleteProject(999, context);

    expect(result).toEqual({ code: 404, message: "Project not found" });

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 if database error occurs during project lookup", async () => {
    const context: MyContext = { ...baseContext, user: adminUser, cookies: cookiesMock };
    prismaMock.project.findUnique.mockRejectedValueOnce(new Error("DB error during findUnique"));

    const result: Response = await resolver.deleteProject(existingProject.id, context);

    expect(result).toEqual({ code: 500, message: "Internal server error" });

    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 if database error occurs during projectSkill deletion", async () => {
    const context: MyContext = { ...baseContext, user: adminUser, cookies: cookiesMock };
    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error("DB error during projectSkill deleteMany"));

    const result: Response = await resolver.deleteProject(existingProject.id, context);

    expect(result).toEqual({ code: 500, message: "Internal server error" });

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 if database error occurs during project deletion", async () => {
    const context: MyContext = { ...baseContext, user: adminUser, cookies: cookiesMock };
    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.project.delete.mockRejectedValueOnce(new Error("DB error during project delete"));

    const result: Response = await resolver.deleteProject(existingProject.id, context);

    expect(result).toEqual({ code: 500, message: "Internal server error" });

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.delete).toHaveBeenCalledTimes(1);
  });
});