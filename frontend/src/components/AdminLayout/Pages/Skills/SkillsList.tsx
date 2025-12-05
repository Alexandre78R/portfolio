import React, { ReactElement, useState, useMemo } from "react";
import SkillTable, { SkillRow } from "../../components/Skill/SkillTable";
import SkillEditModal from "../../components/Skill/SkillEditModal";
import SkillDeleteDialog from "../../components/Skill/SkillDeleteDialog";
import { useGetSkillsListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

const SkillsList = (): ReactElement => {
  const { data, loading, error, refetch } = useGetSkillsListQuery({
    fetchPolicy: "cache-and-network",
  });

  const { translations }: { translations: Lang } = useLang();

  const [editSkill, setEditSkill] = useState<SkillRow | null>(null);
  const [deleteSkillId, setDeleteSkillId] = useState<number | null>(null);

  // Transformer les données pour le tableau
  const skills = useMemo<SkillRow[]>(() => {
    if (!data?.skillList?.categories) return [];

    const allSkills: SkillRow[] = [];

    data.skillList.categories.forEach((category) => {
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