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
            {
                skillsData?.map((skill, index) => {
                    return (
                        <div key={skill.id}>
                            <span className="text-primary">{`${skill.id}. ${skill.categoryEN}`}</span>
                            {/* <span className="tab">{generateTabs(tab)}</span>
                            <span className="text-text200 block md:inline-block lg:inline-block">
                            {url}
                            </span> */}
                        </div>
                    )
                })
            }
        </>
    );
};

export default WhoamiSkills;