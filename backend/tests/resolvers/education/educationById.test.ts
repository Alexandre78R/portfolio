import "reflect-metadata";
import { EducationResolver } from "../../../src/resolvers/education.resolver";
import { prismaMock } from "../../singleton";
import { EducationResponse } from "../../../src/entities/response.types";
import { Education as PrismaEducation } from "@prisma/client";

describe("EducationResolver - educationById", () => {
  let resolver: EducationResolver;

  const mockEducation: PrismaEducation = {
    id: 1,
    titleFR: "Diplôme de l'École Supérieure",
    titleEN: "Higher School Degree",
    diplomaLevelFR: "Master 2",
    diplomaLevelEN: "Master's Degree",
    school: "SupInfo",
    location: "Paris, France",
    year: 2024,
    startDateFR: "Septembre 2019",
    startDateEN: "September 2019",
    endDateFR: "Juin 2024",
    endDateEN: "June 2024",
    month: 60,
    typeEN: "Engineering School",
    typeFR: "École d'Ingénieurs",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.education.findUnique.mockReset();
    resolver = new EducationResolver(prismaMock);
  });

  it("should return an education record by ID successfully", async () => {
    prismaMock.education.findUnique.mockResolvedValueOnce(mockEducation);

    const result: EducationResponse = await resolver.educationById(mockEducation.id);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Education fetched");
    expect(result.education).toEqual(mockEducation);

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findUnique).toHaveBeenCalledWith({ where: { id: mockEducation.id } });
  });

  it("should return 404 if the education record is not found", async () => {
    prismaMock.education.findUnique.mockResolvedValueOnce(null);

    const result: EducationResponse = await resolver.educationById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Education not found");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
  });

  it("should return 500 for an internal server error", async () => {
    const errorMessage = "Database query failed";
    prismaMock.education.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: EducationResponse = await resolver.educationById(mockEducation.id);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching education");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findUnique).toHaveBeenCalledWith({ where: { id: mockEducation.id } });
  });
});