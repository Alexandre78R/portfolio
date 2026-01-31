import "reflect-metadata";
import { TranslationResolver } from "../../../src/resolvers/translation.resolver";
import type { TranslationsResponse, TranslationItem } from "../../../src/types/response.types";
import * as fs from "fs";

jest.mock("fs");

type TranslationMap = Record<string, string>;
type FileMockFunction = jest.MockedFunction<typeof fs.readFileSync>;

describe("TranslationResolver - getTranslations", () => {
  let resolver: TranslationResolver;
  const mockFsReadFileSync: FileMockFunction = fs.readFileSync as FileMockFunction;

  const mockFrTranslations: TranslationMap = {
    buttonSubmit: "Soumettre",
    buttonCancel: "Annuler",
    messageError: "Une erreur s'est produite",
    messageSuccess: "Succès",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resolver = new TranslationResolver();

    mockFsReadFileSync.mockImplementation((filePath: any) => {
      if (filePath.includes("fr.json")) {
        return JSON.stringify(mockFrTranslations);
      }
      throw new Error("File not found");
    });
  });

  describe("getTranslations", () => {
    it("should return French translations successfully", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.getTranslations("fr");

      expect(result.code).toBe(200);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Translations retrieved successfully");
      expect(Array.isArray(result.translations)).toBe(true);
      expect(result.translations).toHaveLength(4);
    });

    it("should have all required response fields", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.getTranslations("fr");

      expect(result).toHaveProperty("code");
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("translations");
    });

    it("should contain correct key-value pairs", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.getTranslations("fr");
      const translations: TranslationItem[] = result.translations || [];

      const submitEntry: TranslationItem | undefined = translations.find(
        (t: TranslationItem) => t.key === "buttonSubmit"
      );
      expect(submitEntry).toBeDefined();
      expect(submitEntry?.value).toBe("Soumettre");
    });
  });
});
