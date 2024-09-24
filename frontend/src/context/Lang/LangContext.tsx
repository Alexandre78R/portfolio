import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import fr from "@/lang/fr";
import en from "@/lang/en";
import Lang from "@/lang/typeLang";

type LangContextType = {
  lang: string;
  setLang: (lang: string) => void;
  translations: Lang | { [key: string]: string };
  listLang: any[];
};

interface LangProviderProps {
  children: ReactNode;
}

const LangContext = createContext<LangContextType>({
  lang: "fr",
  setLang: () => {},
  translations: {},
  listLang: ["fr", "en"],
});

export const LangProvider: React.FC<LangProviderProps> = ({
  children,
}): React.ReactElement => {
  const [lang, setLang]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("fr");
  const [translations, setTranslations]: [
    { [key: string]: string },
    React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  ] = useState<{ [key: string]: string }>(fr);
  const [listLang, _]: [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ] = useState<string[]>(["fr", "en"]);
  const [checkLang, setCheckLang]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const toggleTheme = (newLang: string): void => {
    setLang(newLang == "fr" ? "fr" : "en");
    setTranslations(newLang == "fr" ? fr : en);
    localStorage.setItem("lang", newLang == "fr" ? "fr" : "en");
  };

  useEffect(() => {
    const checkLangLocalStorage: string | null = localStorage.getItem("lang");
    if (checkLangLocalStorage && !checkLang) {
      if (listLang.includes(checkLangLocalStorage)) {
        toggleTheme(checkLangLocalStorage);
      } else {
        toggleTheme(lang);
      }
      setCheckLang(true);
    } else {
      toggleTheme(lang);
    }
  }, [lang]);

  const value: LangContextType = useMemo(
    () => ({
      lang,
      setLang,
      translations,
      listLang,
    }),
    [lang, translations, listLang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = (): LangContextType => useContext(LangContext);
