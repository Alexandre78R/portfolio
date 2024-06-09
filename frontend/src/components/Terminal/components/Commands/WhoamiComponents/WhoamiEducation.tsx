import { useContext } from "react";
import { termContext } from "../../../Terminal";
import { Message } from "../../Message";
import { useLang } from "@/context/Lang/LangContext";

const WhoamiEducation: React.FC = (): React.ReactElement => {
  const { arg } = useContext(termContext);
  const { translations } = useLang();

    return (
        <>
        <Message>Education</Message>
        </>
    );
};

export default WhoamiEducation;