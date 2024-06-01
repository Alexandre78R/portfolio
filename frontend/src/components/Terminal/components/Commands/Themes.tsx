import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import {
//   checkThemeSwitch,
  getCurrentCmdArry,
  isArgInvalid,
} from "../../util";
import { termContext } from "../../Terminal";
import Usage from "../TerminalStructure/Usage";
import { Message } from "../TerminalStructure/Message";
import { useTheme } from "@/context/Theme/ThemeContext";
import { tabThemes } from "@/context/Theme/themes";

const Themes: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);
  const { toggleTheme } = useTheme();
  const [themeName, setThemeName] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("");
//   useEffect(() => {
//     if (themeName) {
//       toggleTheme(themeName);
//     }
//   }, [themeName, toggleTheme]);


//   if (arg.length < 2) {
//     return <Usage cmd="themes" />
//   }

//   const checkThemes = (): boolean => {
//     const newTheme = arg[1];
//     return tabThemes().some(theme => theme.name === newTheme);
//   };

//   if (checkThemes()) {
//     setThemeName(arg[1]);
//     return <Message>.</Message>;
//   }


// useEffect(() => {
//     if (arg.length >= 2) {
//       const newTheme = arg[1];
//       if (checkThemes(newTheme) && newTheme !== currentTheme) {
//         toggleTheme(newTheme);
//         setCurrentTheme(newTheme);
//       }
//     }
//   }, [arg]);

//   const checkThemes = (newTheme: string): boolean => {
//     console.log(arg[1])
//     return tabThemes().some(theme => theme.name === newTheme);
//   };

//   if (arg.length < 2) {
//     return <Usage cmd="themes" />;
//   }

//   if (checkThemes(arg[1])) {
//     return <Message data-testid="themes">Theme switched to {arg[1]}</Message>;
//   }
useEffect(() => {
    if (arg.length >= 2) {
      const newTheme = arg[1];
      if (checkThemes(newTheme) && newTheme !== currentTheme) {
        toggleTheme(newTheme);
        setCurrentTheme(newTheme);
      }
    }
  }, [arg]);

  const checkThemes = (newTheme: string): boolean => {
    console.log(arg[1])
    return tabThemes().some(theme => theme.name === newTheme);
  };

  if (arg.length < 2) {
    return <Usage cmd="themes" />;
  }

  if (checkThemes(arg[1])) {
    return <Message data-testid="themes">Theme switched to {arg[1]}</Message>;
  }

  return (
    <Message data-testid="themes">
      <div className="flex flex-wrap">
      {
        tabThemes().map(theme => {
            return (
                <span className="mr-3.5 mb-1 whitespace-nowrap" key={theme.id}>{theme.name}</span>
            )
        })
      }
      </div>
      <Usage cmd="themes" />
    </Message>
  );
};

export default Themes;