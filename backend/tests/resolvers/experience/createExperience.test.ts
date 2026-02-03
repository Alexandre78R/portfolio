import "reflect-metadata";

import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateExperienceInput } from "../../../src/entities/inputs/experience.input";
import { ExperienceResponse } from "../../../src/types/response.types";
import { Experience as PrismaExperience } from "@prisma/client";
import Cookies from "cookies";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

describe("ExperienceResolver - createExperience", () => {
  
  let resolver: ExperienceResolver;
  let cookiesMock: DeepMockProxy<Cookies>;

  const ADMIN_USER: Readonly<User> = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const REGULAR_USER: Readonly<User> = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "regular@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  const createBaseContext = (): MyContext => ({
    req: {} as MyContext["req"],
    res: {} as MyContext["res"],
    cookies: cookiesMock,
    user: null,
    apiKey: undefined,
    token: undefined,
  });

  const CREATE_EXPERIENCE_INPUT: Readonly<CreateExperienceInput> = {
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

  const CREATED_EXPERIENCE: PrismaExperience = {
    id: 1,
    ...CREATE_EXPERIENCE_INPUT,
  };

  beforeEach((): void => {
    jest.clearAllMocks();

    cookiesMock = mockDeep<Cookies>();
    resolver = new ExperienceResolver(prismaMock);

    prismaMock.experience.create.mockReset();
  });

  it("should successfully create an experience when user is admin", async (): Promise<void> => {

    const context: MyContext = {
      ...createBaseContext(),
      user: ADMIN_USER,
    };

    prismaMock.experience.create.mockResolvedValueOnce(CREATED_EXPERIENCE);

    const result: ExperienceResponse = await resolver.createExperience(
      CREATE_EXPERIENCE_INPUT,
      context
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experience created");
    expect(result.experience).toEqual(CREATED_EXPERIENCE);

    expect(prismaMock.experience.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.create).toHaveBeenCalledWith({
      data: CREATE_EXPERIENCE_INPUT,
    });
  });

  it("should return 401 when user is not authenticated", async (): Promise<void> => {

    const context: MyContext = createBaseContext();

    const result: ExperienceResponse = await resolver.createExperience(
      CREATE_EXPERIENCE_INPUT,
      context
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.create).not.toHaveBeenCalled();
  });

  it("should return 403 when user is authenticated but not admin", async (): Promise<void> => {

    const context: MyContext = {
      ...createBaseContext(),
      user: REGULAR_USER,
    };

    const result: ExperienceResponse = await resolver.createExperience(
      CREATE_EXPERIENCE_INPUT,
      context
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.create).not.toHaveBeenCalled();
  });

  it("should return 500 when database throws an error", async (): Promise<void> => {

    const context: MyContext = {
      ...createBaseContext(),
      user: ADMIN_USER,
    };

    prismaMock.experience.create.mockRejectedValueOnce(
      new Error("Database error")
    );

    const result: ExperienceResponse = await resolver.createExperience(
      CREATE_EXPERIENCE_INPUT,
      context
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error creating experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.create).toHaveBeenCalledTimes(1);
  });
});