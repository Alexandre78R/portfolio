import "reflect-metadata";
import { EducationResolver } from "../../../src/resolvers/education.resolver";
import { prismaMock } from "../../singleton";
import { EducationsResponse } from "../../../src/entities/response.types";
import { Education as PrismaEducation } from "@prisma/client";

describe("EducationResolver - educationList", () => {
  let resolver: EducationResolver;

  const mockEducations: PrismaEducation[] = [
    {
      id: 1,
      titleFR: "Diplôme A",
      titleEN: "Degree A",
      diplomaLevelFR: "Licence",
      diplomaLevelEN: "Bachelor",
      school: "University A",
      location: "City A",
      year: 2020,
      startDateFR: "Sept 2017",
      startDateEN: "Sep 2017",
      endDateFR: "Juin 2020",
      endDateEN: "Jun 2020",
      month: 36,
      typeEN: "University",
      typeFR: "Université",
    },
    {
      id: 2,
      titleFR: "Diplôme B",
      titleEN: "Degree B",
      diplomaLevelFR: "Master",
      diplomaLevelEN: "Master",
      school: "University B",
      location: "City B",
      year: 2022,
      startDateFR: "Sept 2020",
      startDateEN: "Sep 2020",
      endDateFR: "Juin 2022",
      endDateEN: "Jun 2022",
      month: 24,
      typeEN: "University",
      typeFR: "Université",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.education.findMany.mockReset();
    resolver = new EducationResolver(prismaMock);
  });

  it("should return a list of educations successfully", async () => {
    prismaMock.education.findMany.mockResolvedValueOnce(mockEducations);

    const result: EducationsResponse = await resolver.educationList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Educations fetched");
    expect(result.educations).toEqual(mockEducations);

    expect(prismaMock.education.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findMany).toHaveBeenCalledWith();
  });

  it("should return an empty list if no educations are found", async () => {
    prismaMock.education.findMany.mockResolvedValueOnce([]);

    const result: EducationsResponse = await resolver.educationList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Educations fetched");
    expect(result.educations).toEqual([]);

    expect(prismaMock.education.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findMany).toHaveBeenCalledWith();
  });

  it("should return 500 if there is a database error", async () => {
    const errorMessage = "Database connection error";
    prismaMock.education.findMany.mockRejectedValueOnce(new Error(errorMessage));

    const result: EducationsResponse = await resolver.educationList();

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching educations");
    expect(result.educations).toBeUndefined();

    expect(prismaMock.education.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findMany).toHaveBeenCalledWith();
  });
});