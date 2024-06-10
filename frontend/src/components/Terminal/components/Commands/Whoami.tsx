import { useContext } from "react";
import { termContext } from "../../Terminal";
import { useLang } from "@/context/Lang/LangContext";
import WhoamiError from "./WhoamiComponents/WhoamiError";
import WhoamiEducation from "./WhoamiComponents/WhoamiEducation";
import WhoamiExperience from "./WhoamiComponents/WhoamiExperience";
import WhoamiSkills from "./WhoamiComponents/WhoamiSkills";

const Whoami: React.FC = (): React.ReactElement => {
  
  const { arg } = useContext(termContext);
  const { translations } = useLang();

  if (arg.length === 0) {
    return <WhoamiError message={translations.terminalWhoamiNotArg} />
  }

  if (arg.length !== 1 && arg.length !== 0) {
    return <WhoamiError message={translations.terminalWhoamiMaxOneArg} />
  }

  const whoamiName: string = arg[0].toLowerCase();

  switch (whoamiName) {
    case "experiences":
      return <WhoamiExperience />
    case "educations":
      return <WhoamiEducation />
    case "skills":
      return <WhoamiSkills />
    default:
      return <WhoamiError message={translations.terminalWhoamiChoiceNotExiste} />
  }

};

export default Whoami;