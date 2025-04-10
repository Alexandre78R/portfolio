import "reflect-metadata";
import { EducationResolver } from "../../../src/resolvers/education.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { EducationResponse } from "../../../src/entities/response.types";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("EducationResolver - deleteEducation", () => {
  let resolver: EducationResolver;

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

  const mockExistingEducation = {
    id: 1,
    titleFR: "Diplôme à Supprimer",
    titleEN: "Degree to Delete",
    diplomaLevelFR: "Master",
    diplomaLevelEN: "Master",
    school: "University",
    location: "City",
    year: 2020,
    startDateFR: "Jan 2018",
    startDateEN: "Jan 2018",
    endDateFR: "Juin 2020",
    endDateEN: "June 2020",
    month: 12,
    typeEN: "University",
    typeFR: "Université",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.education.findUnique.mockReset();
    prismaMock.education.delete.mockReset();
    resolver = new EducationResolver(prismaMock);
    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully delete an education record by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.education.findUnique.mockResolvedValueOnce(mockExistingEducation);
    prismaMock.education.delete.mockResolvedValueOnce(mockExistingEducation);

    const result: EducationResponse = await resolver.deleteEducation(mockExistingEducation.id, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Education deleted");
    expect(result.education).toBeUndefined(); // Assuming delete operation doesn't return the deleted entity in the response

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findUnique).toHaveBeenCalledWith({ where: { id: mockExistingEducation.id } });
    expect(prismaMock.education.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.delete).toHaveBeenCalledWith({ where: { id: mockExistingEducation.id } });
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    const result: EducationResponse = await resolver.deleteEducation(mockExistingEducation.id, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.education.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result: EducationResponse = await resolver.deleteEducation(mockExistingEducation.id, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.education.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if the education record to delete is not found", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.education.findUnique.mockResolvedValueOnce(null);

    const result: EducationResponse = await resolver.deleteEducation(999, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Education not found");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(prismaMock.education.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during finding the education record", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during findUnique";
    prismaMock.education.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: EducationResponse = await resolver.deleteEducation(mockExistingEducation.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting education");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during deleting the education record", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during delete";

    prismaMock.education.findUnique.mockResolvedValueOnce(mockExistingEducation);
    prismaMock.education.delete.mockRejectedValueOnce(new Error(errorMessage));

    const result: EducationResponse = await resolver.deleteEducation(mockExistingEducation.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting education");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.delete).toHaveBeenCalledTimes(1);
  });
});