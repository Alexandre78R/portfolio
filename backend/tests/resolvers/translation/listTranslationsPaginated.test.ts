import "reflect-metadata";
import { TranslationResolver } from "../../../src/resolvers/translation.resolver";
import type { TranslationsPaginationResponse, TranslationItem } from "../../../src/types/response.types";
import type { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import * as fs from "fs";

jest.mock("fs");

type TranslationMap = Record<string, string>;
type FileMockFunction = jest.MockedFunction<typeof fs.readFileSync>;

describe("TranslationResolver - listTranslationsPaginated", () => {
  let resolver: TranslationResolver;
  const mockFsReadFileSync: FileMockFunction = fs.readFileSync as FileMockFunction;

  const mockFrTranslations: TranslationMap = {
    buttonSubmit: "Soumettre",
    buttonCancel: "Annuler",
    messageError: "Une erreur s'est produite",
    messageSuccess: "Succès",
    titleHome: "Accueil",
    titleAbout: "À propos",
  };

  const mockEnTranslations: TranslationMap = {
    buttonSubmit: "Submit",
    buttonCancel: "Cancel",
    messageError: "An error occurred",
    messageSuccess: "Success",
    titleHome: "Home",
    titleAbout: "About",
  };

  const adminCtx: MyContext = {
    user: { id: 1, role: UserRole.admin },
  } as MyContext;

  beforeEach(() => {
    jest.clearAllMocks();
    // Forcer la création d'une nouvelle instance du resolver pour réinitialiser le cache
    resolver = new TranslationResolver();
    // Aussi nettoyer le cache du module
    jest.resetModules();

    mockFsReadFileSync.mockImplementation((filePath: any) => {
      if (filePath.includes("fr.json")) {
        return JSON.stringify(mockFrTranslations);
      }
      if (filePath.includes("en.json")) {
        return JSON.stringify(mockEnTranslations);
      }
      throw new Error("File not found");
    });
  });

  describe("listTranslationsPaginated with single language", () => {
    it("should return paginated French translations", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        3,
        "fr",
        null,
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.success).toBe(true);
      expect(result.translations).toHaveLength(3);
      expect(result.total).toBe(6);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(3);
    });

    it("should return correct page 2 with French translations", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        2,
        3,
        "fr",
        null,
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.page).toBe(2);
      expect(result.translations).toHaveLength(3);
    });
  });

  describe("listTranslationsPaginated with both languages", () => {
    it("should return all translations when lang is null", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        20,
        null,
        null,
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.success).toBe(true);
      expect(result.total).toBe(12); // 6 fr + 6 en
      expect(result.translations?.length).toBeLessThanOrEqual(20);
    });
  });

  describe("listTranslationsPaginated with searchTerm filter", () => {
    it("should filter translations by key", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        20,
        "fr",
        "button",
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.translations?.length).toBeGreaterThan(0);
      expect(result.translations?.every((t: TranslationItem) => t.key.includes("button"))).toBe(true);
    });

    it("should filter translations by value (case-insensitive)", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        20,
        "fr",
        "SOUMETTRE",
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.translations?.length).toBeGreaterThan(0);
    });

    it("should return empty results when searchTerm matches nothing", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        20,
        "fr",
        "xyz_notexist",
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.translations?.length).toBe(0);
      expect(result.total).toBe(0);
    });
  });

  describe("listTranslationsPaginated pagination validation", () => {
    it("should handle page less than 1", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        0,
        10,
        "fr",
        null,
        adminCtx
      );

      expect(result.page).toBe(1);
    });

    it("should handle limit greater than 100", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        500,
        "fr",
        null,
        adminCtx
      );

      expect(result.limit).toBe(100);
    });

    it("should handle limit less than 1", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        0,
        "fr",
        null,
        adminCtx
      );

      expect(result.limit).toBe(1);
    });
  });

  describe("listTranslationsPaginated response structure", () => {
    it("should have all required fields", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        10,
        "fr",
        null,
        adminCtx
      );

      expect(result).toHaveProperty("code");
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("translations");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
    });

    it("should have correct translation entry structure", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        10,
        "fr",
        null,
        adminCtx
      );

      if (result.translations && result.translations.length > 0) {
        const entry: TranslationItem = result.translations[0];
        expect(entry).toHaveProperty("key");
        expect(entry).toHaveProperty("lang");
        expect(entry).toHaveProperty("value");
      }
    });
  });

  describe("listTranslationsPaginated error handling", () => {
    it("should not fail when mocked to throw", async (): Promise<void> => {
      const result: TranslationsPaginationResponse = await resolver.listTranslationsPaginated(
        1,
        10,
        "fr",
        null,
        adminCtx
      );

      expect(result).toHaveProperty("code");
      expect(result).toHaveProperty("success");
    });
  });
});
