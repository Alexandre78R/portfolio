import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";

export interface EducationRow {
  id: number;
  school: string;
  location: string;
  titleFR: string;
  titleEN: string;
  diplomaLevelFR: string;
  diplomaLevelEN: string;
  year: number;
  month: number | null;
  typeFR: string;
  typeEN: string;
}

interface EducationTableProps {
  educations: EducationRow[];
  translations: Lang;
  onEdit: (education: EducationRow) => void;
  onDelete: (educationId: number) => void;
}

const EducationTable = ({
  educations,
  translations,
  onEdit,
  onDelete,
}: EducationTableProps): ReactElement => {
  const columns: ColumnDef<EducationRow>[] = [
    {
      header: translations.messageAdminEducationColumnSchool,
      accessor: "school",
      className: "font-medium",
      headerClassName: "rounded-tl-2xl",
    },
    {
      header: translations.messageAdminEducationColumnTitle,
      accessor: "titleFR",
    },
    {
      header: translations.messageAdminEducationColumnDiploma,
      accessor: "diplomaLevelFR",
    },
    {
      header: translations.messageAdminEducationColumnYear,
      accessor: (row) =>
        row.month ? `${row.month}/${row.year}` : row.year,
    },
    {
      header: translations.messageAdminEducationColumnAction,
      accessor: (row) => {
        const actions: ActionItem<EducationRow>[] = [
          { icon: Pencil, label: "Edit", onClick: () => onEdit(row) },
          {
            icon: Trash,
            label: "Delete",
            onClick: () => onDelete(row.id),
            colorClass: "bg-red-500/90 hover:bg-red-500",
          },
        ];
        return <ActionButton row={row} actions={actions} />;
      },
      headerClassName: "rounded-tr-2xl",
    },
  ];

  return <Table columns={columns} data={educations} />;
};

export default EducationTable;
