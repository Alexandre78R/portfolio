import "reflect-metadata";

import { PrismaClient, AboutMe as PrismaAboutMe } from "@prisma/client";
import { AboutMeResolver } from "../../../src/resolvers/aboutme.resolver";
import { AboutMeResponse } from "../../../src/types/response.types";
import { UpdateAboutMeInput } from "../../../src/entities/inputs/aboutme.input";
import { User, UserRole } from "../../../src/entities/user.entity";
import { MyContext } from "../../../src/index";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    aboutMe: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

describe("AboutMeResolver - updateAboutMe", () => {
  let resolver: AboutMeResolver;
  let mockDb: jest.Mocked<PrismaClient>;

  const mockAboutMe: PrismaAboutMe = {
    id: 1,
    titleEN: "About Me",
    titleFR: "À propos de moi",
    descriptionEN: "Old English description",
    descriptionFR: "Ancienne description en français",
  };

  const mockAdminUser: User = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@test.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const mockContext: MyContext = {
    user: mockAdminUser,
    req: {} as any,
    res: {} as any,
    cookies: {} as any,
    token: "valid_token",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = new PrismaClient() as jest.Mocked<PrismaClient>;
    resolver = new AboutMeResolver(mockDb);
  });

  it("Should update AboutMe with new descriptions", async () => {
    const updateData: UpdateAboutMeInput = {
      id: 1,
      titleEN: "New Title EN",
      titleFR: "Nouveau Titre FR",
      descriptionEN: "New English description",
      descriptionFR: "Nouvelle description en français",
    };

    const updatedAboutMe: PrismaAboutMe = {
      ...mockAboutMe,
      titleEN: updateData.titleEN ?? mockAboutMe.titleEN,
      titleFR: updateData.titleFR ?? mockAboutMe.titleFR,
      descriptionEN: updateData.descriptionEN ?? mockAboutMe.descriptionEN,
      descriptionFR: updateData.descriptionFR ?? mockAboutMe.descriptionFR,
    };

    (mockDb.aboutMe.findUnique as jest.Mock).mockResolvedValueOnce(mockAboutMe);
    (mockDb.aboutMe.update as jest.Mock).mockResolvedValueOnce(updatedAboutMe);

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      mockContext
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("AboutMe updated successfully");
    expect(result.aboutMe?.titleEN).toBe("New Title EN");
    expect(result.aboutMe?.titleFR).toBe("Nouveau Titre FR");
    expect(result.aboutMe?.descriptionEN).toBe("New English description");
    expect(result.aboutMe?.descriptionFR).toBe("Nouvelle description en français");
  });

  it("Should return 401 when no user authenticated", async () => {
    const updateData: UpdateAboutMeInput = {
      id: 1,
      descriptionEN: "New description",
    };

    const contextWithoutUser: MyContext = {
      ...mockContext,
      user: null,
    };

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      contextWithoutUser
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required");
  });

  it("Should return 403 when user is not admin", async () => {
    const updateData: UpdateAboutMeInput = {
      id: 1,
      descriptionEN: "New description",
    };

    const editorUser: User = {
      ...mockAdminUser,
      role: UserRole.editor,
    };

    const contextWithEditor: MyContext = {
      ...mockContext,
      user: editorUser,
    };

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      contextWithEditor
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Only admins can update AboutMe");
  });

  it("Should return 400 for invalid ID", async () => {
    const updateData: UpdateAboutMeInput = {
      id: -1,
      descriptionEN: "New description",
    };

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      mockContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid AboutMe ID");
  });

  it("Should return 400 for zero ID", async () => {
    const updateData: UpdateAboutMeInput = {
      id: 0,
      descriptionEN: "New description",
    };

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      mockContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid AboutMe ID");
  });

  it("Should return 404 when AboutMe not found", async () => {
    const updateData: UpdateAboutMeInput = {
      id: 999,
      descriptionEN: "New description",
    };

    (mockDb.aboutMe.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      mockContext
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("AboutMe with ID 999 not found");
  });

  it("Should update only English title if provided", async () => {
    const updateData: UpdateAboutMeInput = {
      id: 1,
      titleEN: "Updated Title EN",
    };

    const updatedAboutMe: PrismaAboutMe = {
      ...mockAboutMe,
      titleEN: updateData.titleEN ?? mockAboutMe.titleEN,
    };

    (mockDb.aboutMe.findUnique as jest.Mock).mockResolvedValueOnce(mockAboutMe);
    (mockDb.aboutMe.update as jest.Mock).mockResolvedValueOnce(updatedAboutMe);

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      mockContext
    );

    expect(result.code).toBe(200);
    expect(mockDb.aboutMe.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { titleEN: "Updated Title EN" },
      select: {
        id: true,
        titleEN: true,
        titleFR: true,
        descriptionEN: true,
        descriptionFR: true,
      },
    });
  });

  it("Should update only French title if provided", async () => {
    const updateData: UpdateAboutMeInput = {
      id: 1,
      titleFR: "Nouveau Titre FR",
    };

    const updatedAboutMe: PrismaAboutMe = {
      ...mockAboutMe,
      titleFR: updateData.titleFR ?? mockAboutMe.titleFR,
    };

    (mockDb.aboutMe.findUnique as jest.Mock).mockResolvedValueOnce(mockAboutMe);
    (mockDb.aboutMe.update as jest.Mock).mockResolvedValueOnce(updatedAboutMe);

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      mockContext
    );

    expect(result.code).toBe(200);
    expect(mockDb.aboutMe.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { titleFR: "Nouveau Titre FR" },
      select: {
        id: true,
        titleEN: true,
        titleFR: true,
        descriptionEN: true,
        descriptionFR: true,
      },
    });
  });

  it("Should handle database error", async () => {
    const updateData: UpdateAboutMeInput = {
      id: 1,
      descriptionEN: "New description",
    };

    const error: Error = new Error("Database error");
    (mockDb.aboutMe.findUnique as jest.Mock).mockRejectedValueOnce(error);

    const result: AboutMeResponse = await resolver.updateAboutMe(
      updateData,
      mockContext
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating AboutMe");
  });
});
