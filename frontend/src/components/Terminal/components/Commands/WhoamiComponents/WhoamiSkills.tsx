import { useState, useEffect, Key } from "react";
import { termContext } from "../../../Terminal";
import { Message } from "../../Message";
import { useLang } from "@/context/Lang/LangContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ButtonCustom from "@/components/Button/Button";
import { SkillTab } from "@/components/Skills/typeSkills";

const WhoamiSkills: React.FC = () => {
  const dataSkills = useSelector((state: RootState) => state.skills.dataSkills);

  const { translations } = useLang();

  const [currentPage, setCurrentPage]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState<number>(1);
  const datasPerPage: number = 3;

  const pagination: () => SkillTab[] | any[] = (): SkillTab[] | any[] => {
    const indexLast: number = currentPage * datasPerPage;
    const indexFirst: number = indexLast - datasPerPage;
    return dataSkills.slice(indexFirst, indexLast);
  };

  const next: () => void = (): void => {
    setCurrentPage(currentPage + 1);
  };

  const previous: () => void = (): void => {
    setCurrentPage(currentPage - 1);
  };

  const chunkArray: (array: any[], size: number) => any[] = (
    array: any[],
    size: number
  ): any[] => {
    const chunkedArr: any[] = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const getChunkSize: () => number = (): number => {
    if (window.innerWidth >= 1024) return 5; // Desktop
    if (window.innerWidth >= 768) return 4; // Tablet
    if (window.innerWidth >= 300) return 3; // Large mobile
    return 2; // Mini Mobile
  };

  const [chunkSize, setChunkSize]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState<number>(getChunkSize());

  useEffect(() => {
    const handleResize: () => void = () => setChunkSize(getChunkSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {pagination()?.map((skill) => {
        return (
          <Message key={skill.id}>
            <span className="text-primary">{`${skill.id}. ${skill.category}`}</span>
            {chunkArray(skill.skills, chunkSize).map((skillChunk, index) => (
              <div key={index} className="flex space-x-3 m-3">
                {skillChunk.map((skillImg: any) => (
                  <img
                    key={skillImg.name}
                    alt={skillImg.name}
                    src={skillImg.image}
                  />
                ))}
              </div>
            ))}
          </Message>
        );
      })}
      <div className="flex">
        <div className="mr-4">
          <ButtonCustom
            onClick={currentPage > 1 ? previous : undefined}
            text={translations.buttonPaginationPrevious}
            disable={currentPage > 1 ? false : true}
            disableHover={currentPage > 1 ? false : true}
          />
        </div>
        <ButtonCustom
          onClick={
            currentPage < Math.ceil(dataSkills.length / datasPerPage)
              ? next
              : undefined
          }
          text={translations.buttonPaginationNext}
          disable={
            currentPage < Math.ceil(dataSkills.length / datasPerPage)
              ? false
              : true
          }
          disableHover={
            currentPage < Math.ceil(dataSkills.length / datasPerPage)
              ? false
              : true
          }
        />
      </div>
    </>
  );
};

export default WhoamiSkills;
