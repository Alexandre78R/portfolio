import React, { FC, useMemo } from "react";
import { useAppSelector } from "@/store/hook";
import { EducationType } from "@/store/slices/educationsSlice";
import { ExperienceType } from "@/store/slices/experiencesSlice";

export type CombinedDataItem = EducationType | ExperienceType;

const Careers: FC = (): React.ReactElement => {
  const dataEducations: EducationType[] = useAppSelector(
    (state) => state.educations.dataEducations
  );
  const dataExperiences: ExperienceType[] = useAppSelector(
    (state) => state.experiences.dataExperiences
  );

  const combinedData: CombinedDataItem[] = useMemo(() => {
    const combined: CombinedDataItem[] = [...dataExperiences, ...dataEducations];

    const parseDate = (dateString: string): number => {
      const [month, year]: string[] = dateString.split(" ");
      return new Date(`${month} 1, ${year}`).getTime();
    };

    console.log("dataEducations", dataEducations);

    return combined.sort((a, b) => {
      const dateAStart = parseDate(a.startDateEN);
      const dateBStart = parseDate(b.startDateEN);
      const dateAEnd = parseDate(a.endDateEN);
      const dateBEnd = parseDate(b.endDateEN);

      if (a.month === null) return -1;
      if (b.month === null) return 1;

      const yearA = new Date(a.startDateEN).getFullYear();
      const yearB = new Date(b.startDateEN).getFullYear();

      // Expérience avant éducation si même année
      if (a.typeEN === "Experience" && b.typeEN === "Education" && yearA === yearB) {
        return -1;
      }
      if (a.typeEN === "Education" && b.typeEN === "Experience" && yearA === yearB) {
        return 1;
      }

      // Tri par date de début décroissante, puis date de fin
      return dateBStart !== dateAStart ? dateBStart - dateAStart : dateBEnd - dateAEnd;
    });
  }, [dataEducations, dataExperiences]);

  return (
    <div className="m-[3%]">
      <ol className="relative border-l-2 border-secondary space-y-10 md:flex md:justify-center md:gap-6 md:border-l-0 md:border-t md:space-y-0">
        {combinedData.map((item: CombinedDataItem, index: number) => {
          const isEducation = "title" in item;
          const isExperience = "job" in item;

          return (
            <li key={index} className="relative pl-8 md:pl-0 md:pt-8 md:w-1/2">
              <span className="absolute left-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary md:left-auto md:top-0 md:-translate-y-1/2 md:translate-x-0 md:mx-auto"></span>
              <div className="flex flex-col">
                <p className="text-sm text-text">
                  {item.startDate} - {item.endDate}
                </p>
                <p className="text-sm text-text">{item.type}</p>
                <p className="max-w-[210px] hover:text-secondary text-primary mt-2 font-semibold">
                  {isEducation ? item.title : null} {isExperience ? item.job : null}
                </p>
                <p className="max-w-[160px] text-sm text-text">
                  {isEducation ? item.diplomaLevel : null}{" "}
                  {isExperience ? item.employmentContract : null}
                </p>
                <p className="mt-2 text-text300 hover:text-text100">
                  {isEducation ? item.school : null} {isExperience ? item.business : null}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Careers;