import React, { ReactElement, useState } from "react";
import { useGetEducationsListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import EducationTable, {
  EducationRow,
} from "../../components/Education/EducationTable";

const EducationList = (): ReactElement => {
  const { data, loading, error } = useGetEducationsListQuery({
    fetchPolicy: "cache-and-network",
  });

  const { translations }: { translations: Lang } = useLang();

  const [editEducation, setEditEducation] =
    useState<EducationRow | null>(null);
  const [deleteEducationId, setDeleteEducationId] =
    useState<number | null>(null);

  if (loading) return <LoadingCustom />;

  if (error || !data?.educationList?.educations) {
    return (
      <p className="p-4 text-primary">
        {translations.messageAdminEducationListNotFound}
      </p>
    );
  }

  const educations: EducationRow[] = data.educationList.educations
    .filter((edu): edu is NonNullable<typeof edu> => !!edu)
    .map((edu) => ({
      id: Number(edu.id), // 👈 FIX ICI
      school: edu.school,
      location: edu.location,
      titleFR: edu.titleFR,
      titleEN: edu.titleEN ?? edu.titleFR,
      diplomaLevelFR: edu.diplomaLevelFR,
      diplomaLevelEN: edu.diplomaLevelEN ?? edu.diplomaLevelFR,
      year: edu.year,
      month: edu.month ?? null,
      typeFR: edu.typeFR,
      typeEN: edu.typeEN ?? edu.typeFR,
    }));

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminEducationListTitle}
      </TextAdmin>

      <EducationTable
        educations={educations}
        translations={translations}
        onEdit={(education) => setEditEducation(education)}
        onDelete={(id) => setDeleteEducationId(id)}
      />
    </div>
  );
};

export default EducationList;