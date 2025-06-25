import "reflect-metadata";
import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateExperienceInput } from "../../../src/entities/inputs/experience.input";
import { ExperienceResponse } from "../../../src/types/response.types";
import { Experience as PrismaExperience } from "@prisma/client";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("ExperienceResolver - createExperience", () => {
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

  const mockCreateExperienceInput: CreateExperienceInput = {
    jobFR: "Développeur Logiciel",
    jobEN: "Software Developer",
    business: "Tech Co",
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

  const mockCreatedExperience: PrismaExperience = {
    id: 1,
    ...mockCreateExperienceInput,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.experience.create.mockReset();
    resolver = new ExperienceResolver(prismaMock);
    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully create a new experience record by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.experience.create.mockResolvedValueOnce(mockCreatedExperience);

    const result: ExperienceResponse = await resolver.createExperience(mockCreateExperienceInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experience created");
    expect(result.experience).toEqual(mockCreatedExperience);

    expect(prismaMock.experience.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.create).toHaveBeenCalledWith({ data: mockCreateExperienceInput });
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    const result: ExperienceResponse = await resolver.createExperience(mockCreateExperienceInput, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.create).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result: ExperienceResponse = await resolver.createExperience(mockCreateExperienceInput, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.create).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during experience creation", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during experience creation";
    prismaMock.experience.create.mockRejectedValueOnce(new Error(errorMessage));

    const result: ExperienceResponse = await resolver.createExperience(mockCreateExperienceInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error creating experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.create).toHaveBeenCalledWith({ data: mockCreateExperienceInput });
  });
});