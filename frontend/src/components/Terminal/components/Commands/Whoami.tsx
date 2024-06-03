import { useContext } from "react";
import _ from "lodash";
import { termContext } from "../../Terminal";
import { Message } from "../TerminalStructure/Message";
import Usage from "../TerminalStructure/Usage";
import { useLang } from "@/context/Lang/LangContext";

const Whoami: React.FC = () => {
  const { arg } = useContext(termContext);
  const { translations } = useLang();

  if (arg.length === 0) {
    return (
      <>
        <Message>{translations.terminalWhoamiNotArg}</Message>
        <Usage cmd="whoami"/>
      </>
    );
  }

  if (arg.length !== 1 && arg.length !== 0) {
    return (
      <>
        <Message>{translations.terminalWhoamiMaxOneArg}</Message>
        <Usage cmd="whoami"/>
      </>
    )
  }

  switch (arg[0].toLowerCase()) {
    case "experience":
      return (
        <>
          <Message>experience</Message>
          <Usage cmd="whoami"/>
        </>
      )
    case "education":
      return (
        <>
          <Message>education</Message>
          <Usage cmd="whoami"/>
        </>
      )
    case "skills":
      return (
        <>
          <Message>skills</Message>
          <Usage cmd="whoami"/>
        </>
      )
    default:
      return (
        <>
          <Message>{translations.terminalWhoamiChoiceNotExiste}</Message>
          <Usage cmd="whoami"/>
        </>
      )
  }

};

export default Whoami;