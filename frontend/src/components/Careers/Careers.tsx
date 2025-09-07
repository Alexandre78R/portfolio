import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { EducationType } from "@/store/slices/educationsSlice";
import { ExperienceType } from "@/store/slices/experiencesSlice";

const Careers: React.FC = (): React.ReactElement => {
  const dataEducations = useSelector(
    (state: RootState) => state.educations.dataEducations
  );
  const dataExperiences = useSelector(
    (state: RootState) => state.experiences.dataExperiences
  );

  type CombinedData = (EducationType | ExperienceType)[];

  const combinedData: CombinedData = useMemo(() => {
    const combined: CombinedData = [...dataExperiences, ...dataEducations];

    const parseDate = (dateString: string): number => {
      const [month, year]: string[] = dateString.split(" ");
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
      if (
        a.typeEN === "Experience" &&
        b.typeEN === "Education" &&
        yearAStart === yearBStart
      ) {
        return -1; // Met l'expérience avant l'éducation
      } else if (
        a.typeEN === "Education" &&
        b.typeEN === "Experience" &&
        yearAStart === yearBStart
      ) {
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
    <ol className="relative border-l-2 border-secondary space-y-10 md:flex md:justify-center md:gap-6 md:border-l-0 md:border-t md:space-y-0">
      {combinedData?.map((item, index) => (
        <li key={index} className="relative pl-8 md:pl-0 md:pt-8 md:w-1/2">
          <span className="absolute left-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary md:left-auto md:top-0 md:-translate-y-1/2 md:translate-x-0 md:mx-auto"></span>
          <div className="flex flex-col">
            <p className="text-sm text-text">
              {item.startDate} - {item.endDate}
            </p>
            <p className="text-sm text-text">{item.type}</p>
            <p className="max-w-[210px] hover:text-secondary text-primary mt-2 font-semibold">
              {(item as EducationType)?.title} {(item as ExperienceType)?.job}
            </p>
            <p className="max-w-[160px] text-sm text-text">
              {(item as EducationType).diplomaLevel}{" "}
              {(item as ExperienceType).employmentContract}
            </p>
            <p className="mt-2 text-text300 hover:text-text100">
              {(item as EducationType).school} {(item as ExperienceType).business}
            </p>
          </div>
        </li>
      ))}
    </ol>
  </div>
  );
};

export default Careers;
