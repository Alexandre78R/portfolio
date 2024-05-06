import { Inter } from "next/font/google";
import { ThemeProvider, useTheme } from "@/context/Theme/ThemeContext";
import { useLang } from "@/context/Lang/LangContext";


export default function Home() {
  const { toggleTheme } = useTheme();
  const { toggleLang, translations } = useLang();

  return (
    <main>
      <p className={`text-text`}>{translations?.welcome}</p>
      <div>
        <button onClick={() => toggleTheme("dark")} className={`bg-primary`} ><p className={`text-text`}>{translations?.theme1}</p></button>
        <button onClick={() => toggleTheme("light")} className={`bg-primary`} ><p className={`text-text`}>{translations?.theme2}</p></button>
        <button onClick={() => toggleTheme("ubuntu")} className={`bg-primary`} ><p className={`text-text`}>{translations?.theme3}</p></button>
      </div>
      <button onClick={() => toggleLang("fr")} className={`bg-primary`} ><p className={`text-text`}>{translations?.lang1}</p></button>
      <button onClick={() => toggleLang("en")} className={`bg-primary`} ><p className={`text-text`}>{translations?.lang2}</p></button>
    </main>
  );
}
