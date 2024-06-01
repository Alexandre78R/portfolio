import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import {
    checkThemeSwitch,
  getCurrentCmdArry,
  isArgInvalid,
} from "../../util";
import { termContext } from "../../Terminal";
import Usage from "../TerminalStructure/Usage";
import { Message } from "../TerminalStructure/Message";
import { useTheme } from "@/context/Theme/ThemeContext";
import { tabThemes, tabThemesName } from "@/context/Theme/themes";

const Themes: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);
  const { toggleTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>("");

  const currentCommand = getCurrentCmdArry(history);

  useEffect(() => {
    if (checkThemeSwitch(rerender, currentCommand, tabThemesName()) && currentCommand[2] !== currentTheme) {
      toggleTheme(currentCommand[2]);
      setCurrentTheme(currentCommand[2]);
    }
  }, [rerender, currentCommand, toggleTheme, currentTheme]);

  const checkArg = () => 
    isArgInvalid(arg, "set", tabThemesName()) ? <Usage cmd="themes" /> : null;

  return arg.length > 2 ? (
    checkArg()
    
  ) : (
    checkArg() &&
    <Message data-testid="themes">
      <div className="flex flex-wrap">
        {tabThemes().map(theme => (
          <span className="mr-3.5 mb-1 whitespace-nowrap" key={theme.id}>{theme.name}</span>
        ))}
      </div>
      <Usage cmd="themes" />
    </Message>
  );
};

export default Themes;