import "reflect-metadata";
import { ExperienceResolver } from "../../../src/resolvers/experience.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateExperienceInput } from "../../../src/entities/inputs/experience.input";
import { ExperienceResponse } from "../../../src/types/response.types";
import { Experience as PrismaExperience } from "@prisma/client";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("ExperienceResolver - updateExperience", () => {
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

  const mockEditorUser: User = {
    id: 3,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    role: UserRole.editor,
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

  const mockExistingExperience: PrismaExperience = {
    id: 1,
    jobFR: "Ancien Poste FR",
    jobEN: "Old Job EN",
    business: "Ancienne Entreprise",
    employmentContractFR: "Ancien Contrat FR",
    employmentContractEN: "Old Contract EN",
    startDateFR: "Janvier 2020",
    startDateEN: "January 2020",
    endDateFR: "Juin 2023",
    endDateEN: "June 2023",
    month: 36,
    typeFR: "CDI",
    typeEN: "Full-time",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.experience.findUnique.mockReset();
    prismaMock.experience.update.mockReset();
    resolver = new ExperienceResolver(prismaMock);
    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully update an experience record by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const updateInput: UpdateExperienceInput = {
      id: mockExistingExperience.id,
      jobEN: "Updated Job EN",
      business: "New Business Inc.",
    };
    const mockUpdatedExperience: PrismaExperience = {
      ...mockExistingExperience,
      ...updateInput,
    };

    prismaMock.experience.findUnique.mockResolvedValueOnce(mockExistingExperience);
    prismaMock.experience.update.mockResolvedValueOnce(mockUpdatedExperience);

    const result: ExperienceResponse = await resolver.updateExperience(updateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experience updated");
    expect(result.experience).toEqual(mockUpdatedExperience);

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({ where: { id: updateInput.id } });
    expect(prismaMock.experience.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.update).toHaveBeenCalledWith({
      where: { id: updateInput.id },
      data: {
        jobEN: updateInput.jobEN,
        jobFR: mockExistingExperience.jobFR,
        business: updateInput.business,
        employmentContractEN: mockExistingExperience.employmentContractEN,
        employmentContractFR: mockExistingExperience.employmentContractFR,
        startDateEN: mockExistingExperience.startDateEN,
        startDateFR: mockExistingExperience.startDateFR,
        endDateEN: mockExistingExperience.endDateEN,
        endDateFR: mockExistingExperience.endDateFR,
        month: mockExistingExperience.month,
        typeEN: mockExistingExperience.typeEN,
        typeFR: mockExistingExperience.typeFR,
      },
    });
  });

  it("should successfully update an experience record by an editor user", async () => {
    const editorContext: MyContext = { ...baseMockContext, user: mockEditorUser };
    const updateInput: UpdateExperienceInput = {
      id: mockExistingExperience.id,
      jobFR: "Nouveau Poste FR",
      typeEN: "Part-time",
    };
    const mockUpdatedExperience: PrismaExperience = {
      ...mockExistingExperience,
      ...updateInput,
    };

    prismaMock.experience.findUnique.mockResolvedValueOnce(mockExistingExperience);
    prismaMock.experience.update.mockResolvedValueOnce(mockUpdatedExperience);

    const result: ExperienceResponse = await resolver.updateExperience(updateInput, editorContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Experience updated");
    expect(result.experience).toEqual(mockUpdatedExperience);

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.update).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };
    const updateInput: UpdateExperienceInput = { id: 1, jobEN: "Test" };

    const result: ExperienceResponse = await resolver.updateExperience(updateInput, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.experience.update).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin or editor", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };
    const updateInput: UpdateExperienceInput = { id: 1, jobEN: "Test" };

    const result: ExperienceResponse = await resolver.updateExperience(updateInput, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin or Editor role required.");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.experience.update).not.toHaveBeenCalled();
  });

  it("should return 404 if the experience record is not found", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const updateInput: UpdateExperienceInput = { id: 999, jobEN: "Non Existent" };

    prismaMock.experience.findUnique.mockResolvedValueOnce(null);

    const result: ExperienceResponse = await resolver.updateExperience(updateInput, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Experience not found");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.findUnique).toHaveBeenCalledWith({ where: { id: updateInput.id } });
    expect(prismaMock.experience.update).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during finding the experience record", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const updateInput: UpdateExperienceInput = { id: mockExistingExperience.id, jobEN: "Test" };
    const errorMessage = "DB error during findUnique";

    prismaMock.experience.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: ExperienceResponse = await resolver.updateExperience(updateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.update).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during updating the experience record", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const updateInput: UpdateExperienceInput = { id: mockExistingExperience.id, jobEN: "Test" };
    const errorMessage = "DB error during update";

    prismaMock.experience.findUnique.mockResolvedValueOnce(mockExistingExperience);
    prismaMock.experience.update.mockRejectedValueOnce(new Error(errorMessage));

    const result: ExperienceResponse = await resolver.updateExperience(updateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating experience");
    expect(result.experience).toBeUndefined();

    expect(prismaMock.experience.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.experience.update).toHaveBeenCalledTimes(1);
  });
});