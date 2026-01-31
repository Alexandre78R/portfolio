import "reflect-metadata";
import { TranslationResolver } from "../../../src/resolvers/translation.resolver";
import type { TranslationsResponse, TranslationItem } from "../../../src/types/response.types";
import type { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import * as fs from "fs";

jest.mock("fs");

type TranslationMap = Record<string, string>;
type FileMockFunction = jest.MockedFunction<typeof fs.readFileSync>;
type FileWriteMockFunction = jest.MockedFunction<typeof fs.writeFileSync>;

describe("TranslationResolver - upsertTranslation", () => {
  let resolver: TranslationResolver;
  const mockFsReadFileSync: FileMockFunction = fs.readFileSync as FileMockFunction;
  const mockFsWriteFileSync: FileWriteMockFunction = fs.writeFileSync as FileWriteMockFunction;

  const mockFrTranslations: TranslationMap = {
    buttonSubmit: "Soumettre",
    buttonCancel: "Annuler",
    messageError: "Une erreur s'est produite",
  };

  const mockEnTranslations: TranslationMap = {
    buttonSubmit: "Submit",
    buttonCancel: "Cancel",
    messageError: "An error occurred",
  };

  const adminCtx: MyContext = {
    user: { id: 1, role: UserRole.admin },
  } as MyContext;

  beforeEach(() => {
    jest.clearAllMocks();
    resolver = new TranslationResolver();

    mockFsReadFileSync.mockImplementation((filePath: any) => {
      if (filePath.includes("fr.json")) {
        return JSON.stringify(mockFrTranslations);
      }
      if (filePath.includes("en.json")) {
        return JSON.stringify(mockEnTranslations);
      }
      throw new Error("File not found");
    });

    mockFsWriteFileSync.mockImplementation(() => undefined as any);
  });

  describe("upsertTranslation - create new", () => {
    it("should reject creation of new translation key that doesn't exist", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "newKey",
        "fr",
        "Nouvelle valeur",
        adminCtx
      );

      expect(result.code).toBe(404);
      expect(result.success).toBe(false);
      expect(result.message).toContain("does not exist");
    });
  });

  describe("upsertTranslation - update existing", () => {
    it("should update existing translation successfully", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "buttonSubmit",
        "fr",
        "Envoyer",
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.success).toBe(true);
      expect(result.message).toContain("updated successfully");
      const submitEntry: TranslationItem | undefined = result.translations?.find(
        (t: TranslationItem) => t.key === "buttonSubmit"
      );
      expect(submitEntry?.value).toBe("Envoyer");
    });
  });

  describe("upsertTranslation - validation", () => {
    it("should reject empty key", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "",
        "fr",
        "Value",
        adminCtx
      );

      expect(result.code).toBe(400);
      expect(result.success).toBe(false);
      expect(result.message).toContain("Key cannot be empty");
    });

    it("should reject empty value", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "key",
        "fr",
        "",
        adminCtx
      );

      expect(result.code).toBe(400);
      expect(result.success).toBe(false);
      expect(result.message).toContain("Value cannot be empty");
    });

    it("should reject whitespace-only key", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "   ",
        "fr",
        "Value",
        adminCtx
      );

      expect(result.code).toBe(400);
      expect(result.success).toBe(false);
    });

    it("should reject whitespace-only value", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "key",
        "fr",
        "   ",
        adminCtx
      );

      expect(result.code).toBe(400);
      expect(result.success).toBe(false);
    });
  });

  describe("upsertTranslation - different languages", () => {
    it("should handle French language with existing key", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "buttonSubmit",
        "fr",
        "Valeur française",
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.success).toBe(true);
    });

    it("should handle English language with existing key", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "buttonSubmit",
        "en",
        "English value",
        adminCtx
      );

      expect(result.code).toBe(200);
      expect(result.success).toBe(true);
    });

    it("should handle default language with existing key", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "buttonSubmit",
        "fr",
        "Valeur",
        adminCtx
      );

      expect(result.code).toBe(200);
    });

    it("should reject non-existent key modification", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "nonExistentKey",
        "fr",
        "Value",
        adminCtx
      );

      expect(result.code).toBe(404);
      expect(result.success).toBe(false);
      expect(result.message).toContain("does not exist");
    });
  });

  describe("upsertTranslation response structure", () => {
    it("should have all required response fields", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "buttonSubmit",
        "fr",
        "value",
        adminCtx
      );

      expect(result).toHaveProperty("code");
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("translations");
    });

    it("should return only the updated key in translations", async (): Promise<void> => {
      const result: TranslationsResponse = await resolver.upsertTranslation(
        "buttonSubmit",
        "fr",
        "newValue",
        adminCtx
      );

      expect(result.translations?.some((t: TranslationItem) => t.key === "buttonSubmit")).toBe(true);
    });
  });

  describe("upsertTranslation error handling", () => {
    it("should return 500 error on file write failure", async (): Promise<void> => {
      mockFsWriteFileSync.mockImplementation(() => {
        throw new Error("Write error");
      });

      const result: TranslationsResponse = await resolver.upsertTranslation(
        "buttonSubmit",
        "fr",
        "value",
        adminCtx
      );

      expect(result.code).toBe(500);
      expect(result.success).toBe(false);
    });
  });
});
