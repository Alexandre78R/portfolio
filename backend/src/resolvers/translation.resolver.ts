import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { TranslationsPaginationResponse, TranslationsResponse } from "../types/response.types";
import { MyContext } from "..";
import { UserRole } from "../entities/user.entity";
import * as path from "path";
import * as fs from "fs";

interface CachedTranslations {
  [lang: string]: Record<string, string>;
}

interface TranslationEntry {
  key: string;
  lang: string;
  value: string;
}

const translationsCache: CachedTranslations = {};

export const clearTranslationsCache : () => void = (): void => {
  Object.keys(translationsCache).forEach((key) => {
    delete translationsCache[key];
  });
};

const loadTranslations: (lang: string) => Record<string, string> = (lang: string): Record<string, string> => {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    const filePath: string = path.join(__dirname, `../../translations/${lang}.json`);
    const fileContent: string = fs.readFileSync(filePath, "utf-8");
    const translations: Record<string, string> = JSON.parse(fileContent) as Record<string, string>;
    translationsCache[lang] = translations;
    return translations;
  } catch (error: unknown) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {};
  }
};

@Resolver()
export class TranslationResolver {
  @Query(() => TranslationsResponse)
  async getTranslations(
    @Arg("lang", { defaultValue: "fr" }) lang: string
  ): Promise<TranslationsResponse> {
    try {
      const translations: Record<string, string> = loadTranslations(lang);

      if (!translations || Object.keys(translations).length === 0) {
        return {
          code: 404,
          success: false,
          message: `No translations found for language: ${lang}`,
          translations: [],
        };
      }

      return {
        code: 200,
        success: true,
        message: "Translations retrieved successfully",
        translations: Object.entries(translations).map(([key, value]) => ({ key, value })),
      };
    } catch (error: unknown) {
      console.error("Error fetching translations:", error);
      return {
        code: 500,
        success: false,
        message: "Internal server error",
        translations: [],
      };
    }
  }

  @Query(() => TranslationsPaginationResponse)
  @Authorized([UserRole.admin])
  async listTranslationsPaginated(
    @Arg("page", { defaultValue: 1 }) page: number,
    @Arg("limit", { defaultValue: 20 }) limit: number,
    @Arg("lang", () => String, { nullable: true }) lang: string | null,
    @Arg("searchTerm", () => String, { nullable: true }) searchTerm: string | null,
    @Ctx() ctx: MyContext
  ): Promise<TranslationsPaginationResponse> {
    try {
      const safePage: number = page < 1 ? 1 : page;
      const safeLimit: number = limit < 1 ? 1 : Math.min(limit, 100);
      const skip: number = (safePage - 1) * safeLimit;

      const languageFilter: string[] = lang ? [lang] : ["fr", "en"];
      let allTranslations: TranslationEntry[] = [];

      for (const targetLang of languageFilter) {
        const translations: Record<string, string> = loadTranslations(targetLang);
        for (const [key, value] of Object.entries(translations)) {
          allTranslations.push({ key, lang: targetLang, value });
        }
      }

      if (searchTerm && searchTerm.trim() !== "") {
        const lowerSearchTerm: string = searchTerm.toLowerCase();
        allTranslations = allTranslations.filter(
          (translation: TranslationEntry) =>
            translation.key.toLowerCase().includes(lowerSearchTerm) ||
            translation.value.toLowerCase().includes(lowerSearchTerm)
        );
      }

      const total: number = allTranslations.length;
      const paginatedTranslations: TranslationEntry[] = allTranslations.slice(skip, skip + safeLimit);

      return {
        code: 200,
        success: true,
        message: "Translations retrieved successfully",
        translations: paginatedTranslations as unknown as any[],
        total,
        page: safePage,
        limit: safeLimit,
      };
    } catch (error: unknown) {
      console.error("Error fetching paginated translations:", error);
      return {
        code: 500,
        success: false,
        message: "Internal server error",
        translations: [] as unknown as any[],
        total: 0,
        page: 1,
        limit: 0,
      };
    }
  }

