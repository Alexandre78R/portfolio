import { useContext, useEffect } from "react";
import { termContext } from "../../../Terminal";
import { Message } from "../../TerminalStructure/Message";
import { useLang } from "@/context/Lang/LangContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const WhoamiSkills: React.FC = () => {
    const { arg } = useContext(termContext);
    const { translations } = useLang();

    const dataSkills = useSelector((state: RootState) => state.skills.dataSkills);

    return (
        <>
            {
                dataSkills?.map((skill, index) => {
                    return (
                        <div key={skill.id}>
                            <span className="text-primary">{`${skill.id}. ${skill.category}`}</span>
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