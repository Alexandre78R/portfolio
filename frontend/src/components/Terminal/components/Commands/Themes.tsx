import React, { useContext, useEffect, useState } from "react";
import { termContext, Term } from "../../Terminal";
import Usage from "../Usage";
import { Message } from "../Message";
import { useTheme } from "@/context/Theme/ThemeContext";
import { checkThemeSwitch, getCurrentCmdArry, isArgInvalid } from "../../util";

const Themes: React.FC = () => {
  const { arg, history, rerender } = useContext<Term>(termContext);
  const { toggleTheme, themes } = useTheme();

  const themeNames = Object.keys(themes);
  const [currentTheme, setCurrentTheme] = useState<string>("");

  const currentCommand: string[] = getCurrentCmdArry(history) || [];
  const newTheme = currentCommand[2];

  useEffect(() => {
    if (
      newTheme &&
      themeNames.includes(newTheme) &&
      checkThemeSwitch(rerender, currentCommand, themeNames) &&
      newTheme !== currentTheme
    ) {
      toggleTheme(newTheme);
      setCurrentTheme(newTheme);
    }
  }, [rerender, currentCommand, toggleTheme, currentTheme, newTheme, themeNames]);

  const checkArg = () =>
    isArgInvalid(arg, "set", themeNames) ? <Usage cmd="themes" /> : null;

  return arg.length > 2 ? (
    checkArg()
  ) : (
    <Message data-testid="themes">
      <div className="flex flex-wrap">
        {themeNames.map((themeName) => (
          <span
            key={themeName}
            className="mr-3.5 mb-1 whitespace-nowrap"
          >
            {themeName}
          </span>
        ))}
      </div>
      <Usage cmd="themes" />
    </Message>
  );
};

export default Themes;