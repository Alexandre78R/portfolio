import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash, Check, X } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";

export interface AboutMeRow {
  id: number;
  titleEN: string;
  titleFR: string;
  descriptionEN: string;
  descriptionFR: string;
  isVisible: boolean;
}

interface AboutMeTableProps {
  aboutMes: AboutMeRow[];
  translations: Lang;
  onEdit: (aboutMe: AboutMeRow) => void;
  onDelete: (aboutMeId: number) => void;
}

const AboutMeTable: React.FC<AboutMeTableProps> = ({
  aboutMes,
  translations,
  onEdit,
  onDelete,
}: AboutMeTableProps): ReactElement => {
  const columns: ColumnDef<AboutMeRow>[] = [
    {
      header: translations.messageAdminAboutMeColumnTitleFR,
      accessor: (row: AboutMeRow) => {
        const div: HTMLDivElement = document.createElement("div");
        div.innerHTML = row.titleFR;
        return div.textContent || div.innerText || "";
      },
      className: "font-medium max-w-xs truncate",
      headerClassName: "rounded-tl-2xl",
    },
    {
      header: translations.messageAdminAboutMeColumnTitleEN,
      accessor: (row: AboutMeRow) => {
        const div: HTMLDivElement = document.createElement("div");
        div.innerHTML = row.titleEN;
        return div.textContent || div.innerText || "";
      },
      className: "max-w-xs truncate",
    },
    {
      header: translations.messageAdminAboutMeColumnVisible,
      accessor: (row: AboutMeRow) => (
        <div className="flex items-center justify-center">
          {row.isVisible ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span>{translations.messageAdminAboutMeVisibleYes}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <X className="w-5 h-5" />
              <span>{translations.messageAdminAboutMeVisibleNo}</span>
            </div>
          )}
        </div>
      ),
      className: "text-center",
    },
    {
      header: translations.messageAdminAboutMeColumnAction,
      accessor: (row: AboutMeRow) => {
        const actions: ActionItem<AboutMeRow>[] = [
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

  return <Table columns={columns} data={aboutMes} />;
};

export default AboutMeTable;
