import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";

export interface SkillCategoryRow {
  id: number;
  categoryEN: string;
  categoryFR: string;
  skillCount: number;
}

interface SkillCategoryTableProps {
  categories: SkillCategoryRow[];
  translations: Lang;
  onEdit: (category: SkillCategoryRow) => void;
  onDelete: (categoryId: number) => void;
}

const SkillCategoryTable = ({
  categories,
  translations,
  onEdit,
  onDelete,
}: SkillCategoryTableProps): ReactElement => {
  const columns: ColumnDef<SkillCategoryRow>[] = [
    {
      header: translations.messageAdminSkillCategoryColumnEN,
      accessor: "categoryEN",
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSkillCategoryColumnFR,
      accessor: "categoryFR",
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSkillCategoryColumnSkillCount,
      accessor: "skillCount",
      className: "px-4 py-3 text-center",
    },
    {
      header: translations.messageAdminSkillCategoryColumnAction,
      accessor: (row) => {
        const actions: ActionItem<SkillCategoryRow>[] = [
          {
            icon: Pencil,
            label: "Edit",
            onClick: () => onEdit(row),
          },
          {
            icon: Trash,
            label: "Delete",
            onClick: () => onDelete(row.id),
            colorClass: "bg-red-500/90 hover:bg-red-500",
          },
        ];

        return <ActionButton row={row} actions={actions} />;
      },
      className: "px-4 py-3 text-center",
    },
  ];

  return <Table columns={columns} data={categories} />;
};

export default SkillCategoryTable;
