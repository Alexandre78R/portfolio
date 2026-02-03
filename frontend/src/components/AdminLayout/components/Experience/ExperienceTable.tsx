// ExperienceTable.tsx
import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";

export interface ExperienceRow {
  id: number;
  jobEN: string;
  jobFR: string;
  business: string;
  employmentContractEN: string;
  employmentContractFR: string;
  startDateEN: string;
  startDateFR: string;
  endDateEN: string;
  endDateFR: string;
  month: number;
  typeEN: string;
  typeFR: string;
}

interface ExperienceTableProps {
  experiences: ExperienceRow[];
  translations: Lang;
  onEdit: (experience: ExperienceRow) => void;
  onDelete: (experienceId: number) => void;
}

const ExperienceTable: React.FC<ExperienceTableProps> = ({
  experiences,
  translations,
  onEdit,
  onDelete,
}: ExperienceTableProps): ReactElement => {
  const columns: ColumnDef<ExperienceRow>[] = [
    {
      header: translations.messageAdminExperienceColumnJob,
      accessor: "jobFR",
      className: "font-medium",
      headerClassName: "rounded-tl-2xl",
    },
    { header: translations.messageAdminExperienceColumnBusiness, accessor: "business" },
    { header: translations.messageAdminExperienceColumnContract, accessor: "employmentContractFR" },
    {
      header: translations.messageAdminExperienceColumnYear,
      accessor: (row) =>
        row.month ? `${row.month}/${new Date(row.startDateFR).getFullYear()}` : new Date(row.startDateFR).getFullYear(),
    },
    {
      header: translations.messageAdminExperienceColumnAction,
      accessor: (row) => {
        const actions: ActionItem<ExperienceRow>[] = [
          { icon: Pencil, label: "Edit", onClick: () => onEdit(row) },
          { icon: Trash, label: "Delete", onClick: () => onDelete(row.id), colorClass: "bg-red-500/90 hover:bg-red-500" },
        ];
        return <ActionButton row={row} actions={actions} />;
      },
      headerClassName: "rounded-tr-2xl",
    },
  ];

  return <Table columns={columns} data={experiences} />;
};

export default ExperienceTable;
