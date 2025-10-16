import { useContext } from "react";
import { termContext, Term } from "../../Terminal";
import { useLang } from "@/context/Lang/LangContext";
import WhoamiError from "./WhoamiComponents/WhoamiError";
import WhoamiEducation from "./WhoamiComponents/WhoamiEducation";
import WhoamiExperience from "./WhoamiComponents/WhoamiExperience";
import WhoamiSkills from "./WhoamiComponents/WhoamiSkills";
import Lang from "@/lang/typeLang";

const Whoami = (): JSX.Element => {
  const { arg } = useContext<Term>(termContext);
  const { translations } = useLang() as { translations : Lang };

  if (arg.length === 0) {
    return <WhoamiError message={translations.terminalWhoamiNotArg} />;
  }

  if (arg.length !== 1 && arg.length !== 0) {
    return <WhoamiError message={translations.terminalWhoamiMaxOneArg} />;
  }

  const whoamiName: string = arg[0].toLowerCase();

  switch (whoamiName) {
    case "experiences":
      return <WhoamiExperience />;
    case "educations":
      return <WhoamiEducation />;
    case "skills":
      return <WhoamiSkills />;
    default:
      return (
        <WhoamiError message={translations.terminalWhoamiChoiceNotExiste} />
      );
  }
};

export default Whoami;
