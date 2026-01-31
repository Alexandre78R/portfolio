import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback, Dispatch, SetStateAction } from "react";
import fr from "@/lang/fr";
import en from "@/lang/en";
import Lang from "@/lang/typeLang";
import { useQuery, ApolloError, DocumentNode, OperationVariables } from "@apollo/client";
import { GET_TRANSLATIONS } from "@/requetes/queries/translation.queries";
import type { GetTranslationsQuery, GetTranslationsQueryVariables } from "@/types/graphql";

/**
 * Valid language keys
 */
export type LangKey = "fr" | "en";

/**
 * Backend translation item interface
 */
interface TranslationFromBackend {
  readonly key: string;
  readonly value: string;
}

/**
 * Interface for LangContext value
 */
export interface LangContextType {
  readonly lang: LangKey;
  readonly setLang: (lang: LangKey) => void;
  readonly translations: Lang;
  readonly listLang: readonly LangKey[];
  readonly isLoadingTranslations: boolean;
}

/**
 * Interface for LangProvider props
 */
export interface LangProviderProps {
  readonly children: ReactNode;
}

/**
 * Create context with default values
 */
const LangContext: React.Context<LangContextType> = createContext<LangContextType>({
  lang: "fr",
  setLang: (): void => {},
  translations: fr,
  listLang: ["fr", "en"],
  isLoadingTranslations: false,
});

/**
 * Language Provider Component
 * @description Provides language context with backend translations fallback to local JSON
 * @param children - React children to wrap
 * @returns Provider component
 */
export const LangProvider: React.FC<LangProviderProps> = ({ children }): React.ReactElement => {
  const [lang, setLangState]: [LangKey, Dispatch<SetStateAction<LangKey>>] = useState<LangKey>("fr");
  const [translations, setTranslations]: [Lang, Dispatch<SetStateAction<Lang>>] = useState<Lang>(fr);
  const [isInitialized, setIsInitialized]: [boolean, Dispatch<SetStateAction<boolean>>] = useState<boolean>(false);

  const listLang: readonly LangKey[] = ["fr", "en"] as const;

  const { data: translationsData, loading: isLoadingTranslations, error: translationsError } = useQuery<
    GetTranslationsQuery,
    GetTranslationsQueryVariables
  >(GET_TRANSLATIONS as DocumentNode, {
    variables: { lang } as unknown as OperationVariables,
    skip: !isInitialized,
  });

  /**
   * Switch current language and update localStorage
   */
  const switchLang = useCallback(
    (newLang: LangKey): void => {
      setLangState(newLang);
      setTranslations(newLang === "fr" ? fr : en);
      try {
        localStorage.setItem("lang", newLang);
      } catch (err: unknown) {
        const errorMessage: string = err instanceof Error ? err.message : "Unknown error";
        console.warn("Failed to save language to localStorage:", errorMessage);
      }
    },
    []
  );

  /**
   * Load language from localStorage on mount
   */
  useEffect((): void => {
    if (!isInitialized) {
      try {
        const localLang = localStorage.getItem("lang") as LangKey | null;
        const initialLang: LangKey = localLang && listLang.includes(localLang) ? localLang : "fr";
        switchLang(initialLang);
      } catch (err: unknown) {
        const errorMessage: string = err instanceof Error ? err.message : "Unknown error";
        console.warn("Failed to load language from localStorage:", errorMessage);
        switchLang("fr");
      }
      setIsInitialized(true);
    }
  }, [isInitialized, switchLang, listLang]);

  /**
   * Update translations when backend data arrives
   */
  useEffect((): void => {
    if (translationsData?.getTranslations && Array.isArray(translationsData.getTranslations) && translationsData.getTranslations.length > 0) {
      try {
        const backendTranslations: Record<string, string> = translationsData.getTranslations.reduce<Record<string, string>>(
          (acc: Record<string, string>, item: TranslationFromBackend): Record<string, string> => {
            acc[item.key] = item.value;
            return acc;
          },
          {}
        );
        setTranslations(backendTranslations as Lang);
      } catch (err: unknown) {
        const errorMessage: string = err instanceof Error ? err.message : "Unknown error";
        console.warn("Failed to process backend translations:", errorMessage);
        setTranslations(lang === "fr" ? fr : en);
      }
    } else if (!isLoadingTranslations && isInitialized && (translationsError || !translationsData?.getTranslations)) {
      setTranslations(lang === "fr" ? fr : en);
    }
  }, [translationsData, isLoadingTranslations, translationsError, isInitialized, lang]);

  /**
   * Memoized context value
   */
  const value: LangContextType = useMemo<LangContextType>(
    (): LangContextType => ({
      lang,
      setLang: switchLang,
      translations,
      listLang,
      isLoadingTranslations,
    }),
    [lang, translations, isLoadingTranslations, switchLang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

/**
 * Hook to use language context
 * @description Get language context with translations
 * @returns LangContextType
 * @throws Error if used outside LangProvider
 */
export const useLang = (): LangContextType => {
  const context: LangContextType = useContext<LangContextType>(LangContext);
  
  if (!context) {
    throw new Error("useLang must be used within LangProvider");
  }
  
  return context;
};