  @Mutation(() => TranslationsResponse)
  @Authorized([UserRole.admin])
  async upsertTranslation(
    @Arg("key") key: string,
    @Arg("lang", { defaultValue: "fr" }) lang: string,
    @Arg("value") value: string,
    @Ctx() ctx: MyContext
  ): Promise<TranslationsResponse> {
    try {
      if (!key || key.trim() === "") {
        return {
          code: 400,
          success: false,
          message: "Key cannot be empty",
          translations: [],
        };
      }

      if (!value || value.trim() === "") {
        return {
          code: 400,
          success: false,
          message: "Value cannot be empty",
          translations: [],
        };
      }

      const translations: Record<string, string> = loadTranslations(lang);

      if (!translations.hasOwnProperty(key)) {
        return {
          code: 404,
          success: false,
          message: `Translation key '${key}' does not exist. Cannot modify non-existent key.`,
          translations: [],
        };
      }

      translations[key] = value;

      const filePath: string = path.join(__dirname, `../../translations/${lang}.json`);
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), "utf-8");

      translationsCache[lang] = translations;

      return {
        code: 200,
        success: true,
        message: `Translation for key '${key}' updated successfully`,
        translations: [{ key, value }],
      };
    } catch (error: unknown) {
      console.error("Error updating translation:", error);
      return {
        code: 500,
        success: false,
        message: "Internal server error",
        translations: [],
      };
    }
  }

  //not use for next version upload create translation
  @Mutation(() => TranslationsResponse)
  @Authorized([UserRole.admin])
  async createTranslation(
    @Arg("key") key: string,
    @Arg("lang", { defaultValue: "fr" }) lang: string,
    @Arg("value") value: string,
    @Ctx() ctx: MyContext
  ): Promise<TranslationsResponse> {
    try {
      if (!key || key.trim() === "") {
        return {
          code: 400,
          success: false,
          message: "Key cannot be empty",
          translations: [],
        };
      }

      if (!value || value.trim() === "") {
        return {
          code: 400,
          success: false,
          message: "Value cannot be empty",
          translations: [],
        };
      }

      const translations: Record<string, string> = loadTranslations(lang);

      // Vérifier si la clé existe déjà
      if (translations.hasOwnProperty(key)) {
        return {
          code: 409,
          success: false,
          message: `Translation key '${key}' already exists. Use update instead.`,
          translations: [],
        };
      }
      
      translations[key] = value;

      const filePath: string = path.join(__dirname, `../../translations/${lang}.json`);
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), "utf-8");

      translationsCache[lang] = translations;

      return {
        code: 201,
        success: true,
        message: `Translation key '${key}' created successfully`,
        translations: [{ key, value }],
      };
    } catch (error: unknown) {
      console.error("Error creating translation:", error);
      return {
        code: 500,
        success: false,
        message: "Internal server error",
        translations: [],
      };
    }
  }
  //not use for next version upload delete translation
  @Mutation(() => TranslationsResponse)
  @Authorized([UserRole.admin])
  async deleteTranslation(
    @Arg("key") key: string,
    @Arg("lang", { defaultValue: "fr" }) lang: string,
    @Ctx() ctx: MyContext
  ): Promise<TranslationsResponse> {
    try {
      if (!key || key.trim() === "") {
        return {
          code: 400,
          success: false,
          message: "Key cannot be empty",
          translations: [],
        };
      }

      const translations: Record<string, string> = loadTranslations(lang);

      // Vérifier si la clé existe
      if (!translations.hasOwnProperty(key)) {
        return {
          code: 404,
          success: false,
          message: `Translation key '${key}' does not exist. Cannot delete non-existent key.`,
          translations: [],
        };
      }

      const deletedValue: string = translations[key];
      delete translations[key];

      const filePath: string = path.join(__dirname, `../../translations/${lang}.json`);
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), "utf-8");

      translationsCache[lang] = translations;

      return {
        code: 200,
        success: true,
        message: `Translation key '${key}' deleted successfully`,
        translations: [{ key, value: deletedValue }],
      };
    } catch (error: unknown) {
      console.error("Error deleting translation:", error);
      return {
        code: 500,
        success: false,
        message: "Internal server error",
        translations: [],
      };
    }
  }
}
