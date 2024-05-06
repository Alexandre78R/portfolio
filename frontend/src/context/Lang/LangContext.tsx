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
    
    const toggleTheme = (): void => {
        setTranslations(lang == "fr" ? fr : en);
        localStorage.setItem("lang", lang == "fr" ? "fr" : "en");
    };

    useEffect(() => {
        const checkLangLocalStorage = localStorage.getItem("lang");
        if (checkLangLocalStorage) {
            if(listLang.includes(checkLangLocalStorage)) {
                toggleTheme()
            } else {
                localStorage.setItem("lang", lang);
            }
        } else {
            localStorage.setItem("lang", lang);
        }
    }, [lang]);

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