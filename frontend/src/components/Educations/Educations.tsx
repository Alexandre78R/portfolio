import { useLang } from '@/context/Lang/LangContext';
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";

const Educations: React.FC = (): React.ReactElement => {

  const dataEducations = useSelector((state: RootState) => state.educations.dataEducations);
  
  return (
    <div className="m-[3%]">
        <ol
        className="border-s border-secondary md:flex md:justify-center md:gap-6 md:border-s-0 md:border-t">
        {
            dataEducations?.map(education => {
                return (
                    <>
                        <li>
                            <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                            <div
                                className="-ms-[5px] me-3 h-[9px] w-[9px] rounded-full bg-primary md:-mt-[5px] md:me-0 md:ms-0"></div>
                            <p className="mt-2 text-sm text-text">
                                {education.year}
                            </p>
                            </div>
                            <div className="ms-4 mt-2 pb-5 md:ms-0">
                                <p className="hover:text-secondary text-primary mb-1.5 font-semibold">{education.title}</p>
                                <p className="mb-3 text-text300 hover:text-text100">
                                    {education.school}
                                </p>
                            </div>
                        </li>
                    </>
                )
            })
        }
        </ol>
    </div>
  );
};

export default Educations;