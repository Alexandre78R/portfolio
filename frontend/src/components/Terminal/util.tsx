import _ from "lodash";

export const generateTabs = (num = 0): string => {
  let tabs = "\xA0\xA0";
  for (let i = 0; i < num; i++) {
    tabs += "\xA0";
  }
  return tabs;
};

export const checkRedirect = (
  rerender: boolean,
  currentCommand: string[],
  command: string
): boolean =>
  rerender && // is submitted
  currentCommand[0] === command && // current command starts with ('socials'|'projects')
  currentCommand[1] === "go" && // first arg is 'go'
  currentCommand.length > 1 && // current command has arg
  currentCommand.length < 4 && // if num of arg is valid (not `projects go 1 sth`)
  _.includes([1, 2, 3, 4], parseInt(currentCommand[2])); // arg last part is one of id

export const getCurrentCmdArry = (history: string[]) =>
  _.split(history[0].trim(), " ");

export const isArgInvalid = (
  arg: string[],
  action: string,
  options: string[]
) => arg[0] !== action || !_.includes(options, arg[1]) || arg.length > 2;

export const checkThemeSwitch = (
  rerender: boolean,
  currentCommand: string[],
  themes: string[]
): boolean =>
  rerender && // is submitted
  currentCommand[0] === "themes" && // current command starts with 'themes'
  currentCommand[1] === "set" && // first arg is 'set'
  currentCommand.length > 2 && // current command has arg
  _.includes(themes, currentCommand[2]); // arg last part is one of id

export const checkLangSwitch = (
  rerender: boolean,
  currentCommand: string[],
  lang: string[]
): boolean =>
  rerender && // is submitted
  currentCommand[0] === "lang" &&
  currentCommand[1] === "set" &&
  currentCommand.length > 2 &&
  _.includes(lang, currentCommand[2]);
