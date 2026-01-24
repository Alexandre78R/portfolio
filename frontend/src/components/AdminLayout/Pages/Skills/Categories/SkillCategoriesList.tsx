import React, { ReactElement, useState } from "react";
import SkillCategoryTable, { SkillCategoryRow } from "../../../components/SkillCategory/SkillCategoryTable";
import SkillCategoryEditModal from "../../../components/SkillCategory/SkillCategoryEditModal";
import SkillCategoryDeleteDialog from "../../../components/SkillCategory/SkillCategoryDeleteDialog";
import { useGetSkillsListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

const SkillCategoriesList: React.FC = (): ReactElement => {
  const { data, loading, error, refetch } = useGetSkillsListQuery({
    fetchPolicy: "cache-and-network",
  });

  const { translations }: { translations: Lang } = useLang();

  const [editCategory, setEditCategory]: [SkillCategoryRow | null, React.Dispatch<React.SetStateAction<SkillCategoryRow | null>>] = useState<SkillCategoryRow | null>(null);
  const [deleteCategoryId, setDeleteCategoryId]: [number | null, React.Dispatch<React.SetStateAction<number | null>>] = useState<number | null>(null);

  if (loading) return <LoadingCustom />;

  if (error || !data?.listSkillCategories?.categories) {
    return (
      <p className="p-4 text-primary">
        {translations.messageAdminSkillCategoryListNotFound}
      </p>
    );
  }

  const categories: SkillCategoryRow[] = (data.listSkillCategories.categories as any[])
    .filter((category): category is NonNullable<typeof category> => !!category)
    .map((category) => ({
      id: Number(category.id),
      categoryEN: category.categoryEN,
      categoryFR: category.categoryFR,
      skillCount: category.skills?.length ?? 0,
    }));

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminSkillCategoryListTitle}
      </TextAdmin>

      <SkillCategoryTable
        categories={categories}
        translations={translations}
        onEdit={(category) => setEditCategory(category)}
        onDelete={(id) => setDeleteCategoryId(id)}
      />

      {/* EDIT */}
      <SkillCategoryEditModal
        category={editCategory}
        onClose={() => setEditCategory(null)}
        onRefresh={refetch}
      />

      {/* DELETE */}
      <SkillCategoryDeleteDialog
        categoryId={deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
        onRefresh={refetch}
      />
    </div>
  );
};

export default SkillCategoriesList;
