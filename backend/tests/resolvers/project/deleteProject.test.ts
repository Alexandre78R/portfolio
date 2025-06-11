import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { Response } from "../../../src/entities/response.types";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

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
  };

  const mockExistingProject = {
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

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project deleted successfully");

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({ where: { id: mockExistingProject.id } });
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({ where: { projectId: mockExistingProject.id } });
    expect(prismaMock.project.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.delete).toHaveBeenCalledWith({ where: { id: mockExistingProject.id } });
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    const result: Response = await resolver.deleteProject(mockExistingProject.id, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");

    expect(prismaMock.project.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result: Response = await resolver.deleteProject(mockExistingProject.id, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");

    expect(prismaMock.project.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if the project to delete is not found", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result: Response = await resolver.deleteProject(999, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Project not found");

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during project lookup", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during findUnique";
    prismaMock.project.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: Response = await resolver.deleteProject(mockExistingProject.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during projectSkill deletion", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during projectSkill deleteMany";

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error(errorMessage));

    const result: Response = await resolver.deleteProject(mockExistingProject.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during project deletion", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during project delete";

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.project.delete.mockRejectedValueOnce(new Error(errorMessage));

    const result: Response = await resolver.deleteProject(mockExistingProject.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.delete).toHaveBeenCalledTimes(1);
  });
});