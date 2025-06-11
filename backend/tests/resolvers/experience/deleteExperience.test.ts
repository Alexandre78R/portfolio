import "reflect-metadata";
import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { ExperienceResponse } from "../../../src/entities/response.types";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("ExperienceResolver - deleteExperience", () => {
  let resolver: ExperienceResolver;

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

  const mockExistingExperience = {
    id: 1,
    jobFR: "Poste à Supprimer",
    jobEN: "Job to Delete",
    business: "Business to Delete",
    employmentContractFR: "CDI",
    employmentContractEN: "Permanent",
    startDateFR: "Janvier 2020",
    startDateEN: "January 2020",
    endDateFR: "Juin 2023",
    endDateEN: "June 2023",
    month: 42,
    typeFR: "Temps plein",
    typeEN: "Full-time",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.experience.findUnique.mockReset();
    prismaMock.experience.delete.mockReset();
    resolver = new ExperienceResolver(prismaMock);
    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully delete an experience record by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.experience.findUnique.mockResolvedValueOnce(mockExistingExperience);
    prismaMock.experience.delete.mockResolvedValueOnce(mockExistingExperience);

    const result: ExperienceResponse = await resolver.deleteExperience(mockExistingExperience.id, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experience deleted");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({ where: { id: mockExistingExperience.id } });
    expect(prismaMock.experience.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.delete).toHaveBeenCalledWith({ where: { id: mockExistingExperience.id } });
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    const result: ExperienceResponse = await resolver.deleteExperience(mockExistingExperience.id, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.experience.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result: ExperienceResponse = await resolver.deleteExperience(mockExistingExperience.id, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.experience.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if the experience record to delete is not found", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.experience.findUnique.mockResolvedValueOnce(null);

    const result: ExperienceResponse = await resolver.deleteExperience(999, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Experience not found");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(prismaMock.experience.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during finding the experience record", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during findUnique";
    prismaMock.experience.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: ExperienceResponse = await resolver.deleteExperience(mockExistingExperience.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during deleting the experience record", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during delete";

    prismaMock.experience.findUnique.mockResolvedValueOnce(mockExistingExperience);
    prismaMock.experience.delete.mockRejectedValueOnce(new Error(errorMessage));

    const result: ExperienceResponse = await resolver.deleteExperience(mockExistingExperience.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.delete).toHaveBeenCalledTimes(1);
  });
});