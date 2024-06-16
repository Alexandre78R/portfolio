import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { EducationType } from "@/store/slices/educationsSlice";
import { ExperienceType } from "@/store/slices/experiencesSlice";

const Careers: React.FC = (): React.ReactElement => {

  const dataEducations = useSelector((state: RootState) => state.educations.dataEducations);
  const dataExperiences = useSelector((state: RootState) =>state.experiences.dataExperiences);

  type CombinedData = (EducationType | ExperienceType)[];

  const combinedData: CombinedData = useMemo(() => {
    const combined: CombinedData = [...dataExperiences, ...dataEducations];

    const parseDate = (dateString: string): number => {
      const [month, year]: string[] = dateString.split(' ');
      return new Date(`${month} 1, ${year}`).getTime();
    };

    combined.sort((a, b) => {
      const dateAStart: number = parseDate(a.startDateEN);
      const dateBStart: number = parseDate(b.startDateEN);
      const dateAEnd: number = parseDate(a.endDateEN);
      const dateBEnd: number = parseDate(b.endDateEN);

      if (a.month === null) {
        return -1;
      } else if (b.month === null) {
        return 1;
      }

      const yearAStart: number = new Date(a.startDateEN).getFullYear();
      const yearBStart: number = new Date(b.startDateEN).getFullYear();

      // Priorisation : expérience avant éducation si même année
      if (a.typeEN === "Experience" && b.typeEN === "Education" && yearAStart === yearBStart) {
        return -1; // Met l'expérience avant l'éducation
      } else if (a.typeEN === "Education" && b.typeEN === "Experience" && yearAStart === yearBStart) {
        return 1; // Met l'éducation avant l'expérience
      }

      // Tri par date de début et de fin par défaut
      if (dateAStart !== dateBStart) {
        return dateBStart - dateAStart; // Trie par date de début décroissante
      } else {
        return dateBEnd - dateAEnd; // Si même date de début, trie par date de fin décroissante
      }
    });

    return combined;
  }, [dataEducations, dataExperiences]);
  
  return (
    <div className="m-[3%]">
        <ol
        className="border-s border-secondary md:flex md:justify-center md:gap-6 md:border-s-0 md:border-t">
        {
            combinedData?.map(item => {
                return (
                  <>
                    <li className="">
                      <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                      <div
                        className="-ms-[5px] me-3 h-[9px] w-[9px] rounded-full bg-primary md:-mt-[5px] md:me-0 md:ms-0"></div>
                        <p className="mt-2 text-sm text-text">
                          {item.startDate} - {item.endDate} 
                        </p>
                        </div>
                        <div className="ms-4 mt-2 pb-5 md:ms-0">
                          <p className="text-sm text-text">
                              {item.type}
                          </p>
                          <p className="max-w-[210px] hover:text-secondary text-primary mt-2  font-semibold">{(item as EducationType)?.title} {(item as ExperienceType)?.job}</p>
                          <p className="max-w-[160px] text-sm text-text">
                            {(item as EducationType).diplomaLevel} {(item as ExperienceType).employmentContract}
                          </p>
                          <p className="mt-2 text-text300 hover:text-text100">
                              {(item as EducationType).school} {(item as ExperienceType).business}
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

export default Careers;