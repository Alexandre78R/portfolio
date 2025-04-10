import "reflect-metadata";
import { EducationResolver } from "../../../src/resolvers/education.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateEducationInput } from "../../../src/entities/inputs/education.input";
import { EducationResponse } from "../../../src/entities/response.types";
import { Education as PrismaEducation } from "@prisma/client";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("EducationResolver - updateEducation", () => {
  let resolver: EducationResolver;

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

  const mockExistingEducation: PrismaEducation = {
    id: 1,
    titleFR: "Ancien Titre FR",
    titleEN: "Old Title EN",
    diplomaLevelFR: "Ancien Niveau Diplôme FR",
    diplomaLevelEN: "Old Diploma Level EN",
    school: "Old School",
    location: "Old Location",
    year: 2020,
    startDateFR: "Janv 2018",
    startDateEN: "Jan 2018",
    endDateFR: "Juin 2020",
    endDateEN: "June 2020",
    month: 24,
    typeEN: "Old Type EN",
    typeFR: "Ancien Type FR",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.education.findUnique.mockReset();
    prismaMock.education.update.mockReset();
    resolver = new EducationResolver(prismaMock);
    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully update an education record by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const updateInput: UpdateEducationInput = {
      id: mockExistingEducation.id,
      titleEN: "Updated Title EN",
      school: "New School",
    };
    const mockUpdatedEducation: PrismaEducation = {
      ...mockExistingEducation,
      ...updateInput,
    };

    prismaMock.education.findUnique.mockResolvedValueOnce(mockExistingEducation);
    prismaMock.education.update.mockResolvedValueOnce(mockUpdatedEducation);

    const result: EducationResponse = await resolver.updateEducation(updateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Education updated");
    expect(result.education).toEqual(mockUpdatedEducation);

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findUnique).toHaveBeenCalledWith({ where: { id: updateInput.id } });
    expect(prismaMock.education.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.update).toHaveBeenCalledWith({
      where: { id: updateInput.id },
      data: {
        titleFR: mockExistingEducation.titleFR,
        titleEN: updateInput.titleEN,
        diplomaLevelEN: mockExistingEducation.diplomaLevelEN,
        diplomaLevelFR: mockExistingEducation.diplomaLevelFR,
        school: updateInput.school,
        location: mockExistingEducation.location,
        year: mockExistingEducation.year,
        startDateEN: mockExistingEducation.startDateEN,
        startDateFR: mockExistingEducation.startDateFR,
        endDateEN: mockExistingEducation.endDateEN,
        endDateFR: mockExistingEducation.endDateFR,
        month: mockExistingEducation.month,
        typeEN: mockExistingEducation.typeEN,
        typeFR: mockExistingEducation.typeFR,
      },
    });
  });

  it("should successfully update an education record by an editor user", async () => {
    const editorContext: MyContext = { ...baseMockContext, user: mockEditorUser };
    const updateInput: UpdateEducationInput = {
      id: mockExistingEducation.id,
      titleFR: "Titre Mis à Jour FR",
      location: "Nouvelle Localisation",
    };
    const mockUpdatedEducation: PrismaEducation = {
      ...mockExistingEducation,
      ...updateInput,
    };

    prismaMock.education.findUnique.mockResolvedValueOnce(mockExistingEducation);
    prismaMock.education.update.mockResolvedValueOnce(mockUpdatedEducation);

    const result: EducationResponse = await resolver.updateEducation(updateInput, editorContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Education updated");
    expect(result.education).toEqual(mockUpdatedEducation);

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.update).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };
    const updateInput: UpdateEducationInput = { id: 1, titleEN: "Test" };

    const result: EducationResponse = await resolver.updateEducation(updateInput, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.education.update).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin or editor", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };
    const updateInput: UpdateEducationInput = { id: 1, titleEN: "Test" };

    const result: EducationResponse = await resolver.updateEducation(updateInput, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin or Editor role required.");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.education.update).not.toHaveBeenCalled();
  });

  it("should return 404 if the education record is not found", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const updateInput: UpdateEducationInput = { id: 999, titleEN: "Non Existent" };

    prismaMock.education.findUnique.mockResolvedValueOnce(null);

    const result: EducationResponse = await resolver.updateEducation(updateInput, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Education not found");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.findUnique).toHaveBeenCalledWith({ where: { id: updateInput.id } });
    expect(prismaMock.education.update).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during finding the education record", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const updateInput: UpdateEducationInput = { id: mockExistingEducation.id, titleEN: "Test" };
    const errorMessage = "DB error during findUnique";

    prismaMock.education.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: EducationResponse = await resolver.updateEducation(updateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating education");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.update).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during updating the education record", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const updateInput: UpdateEducationInput = { id: mockExistingEducation.id, titleEN: "Test" };
    const errorMessage = "DB error during update";

    prismaMock.education.findUnique.mockResolvedValueOnce(mockExistingEducation);
    prismaMock.education.update.mockRejectedValueOnce(new Error(errorMessage));

    const result: EducationResponse = await resolver.updateEducation(updateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating education");
    expect(result.education).toBeUndefined();

    expect(prismaMock.education.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.update).toHaveBeenCalledTimes(1);
  });
});