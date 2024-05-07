import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import fr from "@/lang/fr.json"
import en from "@/lang/en.json"

type LangContextType = {
  lang: string;
  setLang: (lang: string) => void;
  translations: { [key: string]: string };
};

interface LangProviderProps {
    children: ReactNode;
  }

const LangContext = createContext<LangContextType>({
  lang: 'fr',
  setLang: () => {},
  translations: {},
});

export const LangProvider: React.FC<LangProviderProps> = ({ children }) => {
    const [lang, setLang] = useState('fr');
    const [translations, setTranslations] = useState<{ [key: string]: string }>(fr);
    const [listLang, setListLang] = useState<string[]>(["fr", "en"])
    const [checkLang, setCheckLang] = useState<boolean>(false) 

    const toggleTheme = (newLang : string): void => {
        setLang(newLang == "fr" ? "fr" : "en");
        setTranslations(newLang == "fr" ? fr : en);
        localStorage.setItem("lang", newLang == "fr" ? "fr" : "en");
    };

    useEffect(() => {
        const checkLangLocalStorage = localStorage.getItem("lang");
        if (checkLangLocalStorage && !checkLang) {
            if (listLang.includes(checkLangLocalStorage)) {
                toggleTheme(checkLangLocalStorage)
            } else {
                toggleTheme(lang)
            }
            setCheckLang(true)
        } else {
            toggleTheme(lang)
        }
    }, [lang])

    const value = useMemo(() => ({
      lang,
      setLang,
      translations,
    }), [lang, translations]);

    return (
        <LangContext.Provider value={value}>
        {children}
        </LangContext.Provider>
    );
};

export const useLang = () => useContext(LangContext);