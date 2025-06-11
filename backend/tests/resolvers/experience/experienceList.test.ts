import "reflect-metadata";
import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { ExperiencesResponse } from "../../../src/entities/response.types";
import { Experience as PrismaExperience } from "@prisma/client";

describe("ExperienceResolver - experienceList", () => {
  let resolver: ExperienceResolver;

  const mockExperiences: PrismaExperience[] = [
    {
      id: 1,
      jobFR: "Développeur Fullstack",
      jobEN: "Fullstack Developer",
      business: "AwesomeTech",
      employmentContractFR: "CDI",
      employmentContractEN: "Permanent Contract",
      startDateFR: "Mars 2022",
      startDateEN: "March 2022",
      endDateFR: "Présent",
      endDateEN: "Present",
      month: 27,
      typeFR: "À distance",
      typeEN: "Remote",
    },
    {
      id: 2,
      jobFR: "Développeur Front-end Junior",
      jobEN: "Junior Front-end Developer",
      business: "Startup Innov",
      employmentContractFR: "Stage",
      employmentContractEN: "Internship",
      startDateFR: "Septembre 2021",
      startDateEN: "September 2021",
      endDateFR: "Février 2022",
      endDateEN: "February 2022",
      month: 6,
      typeFR: "Sur site",
      typeEN: "On-site",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.experience.findMany.mockReset();
    resolver = new ExperienceResolver(prismaMock);
  });

  it("should return a list of experiences successfully", async () => {
    prismaMock.experience.findMany.mockResolvedValueOnce(mockExperiences);

    const result: ExperiencesResponse = await resolver.experienceList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experiences fetched");
    expect(result.experiences).toEqual(mockExperiences);

    expect(prismaMock.experience.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findMany).toHaveBeenCalledWith();
  });

  it("should return an empty list if no experiences are found", async () => {
    prismaMock.experience.findMany.mockResolvedValueOnce([]);

    const result: ExperiencesResponse = await resolver.experienceList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experiences fetched");
    expect(result.experiences).toEqual([]);

    expect(prismaMock.experience.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findMany).toHaveBeenCalledWith();
  });

  it("should return 500 if there is a database error", async () => {
    const errorMessage = "Database connection error during fetch";
    prismaMock.experience.findMany.mockRejectedValueOnce(new Error(errorMessage));

    const result: ExperiencesResponse = await resolver.experienceList();

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching experiences");
    expect(result.experiences).toBeUndefined();

    expect(prismaMock.experience.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findMany).toHaveBeenCalledWith();
  });
});