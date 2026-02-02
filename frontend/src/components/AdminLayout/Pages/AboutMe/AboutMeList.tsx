import React, { ReactElement, useState } from "react";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import AboutMeTable, { AboutMeRow } from "../../components/AboutMe/AboutMeTable";
import AboutMeDeleteDialog from "../../components/AboutMe/AboutMeDeleteDialog";
import AboutMeEditModal from "../../components/AboutMe/AboutMeEditModal";
import { ListAboutMeQuery } from "@/types/graphql";
import { useListAboutMeAdmin } from "@/utils/hooks/useAboutMeAdmin";

const AboutMeList = (): ReactElement => {
  const { data, loading, error, refetch } = useListAboutMeAdmin();

  const { translations }: { translations: Lang } = useLang();

  const [editAboutMeId, setEditAboutMeId]: [number | null, React.Dispatch<React.SetStateAction<number | null>>] = useState<number | null>(null);
  const [deleteAboutMeId, setDeleteAboutMeId]: [number | null, React.Dispatch<React.SetStateAction<number | null>>] = useState<number | null>(null);

  if (loading) return <LoadingCustom />;

  if (error || !data?.listAboutMe?.aboutMes) {
    return (
      <TextAdmin type="p" className="p-4 text-primary">
        {translations.messageAdminAboutMeListNotFound}
      </TextAdmin>
    );
  }

  type AboutMeItem = NonNullable<ListAboutMeQuery["listAboutMe"]["aboutMes"]>[number];

  const aboutMeItems: AboutMeItem[] = (data.listAboutMe.aboutMes ?? []).filter(Boolean) as AboutMeItem[];

  const aboutMes: AboutMeRow[] = aboutMeItems.map((item) => ({
    id: Number(item.id),
    titleEN: item.titleEN,
    titleFR: item.titleFR,
    descriptionEN: item.descriptionEN,
    descriptionFR: item.descriptionFR,
    isVisible: item.isVisible,
  }));

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminAboutMeListTitle}
      </TextAdmin>

      <AboutMeTable
        aboutMes={aboutMes}
        translations={translations}
        onEdit={(aboutMe: AboutMeRow) => setEditAboutMeId(aboutMe.id)}
        onDelete={(id: number) => setDeleteAboutMeId(id)}
      />

      {/* EDIT */}
      <AboutMeEditModal
        aboutMeId={editAboutMeId}
        onClose={() => setEditAboutMeId(null)}
        onRefresh={refetch}
      />

      {/* DELETE */}
      <AboutMeDeleteDialog
        aboutMeId={deleteAboutMeId}
        onClose={() => setDeleteAboutMeId(null)}
        onRefresh={refetch}
      />
    </div>
  );
};

export default AboutMeList;
