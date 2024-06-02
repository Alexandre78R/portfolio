import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLang } from "@/context/Lang/LangContext";
import { SparklesCore } from "../ui/SparklesCore";
import { useTheme } from "@/context/Theme/ThemeContext";
import themes from "@/context/Theme/themes";
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import { Wrapper } from "./components/TerminalStructure/Wrapper";
import { CmdNotFound } from "./components/TerminalStructure/CmdNotFound";
import { Empty } from "./components/TerminalStructure/Empty";
import { Form } from "./components/TerminalStructure/Form";
import { Input } from "./components/TerminalStructure/Input";
import { Hints } from "./components/TerminalStructure/Hints";
import _ from "lodash";
import Output from "./Output";
import TermInfo from "./TermInfo";

type Command = {
  cmd: string;
  descEN: string;
  descFR: string;
  tab: number;
}[];

export const commands: Command = [
  { cmd: "help", descEN: "List of commands", descFR: "Liste des commandes", tab: 13 },
  { cmd: "welcome", descEN: "Home sections", descFR: "Rubriques d'accueil", tab: 5 },
  { cmd: "clear", descEN: "Clear the terminal", descFR: "Effacer le terminal", tab: 12 },
  { cmd: "socials", descEN: "Check out my social accounts", descFR: "Consultez mes comptes sociaux", tab: 9 },
  { cmd: "whoami", descEN: "Know more about me", descFR: "En savoir plus sur moi", tab: 7 },
  { cmd: "themes", descEN: "Check available themes", descFR: "Vérifier les thèmes disponibles", tab: 8 },
];

type Term = {
  arg: string[];
  history: string[];
  rerender: boolean;
  index: number;
  clearHistory?: () => void;
};

export const termContext = createContext<Term>({
  arg: [],
  history: [],
  rerender: false,
  index: 0,
});

export const argTab = (
  inputVal: string,
  setInputVal: (value: React.SetStateAction<string>) => void,
  setHints: (value: React.SetStateAction<string[]>) => void,
  hintsCmds: string[]
): string[] | undefined => {
  if (inputVal === "themes ") {
    setInputVal(`themes set`);
    return [];
  }
};

const Terminal: React.FC = () => {
  const { translations } = useLang();
  const { theme } = useTheme();
  const { headerRef } = useSectionRefs();
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>(["welcome"]);
  const [rerender, setRerender] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [pointer, setPointer] = useState(-1);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRerender(false);
      setInputVal(e.target.value);
    },
    [inputVal]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCmdHistory([inputVal, ...cmdHistory]);
    setInputVal("");
    setRerender(true);
    setHints([]);
    setPointer(-1);
  };

  const clearHistory = () => {
    setCmdHistory(["welcome"]);
    setHints([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setRerender(false);
    const ctrlI = e.ctrlKey && e.key.toLowerCase() === "i";
    const ctrlL = e.ctrlKey && e.key.toLowerCase() === "l";

    if (e.key === "Tab" || ctrlI) {
      e.preventDefault();
      if (!inputVal) return;

      let hintsCmds: string[] = [];
      commands.forEach(({ cmd }) => {
        if (_.startsWith(cmd, inputVal)) {
          hintsCmds = [...hintsCmds, cmd];
        }
      });

      const returnedHints = argTab(inputVal, setInputVal, setHints, hintsCmds);
      hintsCmds = returnedHints ? [...hintsCmds, ...returnedHints] : hintsCmds;

      if (hintsCmds.length > 1) {
        setHints(hintsCmds);
      } else if (hintsCmds.length === 1) {
        const currentCmd = _.split(inputVal, " ");
        setInputVal(
          currentCmd.length !== 1
            ? `${currentCmd[0]} ${currentCmd[1]} ${hintsCmds[0]}`
            : hintsCmds[0]
        );

        setHints([]);
      }
    }

    if (ctrlL) {
      clearHistory();
    }

    if (e.key === "ArrowUp") {
      if (pointer >= cmdHistory.length) return;
      if (pointer + 1 === cmdHistory.length) return;

      setInputVal(cmdHistory[pointer + 1]);
      setPointer(prevState => prevState + 1);

      setTimeout(() => {
        inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
      }, 0);
    }

    if (e.key === "ArrowDown") {
      if (pointer < 0) return;

      if (pointer === 0) {
        setInputVal("");
        setPointer(-1);
        return;
      }

      setInputVal(cmdHistory[pointer - 1]);
      setPointer(prevState => prevState - 1);

      setTimeout(() => {
        inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
      }, 0);
    }
  };

  return (
    <Wrapper>
      {hints.length > 1 && (
        <div>
          {hints.map(hCmd => (
            <Hints key={hCmd}>{hCmd}</Hints>
          ))}
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <Input
          title="terminal-input"
          type="text"
          id="terminal-input"
          autoComplete="off"
          spellCheck="false"
          autoFocus
          autoCapitalize="off"
          value={inputVal}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          ref={inputRef}
        />
      </Form>
      {cmdHistory.map((cmdH, index) => {
        const commandArray = _.split(_.trim(cmdH), " ");
        const validCommand = _.find(commands, { cmd: commandArray[0] });
        const contextValue = {
          arg: _.drop(commandArray),
          history: cmdHistory,
          rerender,
          index,
          clearHistory,
        };
        return (
          <div key={_.uniqueId(`${cmdH}_`)}>
            <div>
              <TermInfo />
              <span data-testid="input-command">{cmdH}</span>
            </div>
            {validCommand ? (
              <termContext.Provider value={contextValue}>
                <Output index={index} cmd={commandArray[0]} />
              </termContext.Provider>
            ) : cmdH === "" ? (
              <Empty />
            ) : (
              <CmdNotFound data-testid={`not-found-${index}`} cmdH={cmdH} />
            )}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default Terminal;