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

    const chunkArray = (array: any[], size: number) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };
    return (
        <>
            {
                dataSkills?.map(skill => {
                    return (
                        <Message key={skill.id}>
                            <span className="text-primary">{`${skill.id}. ${skill.category}`}</span>
                            {chunkArray(skill.skills, 3).map((skillChunk, index) => (
                                <div key={index} className="flex space-x-2 m-2">
                                    {skillChunk.map(skillImg => (
                                        <img key={skillImg.name} alt={skillImg.name} src={skillImg.image} />
                                    ))}
                                </div>
                            ))}
                        </Message>
                    )
                })
            }
        </>
    );
};

export default WhoamiSkills;