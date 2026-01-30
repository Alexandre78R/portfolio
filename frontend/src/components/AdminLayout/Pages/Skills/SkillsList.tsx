import React, { ReactElement, useState, useMemo } from "react";
import SkillTable, { SkillRow } from "../../components/Skill/SkillTable";
import SkillEditModal from "../../components/Skill/SkillEditModal";
import SkillDeleteDialog from "../../components/Skill/SkillDeleteDialog";
import { useGetSkillsListQuery, GetSkillsListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

const SkillsList: React.FC = (): ReactElement => {
  const { data, loading, error, refetch } = useGetSkillsListQuery<GetSkillsListQuery>({
    fetchPolicy: "cache-and-network",
  });

  const { translations }: { translations: Lang } = useLang();

  const [editSkill, setEditSkill]: [SkillRow | null, React.Dispatch<React.SetStateAction<SkillRow | null>>] = useState<SkillRow | null>(null);
  const [deleteSkillId, setDeleteSkillId]: [number | null, React.Dispatch<React.SetStateAction<number | null>>] = useState<number | null>(null);

  const skills: SkillRow[] = useMemo<SkillRow[]>(() => {
    if (!data?.listSkillCategories?.categories) return [];

    const allSkills: SkillRow[] = [];

    data.listSkillCategories.categories.forEach((category) => {
      if (category?.skills) {
        category.skills.forEach((skill) => {
          if (skill) {
            allSkills.push({
              id: Number(skill.id),
              name: skill.name || "",
              image: skill.image || "",
              categoryEN: category.categoryEN || "",
              categoryFR: category.categoryFR || "",
            });
          }
        });
      }
    });

    return allSkills;
  }, [data]);

  if (loading) return <LoadingCustom />;

  if (error || skills.length === 0) {
    return (
      <p className="p-4 text-primary">
        {translations.messageAdminSkillListNotFound || "No skills found"}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminSkillListTitle || "Skills List"}
      </TextAdmin>

      <SkillTable
        skills={skills}
        translations={translations}
        onEdit={(skill) => setEditSkill(skill)}
        onDelete={(id) => setDeleteSkillId(id)}
      />

      {/* EDIT */}
      <SkillEditModal
        skill={editSkill}
        onClose={() => setEditSkill(null)}
        onRefresh={refetch}
      />

      {/* DELETE */}
      <SkillDeleteDialog
        skillId={deleteSkillId}
        onClose={() => setDeleteSkillId(null)}
        onRefresh={refetch}
      />
    </div>
  );
};

export default SkillsList;