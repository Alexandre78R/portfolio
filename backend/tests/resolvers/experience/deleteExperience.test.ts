import "reflect-metadata";

import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { ExperienceResponse } from "../../../src/types/response.types";
import { Experience as PrismaExperience } from "@prisma/client";
import Cookies from "cookies";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

describe("ExperienceResolver - deleteExperience", () => {
  
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

  const EXISTING_EXPERIENCE: Readonly<PrismaExperience> = {
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

  beforeEach((): void => {
    jest.clearAllMocks();

    cookiesMock = mockDeep<Cookies>();
    resolver = new ExperienceResolver(prismaMock);

    prismaMock.experience.findUnique.mockReset();
    prismaMock.experience.delete.mockReset();
  });

  it("should successfully delete an experience when user is admin", async (): Promise<void> => {

    const context: MyContext = {
      ...createBaseContext(),
      user: ADMIN_USER,
    };

    prismaMock.experience.findUnique.mockResolvedValueOnce(EXISTING_EXPERIENCE);
    prismaMock.experience.delete.mockResolvedValueOnce(EXISTING_EXPERIENCE);

    const result: ExperienceResponse = await resolver.deleteExperience(
      EXISTING_EXPERIENCE.id,
      context
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experience deleted");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({
      where: { id: EXISTING_EXPERIENCE.id },
    });

    expect(prismaMock.experience.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.delete).toHaveBeenCalledWith({
      where: { id: EXISTING_EXPERIENCE.id },
    });
  });

  it("should return 401 when user is not authenticated", async (): Promise<void> => {

    const context: MyContext = createBaseContext();

    const result: ExperienceResponse = await resolver.deleteExperience(
      EXISTING_EXPERIENCE.id,
      context
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.experience.delete).not.toHaveBeenCalled();
  });

  it("should return 403 when user is authenticated but not admin", async (): Promise<void> => {

    const context: MyContext = {
      ...createBaseContext(),
      user: REGULAR_USER,
    };

    const result: ExperienceResponse = await resolver.deleteExperience(
      EXISTING_EXPERIENCE.id,
      context
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.experience.delete).not.toHaveBeenCalled();
  });

  it("should return 404 when experience does not exist", async (): Promise<void> => {

    const context: MyContext = {
      ...createBaseContext(),
      user: ADMIN_USER,
    };

    prismaMock.experience.findUnique.mockResolvedValueOnce(null);

    const result: ExperienceResponse = await resolver.deleteExperience(
      999,
      context
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("Experience not found");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.delete).not.toHaveBeenCalled();
  });

  it("should return 500 when database throws an error during lookup", async (): Promise<void> => {

    const context: MyContext = {
      ...createBaseContext(),
      user: ADMIN_USER,
    };

    prismaMock.experience.findUnique.mockRejectedValueOnce(
      new Error("Database find error")
    );

    const result: ExperienceResponse = await resolver.deleteExperience(
      EXISTING_EXPERIENCE.id,
      context
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.delete).not.toHaveBeenCalled();
  });

  it("should return 500 when database throws an error during deletion", async (): Promise<void> => {
    const context: MyContext = {
      ...createBaseContext(),
      user: ADMIN_USER,
    };

    prismaMock.experience.findUnique.mockResolvedValueOnce(EXISTING_EXPERIENCE);
    prismaMock.experience.delete.mockRejectedValueOnce(
      new Error("Database delete error")
    );

    const result: ExperienceResponse = await resolver.deleteExperience(
      EXISTING_EXPERIENCE.id,
      context
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.delete).toHaveBeenCalledTimes(1);
  });
});