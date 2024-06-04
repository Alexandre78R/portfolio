import { useContext } from "react";
import { termContext } from "../../../Terminal";
import { Message } from "../../TerminalStructure/Message";
import { useLang } from "@/context/Lang/LangContext";
import { skillsData } from "@/Data/skillsData";

const WhoamiSkills: React.FC = () => {
  const { arg } = useContext(termContext);
  const { translations } = useLang();

    return (
        <>
        <Message>Skills</Message>
        </>
    );
};

export default WhoamiSkills;