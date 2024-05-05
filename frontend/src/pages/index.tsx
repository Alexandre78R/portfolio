import { Inter } from "next/font/google";
import { ThemeProvider, useTheme } from "@/context/Theme/ThemeContext";
import themes from "@/context/Theme/themes";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  // console.log("${themes[theme].colors.body", themes[theme].colors.body)
  return (
    <main
      className={`bg-body`}
      
    >
      <p>Bienvenue sur mon portfolio ! </p>
      <button onClick={() => toggleTheme("dark")} className={`bg-LightBody `} ><p className={`text-primary`}>Changer de thème - Dark</p></button>
      <button onClick={() => toggleTheme("light")} className={`bg-LightBody `} ><p className={`text-primary`}>Changer de thème - light</p></button>
      <button onClick={() => toggleTheme("ubuntu")} className={`bg-LightBody `} ><p className={`text-primary`}>Changer de thème - Ubuntu</p></button>
      <p className={`text-primary`}>Changer de thème</p>
    </main>
  );
}
