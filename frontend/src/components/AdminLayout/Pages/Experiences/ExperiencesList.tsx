import React, { ReactElement, useState } from "react";
import { useGetExperiencesListQuery } from "@/types/graphql";
import ExperienceTable, { ExperienceRow } from "../../components/Experience/ExperienceTable";
import ExperienceCreate from "./ExperienceCreate";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import ExperienceDeleteDialog from "../../components/Experience/ExperienceDeleteDialog";
import ExperienceEditModal from "../../components/Experience/ExperienceEditModal";

const ExperienceList = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();

  const [selectedExperience, setSelectedExperience]: [ExperienceRow | null, React.Dispatch<React.SetStateAction<ExperienceRow | null>>] = useState<ExperienceRow | null>(null);
  const [experienceToDeleteId, setExperienceToDeleteId]: [number | null, React.Dispatch<React.SetStateAction<number | null>>] = useState<number | null>(null);

  const { data, loading, refetch } = useGetExperiencesListQuery({
    fetchPolicy: "network-only",
  });

  const experiences: ExperienceRow[] =
    data?.listExperiences?.experiences?.map((exp) => ({
      id: Number(exp.id),
      jobEN: exp.jobEN,
      jobFR: exp.jobFR,
      business: exp.business,
      employmentContractEN: exp.employmentContractEN,
      employmentContractFR: exp.employmentContractFR,
      startDateEN: exp.startDateEN,
      startDateFR: exp.startDateFR,
      endDateEN: exp.endDateEN,
      endDateFR: exp.endDateFR,
      month: exp.month,
      typeEN: exp.typeEN,
      typeFR: exp.typeFR,
    })) ?? [];

  if (loading) return <LoadingCustom />;

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminExperienceListTitle}
      </TextAdmin>

      <ExperienceTable
        experiences={experiences}
        translations={translations}
        onEdit={(education) => setSelectedExperience(education)}
        onDelete={(id) => setExperienceToDeleteId(id)}
      />

        <ExperienceEditModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
          onRefresh={refetch}
        />

      <ExperienceDeleteDialog
        experienceId={experienceToDeleteId}
        onClose={() => setExperienceToDeleteId(null)}
        onRefresh={refetch}
      />
    </div>
  );
};

export default ExperienceList;