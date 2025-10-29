import "reflect-metadata";
import { EducationResolver } from "../../../src/resolvers/education.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateEducationInput } from "../../../src/entities/inputs/education.input";
import { EducationResponse } from "../../../src/types/response.types";
import { Education as PrismaEducation } from "@prisma/client";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { Request, Response } from "express";

describe("EducationResolver - createEducation", () => {
  let resolver: EducationResolver;
  let mockCookies: DeepMockProxy<Cookies>;
  let mockReq: DeepMockProxy<Request>;
  let mockRes: DeepMockProxy<Response>;

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
    req: {} as Request,
    res: {} as Response,
    cookies: mockDeep<Cookies>(),
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const mockCreateEducationInput: CreateEducationInput = {
    titleFR: "Diplôme de Test FR",
    titleEN: "Test Degree EN",
    diplomaLevelFR: "Master FR",
    diplomaLevelEN: "Master EN",
    school: "Test University",
    location: "Test City",
    year: 2023,
    startDateFR: "Janvier 2020",
    startDateEN: "January 2020",
    endDateFR: "Juin 2023",
    endDateEN: "June 2023",
    month: 2,
    typeFR: "Université",
    typeEN: "University",
  };

  const mockCreatedEducation: PrismaEducation = {
    id: 1,
    ...mockCreateEducationInput,
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.education.create.mockReset();

    resolver = new EducationResolver(prismaMock);

    // Mocks complets pour Express
    mockReq = mockDeep<Request>();
    mockRes = mockDeep<Response>();
    mockCookies = mockDeep<Cookies>();

    baseMockContext.req = mockReq;
    baseMockContext.res = mockRes;
    baseMockContext.cookies = mockCookies;

    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully create a new education record by an admin user", async (): Promise<void> => {
    // Arrange
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.education.create.mockResolvedValueOnce(mockCreatedEducation);

    // Act
    const result: EducationResponse = await resolver.createEducation(
      mockCreateEducationInput,
      adminContext
    );

    // Assert
    expect(result.code).toBe(200);
    expect(result.message).toBe("Education created");
    expect(result.education).toEqual(mockCreatedEducation);

    expect(prismaMock.education.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.create).toHaveBeenCalledWith({
      data: mockCreateEducationInput,
    });
  });

  it("should return 401 if no user is authenticated", async (): Promise<void> => {
    // Arrange
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    // Act
    const result: EducationResponse = await resolver.createEducation(
      mockCreateEducationInput,
      unauthenticatedContext
    );

    // Assert
    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.create).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async (): Promise<void> => {
    // Arrange
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    // Act
    const result: EducationResponse = await resolver.createEducation(
      mockCreateEducationInput,
      regularUserContext
    );

    // Assert
    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.create).not.toHaveBeenCalled();
  });

  it("should return 500 if a database error occurs during education creation", async (): Promise<void> => {
    // Arrange
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const dbErrorMessage: string = "Database error during education creation";
    prismaMock.education.create.mockRejectedValueOnce(new Error(dbErrorMessage));

    // Act
    const result: EducationResponse = await resolver.createEducation(
      mockCreateEducationInput,
      adminContext
    );

    // Assert
    expect(result.code).toBe(500);
    expect(result.message).toBe("Error creating education");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.create).toHaveBeenCalledWith({
      data: mockCreateEducationInput,
    });
  });
});
