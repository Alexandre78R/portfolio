import "reflect-metadata";

import { PrismaClient, AboutMe as PrismaAboutMe } from "@prisma/client";
import { AboutMeResolver } from "../../../src/resolvers/aboutme.resolver";
import { AboutMeResponse } from "../../../src/types/response.types";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    aboutMe: {
      findFirst: jest.fn(),
    },
  })),
}));

describe("AboutMeResolver - getAboutMe", () => {
  let resolver: AboutMeResolver;
  let mockDb: jest.Mocked<PrismaClient>;

  const mockAboutMe: PrismaAboutMe = {
    id: 1,
    titleEN: "About Me",
    titleFR: "À propos de moi",
    descriptionEN: "Hi, I'm a passionate developer with experience in fullstack development.",
    descriptionFR: "Bonjour, je suis un développeur passionné avec de l'expérience en développement fullstack.",
    isVisible: true,
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    mockDb = new PrismaClient() as jest.Mocked<PrismaClient>;
    resolver = new AboutMeResolver(mockDb);
  });

  it("Should return AboutMe data", async (): Promise<void> => {
    (mockDb.aboutMe.findFirst as jest.Mock).mockResolvedValueOnce(mockAboutMe);

    const result: AboutMeResponse = await resolver.getAboutMe();

    expect(result.code).toBe(200);
    expect(result.message).toBe("AboutMe fetched successfully");
    expect(result.aboutMe).toEqual(mockAboutMe);
    expect(mockDb.aboutMe.findFirst).toHaveBeenCalled();
  });

  it("Should return 404 when AboutMe not found", async (): Promise<void> => {
    (mockDb.aboutMe.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result: AboutMeResponse = await resolver.getAboutMe();

    expect(result.code).toBe(404);
    expect(result.message).toBe("AboutMe not found");
    expect(result.aboutMe).toBeUndefined();
  });

  it("Should handle database error", async (): Promise<void> => {
    const error: Error = new Error("Database connection failed");
    (mockDb.aboutMe.findFirst as jest.Mock).mockRejectedValueOnce(error);

    const result: AboutMeResponse = await resolver.getAboutMe();

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching AboutMe");
    expect(result.aboutMe).toBeUndefined();
  });

  it("Should return correct AboutMe with both languages", async (): Promise<void> => {
    const multiLanguageAboutMe: PrismaAboutMe = {
      id: 1,
      titleEN: "About Me",
      titleFR: "À propos de moi",
      descriptionEN: "I am a developer",
      descriptionFR: "Je suis un développeur",
      isVisible: true,
    };

    (mockDb.aboutMe.findFirst as jest.Mock).mockResolvedValueOnce(
      multiLanguageAboutMe
    );

    const result: AboutMeResponse = await resolver.getAboutMe();

    expect(result.code).toBe(200);
    expect(result.aboutMe?.titleEN).toBe("About Me");
    expect(result.aboutMe?.titleFR).toBe("À propos de moi");
    expect(result.aboutMe?.descriptionEN).toBe("I am a developer");
    expect(result.aboutMe?.descriptionFR).toBe("Je suis un développeur");
  });

  it("Should call findFirst without parameters", async (): Promise<void> => {
    (mockDb.aboutMe.findFirst as jest.Mock).mockResolvedValueOnce(mockAboutMe);

    await resolver.getAboutMe();

    expect(mockDb.aboutMe.findFirst).toHaveBeenCalledWith({
      where: { isVisible: true },
      select: {
        id: true,
        titleEN: true,
        titleFR: true,
        descriptionEN: true,
        descriptionFR: true,
        isVisible: true,
      },
    });
  });
});
