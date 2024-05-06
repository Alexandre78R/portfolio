import { Inter } from "next/font/google";
import { ThemeProvider, useTheme } from "@/context/Theme/ThemeContext";
import { useLang } from "@/context/Lang/LangContext";

const Navbar = () => {
  const { toggleTheme } = useTheme();
  const { toggleLang, translations } = useLang();

  return (
    <nav>
        <p className="text-text">je suis la navbar !</p>
    </nav>
  );
}

export default Navbar;