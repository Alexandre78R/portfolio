import { useState } from "react";
import { Message } from "../../Message";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";

const WhoamiExperience: React.FC = (): React.ReactElement => {

  const dataExperiences = useSelector((state: RootState) => state.experiences.dataExperiences);

  const newOrderDataExperience = dataExperiences?.slice().reverse();

  const { translations } = useLang();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const datasPerPage: number = 2;

  const pagination = () => {
    const indexLast: number = currentPage * datasPerPage;
    const indexFirst: number = indexLast - datasPerPage;
    return newOrderDataExperience.slice(indexFirst, indexLast);
  };

  const next = () : void => {
  setCurrentPage(currentPage + 1);
  };

  const previous = (): void => {
  setCurrentPage(currentPage - 1);
  };

  return (
      <Message>
        {
          pagination()?.slice().reverse().map(experience => {
            return(
              <div key={experience.id} className="m-2">              
                <div className="flex flex-row items-center">
                  <p className="text-primary">{experience.job}</p>
                  <p className="ml-2" >{experience.business}</p>
                </div>
                <div className="flex flex-row items-center">
                  <span className=" mr-3 text-text300">{experience.startDate} - {experience.endDate}</span>
                </div>
              </div>
            )
          })
        }
          <div className="flex">
            <div className="mr-4">
                <ButtonCustom 
                    onClick={currentPage > 1? previous : undefined}
                    text={translations.buttonPaginationPrevious}
                    disable={currentPage > 1? false : true}
                    disableHover={currentPage > 1? false : true}
                />
            </div>
            <ButtonCustom
                onClick={currentPage < Math.ceil(newOrderDataExperience.length / datasPerPage) ? next : undefined}
                text={translations.buttonPaginationNext}
                disable={currentPage < Math.ceil(newOrderDataExperience.length / datasPerPage) ? false : true}
                disableHover={currentPage < Math.ceil(newOrderDataExperience.length / datasPerPage) ? false : true}
            />
          </div>
      </Message>
    );
};

export default WhoamiExperience;