import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import fr from "@/lang/fr";
import en from "@/lang/en";
import Lang from "@/lang/typeLang";

export type LangKey = "fr" | "en";

export interface LangContextType {
  lang: LangKey;
  setLang: (lang: LangKey) => void;
  translations: Lang;
  listLang: LangKey[];
}

export interface LangProviderProps {
  children: ReactNode;
}

const LangContext = createContext<LangContextType>({
  lang: "fr",
  setLang: () => {},
  translations: fr,
  listLang: ["fr", "en"],
});

export const LangProvider: React.FC<LangProviderProps> = ({ children }) => {
  const [lang, setLang] = useState<LangKey>("fr");
  const [translations, setTranslations] = useState<Lang>(fr);
  const listLang: LangKey[] = ["fr", "en"];
  const [checkLang, setCheckLang] = useState(false);

  const switchLang = (newLang: LangKey) => {
    setLang(newLang);
    setTranslations(newLang === "fr" ? fr : en);
    localStorage.setItem("lang", newLang);
  };

  useEffect(() => {
    const localLang = localStorage.getItem("lang") as LangKey | null;
    if (localLang && !checkLang) {
      switchLang(listLang.includes(localLang) ? localLang : lang);
      setCheckLang(true);
    } else {
      switchLang(lang);
    }
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, translations, listLang }), [lang, translations]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = (): LangContextType => useContext(LangContext);