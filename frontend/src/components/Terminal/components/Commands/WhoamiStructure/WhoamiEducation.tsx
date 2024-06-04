import { useContext } from "react";
import { termContext } from "../../../Terminal";
import { Message } from "../../TerminalStructure/Message";
import { useLang } from "@/context/Lang/LangContext";

const WhoamiEducation: React.FC = () => {
  const { arg } = useContext(termContext);
  const { translations } = useLang();

    return (
        <>
        <Message>Education</Message>
        </>
    );
};

export default WhoamiEducation;