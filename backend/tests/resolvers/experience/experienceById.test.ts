import "reflect-metadata";
import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { ExperienceResponse } from "../../../src/entities/response.types";
import { Experience as PrismaExperience } from "@prisma/client";

describe("ExperienceResolver - experienceById", () => {
  let resolver: ExperienceResolver;

  const mockExperience: PrismaExperience = {
    id: 1,
    jobFR: "Développeur Senior",
    jobEN: "Senior Developer",
    business: "Global Tech Solutions",
    employmentContractFR: "CDI",
    employmentContractEN: "Permanent",
    startDateFR: "Janvier 2018",
    startDateEN: "January 2018",
    endDateFR: "Décembre 2023",
    endDateEN: "December 2023",
    month: 72,
    typeFR: "Temps plein",
    typeEN: "Full-time",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.experience.findUnique.mockReset();
    resolver = new ExperienceResolver(prismaMock);
  });

  it("should return an experience record by ID successfully", async () => {
    prismaMock.experience.findUnique.mockResolvedValueOnce(mockExperience);

    const result: ExperienceResponse = await resolver.experienceById(mockExperience.id);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experience fetched");
    expect(result.experience).toEqual(mockExperience);

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({ where: { id: mockExperience.id } });
  });

  it("should return 404 if the experience record is not found", async () => {
    prismaMock.experience.findUnique.mockResolvedValueOnce(null);

    const result: ExperienceResponse = await resolver.experienceById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Experience not found");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
  });

  it("should return 500 for an internal server error", async () => {
    const errorMessage = "Database query failed unexpectedly";
    prismaMock.experience.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: ExperienceResponse = await resolver.experienceById(mockExperience.id);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({ where: { id: mockExperience.id } });
  });
});