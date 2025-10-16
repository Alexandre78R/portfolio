import React, { useContext, useEffect, useState } from "react";
import { termContext } from "../../Terminal";
import Usage from "../Usage";
import { Message } from "../Message";
import { useTheme } from "@/context/Theme/ThemeContext";
import { tabThemes, tabThemesName, ThemeName } from "@/context/Theme/themes";
import { checkThemeSwitch, getCurrentCmdArry, isArgInvalid } from "../../util";

const Themes: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);
  const { toggleTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeName | "">("");

  const currentCommand: string[] = getCurrentCmdArry(history) || [];

  // On force le typage ici
  const newTheme = currentCommand[2] as ThemeName | undefined;

  useEffect(() => {
    if (
      newTheme &&
      tabThemesName().includes(newTheme) &&
      checkThemeSwitch(rerender, currentCommand, tabThemesName()) &&
      newTheme !== currentTheme
    ) {
      toggleTheme(newTheme);
      setCurrentTheme(newTheme);
    }
  }, [rerender, currentCommand, toggleTheme, currentTheme, newTheme]);

  const checkArg = () =>
    isArgInvalid(arg, "set", tabThemesName()) ? <Usage cmd="themes" /> : null;

  return arg.length > 2 ? (
    checkArg()
  ) : (
    <Message data-testid="themes">
      <div className="flex flex-wrap">
        {tabThemes().map((theme) => (
          <span className="mr-3.5 mb-1 whitespace-nowrap" key={theme.id}>
            {theme.name}
          </span>
        ))}
      </div>
      <Usage cmd="themes" />
    </Message>
  );
};

export default Themes;