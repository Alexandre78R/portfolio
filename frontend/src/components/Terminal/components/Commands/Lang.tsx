import { useContext, useEffect, useState } from "react";
import { useLang } from "@/context/Lang/LangContext";
import { Message } from "../Message";
import { termContext } from "../../Terminal";
import Usage from "../Usage";
import { checkLangSwitch, getCurrentCmdArry, isArgInvalid } from "../../util";
// import type LangType from "@/lang/typeLang";
import { Term } from "../../Terminal";

const Lang = (): React.ReactNode  => {
  const { listLang, setLang } = useLang();
  const { arg, history, rerender } = useContext<Term>(termContext);
  const [currentLang, setCurrentLang]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("");

  const currentCommand: any[] = getCurrentCmdArry(history);

  useEffect(() => {
    if (
      checkLangSwitch(rerender, currentCommand, listLang) &&
      currentCommand[2] !== currentLang
    ) {
      setLang(currentCommand[2]);
      setCurrentLang(currentCommand[2]);
    }
  }, [rerender, currentCommand, currentLang]);

  const checkArg = () =>
    isArgInvalid(arg, "set", listLang) ? <Usage cmd="themes" /> : null;

  return arg.length > 2
    ? checkArg()
    : checkArg() && (
        <Message>
          <div className="flex flex-wrap">
            {listLang.map((lang: string) => (
              <span className="mr-3.5 mb-1 whitespace-nowrap" key={lang}>
                {lang}
              </span>
            ))}
          </div>
          <Usage cmd="lang" />
        </Message>
      );
};

export default Lang;
