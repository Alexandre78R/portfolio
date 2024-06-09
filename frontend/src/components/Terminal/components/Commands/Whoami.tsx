import { useContext } from "react";
import { termContext } from "../../Terminal";
import { Message } from "../Message";
import { useLang } from "@/context/Lang/LangContext";
import WhoamiError from "./WhoamiComponents/WhoamiError";
import WhoamiEducation from "./WhoamiComponents/WhoamiEducation";
import WhoamiExperience from "./WhoamiComponents/WhoamiExperience";
import WhoamiSkills from "./WhoamiComponents/WhoamiSkills";

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