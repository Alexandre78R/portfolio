import { useContext } from "react";
import { termContext } from "../../../Terminal";
import { Message } from "../../Message";
import { useLang } from "@/context/Lang/LangContext";

const WhoamiExperience: React.FC = () => {
  const { arg } = useContext(termContext);
  const { translations } = useLang();

    return (
        <>
        <Message>Experience</Message>
        </>
    );
};

export default WhoamiExperience;