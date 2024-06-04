import { useContext } from "react";
import { termContext } from "../../Terminal";
import { Message } from "../TerminalStructure/Message";
import { useLang } from "@/context/Lang/LangContext";
import WhoamiError from "./WhoamiStructure/WhoamiError";
import WhoamiEducation from "./WhoamiStructure/WhoamiEducation";
import WhoamiExperience from "./WhoamiStructure/WhoamiExperience";
import WhoamiSkills from "./WhoamiStructure/WhoamiSkills";

const Whoami: React.FC = () => {
  const { arg } = useContext(termContext);
  const { translations } = useLang();

  if (arg.length === 0) {
    return <WhoamiError message={translations.terminalWhoamiNotArg} />
  }

  if (arg.length !== 1 && arg.length !== 0) {
    return <WhoamiError message={translations.terminalWhoamiMaxOneArg} />
  }

  switch (arg[0].toLowerCase()) {
    case "experience":
      return <WhoamiExperience />
    case "education":
      return <WhoamiEducation />
    case "skills":
      return <WhoamiSkills />
    default:
      return <WhoamiError message={translations.terminalWhoamiChoiceNotExiste} />
  }

};

export default Whoami;