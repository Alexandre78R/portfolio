import "reflect-metadata";

import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { ExperienceResponse } from "../../../src/types/response.types";
import { Experience as PrismaExperience } from "@prisma/client";

describe("ExperienceResolver - getExperienceById", () => {
  
  let resolver: ExperienceResolver;

  const EXISTING_EXPERIENCE: Readonly<PrismaExperience> = {
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

  beforeEach((): void => {
    jest.clearAllMocks();

    prismaMock.experience.findUnique.mockReset();
    resolver = new ExperienceResolver(prismaMock);
  });

  it("should return an experience when the ID exists", async (): Promise<void> => {

    prismaMock.experience.findUnique.mockResolvedValueOnce(EXISTING_EXPERIENCE);

    const result: ExperienceResponse = await resolver.getExperienceById(
      EXISTING_EXPERIENCE.id
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experience fetched");
    expect(result.experience).toEqual(EXISTING_EXPERIENCE);

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({
      where: { id: EXISTING_EXPERIENCE.id },
    });
  });

  it("should return 404 when the experience does not exist", async (): Promise<void> => {

    const NON_EXISTENT_ID: number = 999;
    prismaMock.experience.findUnique.mockResolvedValueOnce(null);

    const result: ExperienceResponse = await resolver.getExperienceById(
      NON_EXISTENT_ID
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("Experience not found");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({
      where: { id: NON_EXISTENT_ID },
    });
  });

  it("should return 500 when the database throws an error", async (): Promise<void> => {

    prismaMock.experience.findUnique.mockRejectedValueOnce(
      new Error("Database query failed unexpectedly")
    );

    const result: ExperienceResponse = await resolver.getExperienceById(
      EXISTING_EXPERIENCE.id
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({
      where: { id: EXISTING_EXPERIENCE.id },
    });
  });
});