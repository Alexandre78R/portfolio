import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";

export interface SkillRow {
  id: number;
  name: string;
  image: string;
  categoryEN?: string;
  categoryFR?: string;
}

interface SkillTableProps {
  skills: SkillRow[];
  translations: Lang;
  onEdit: (skill: SkillRow) => void;
  onDelete: (skillId: number) => void;
}

const SkillTable: React.FC<SkillTableProps> = ({
  skills,
  translations,
  onEdit,
  onDelete,
}: SkillTableProps): ReactElement => {
  const columns: ColumnDef<SkillRow>[] = [
    {
      header: translations.messageAdminSkillColumnName || "Name",
      accessor: "name",
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSkillColumnImage || "Image",
      accessor: (row) => (
        <img
          src={row.image}
          alt={row.name}
          className="w-10 h-10 object-contain"
        />
      ),
      className: "px-4 py-3 text-center",
    },
    {
      header: translations.messageAdminSkillColumnCategoryEN || "Category (EN)",
      accessor: "categoryEN",
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSkillColumnCategoryFR || "Category (FR)",
      accessor: "categoryFR",
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSkillColumnAction || "Action",
      accessor: (row) => {
        const actions: ActionItem<SkillRow>[] = [
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

  return <Table columns={columns} data={skills} />;
};

export default SkillTable;
