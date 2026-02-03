import "reflect-metadata";

import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { ExperiencesResponse } from "../../../src/types/response.types";
import { Experience as PrismaExperience } from "@prisma/client";

describe("ExperienceResolver - listExperiences", () => {
  
  let resolver: ExperienceResolver;

  const EXPERIENCES_LIST: ReadonlyArray<PrismaExperience> = [
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

  beforeEach((): void => {
    jest.clearAllMocks();

    prismaMock.experience.findMany.mockReset();
    resolver = new ExperienceResolver(prismaMock);
  });

  it("should return all experiences when records exist", async (): Promise<void> => {
 
    prismaMock.experience.findMany.mockResolvedValueOnce(
      [...EXPERIENCES_LIST]
    );

    const result: ExperiencesResponse = await resolver.listExperiences();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experiences fetched");
    expect(result.experiences).toEqual(EXPERIENCES_LIST);

    expect(prismaMock.experience.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findMany).toHaveBeenCalledWith();
  });

  it("should return an empty list when no experiences exist", async (): Promise<void> => {

    prismaMock.experience.findMany.mockResolvedValueOnce([]);

    const result: ExperiencesResponse = await resolver.listExperiences();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experiences fetched");
    expect(result.experiences).toEqual([]);

    expect(prismaMock.experience.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findMany).toHaveBeenCalledWith();
  });

  it("should return 500 when the database throws an error", async (): Promise<void> => {

    prismaMock.experience.findMany.mockRejectedValueOnce(
      new Error("Database connection error during fetch")
    );

    const result: ExperiencesResponse = await resolver.listExperiences();

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching experiences");
    expect(result.experiences).toBeUndefined();

    expect(prismaMock.experience.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findMany).toHaveBeenCalledWith();
  });
});