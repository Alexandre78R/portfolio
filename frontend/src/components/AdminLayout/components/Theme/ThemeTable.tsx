import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";

export interface ThemeRow {
  id: string;
  name: string;
  nameEN: string;
  nameFR: string;
  visible: boolean;
}

interface ThemeTableProps {
  themes: ThemeRow[];
  translations: Lang;
  onEdit: (theme: ThemeRow) => void;
  onDelete: (themeId: string) => void;
}

const ThemeTable = ({
  themes,
  translations,
  onEdit,
  onDelete,
}: ThemeTableProps): ReactElement => {
  const columns: ColumnDef<ThemeRow>[] = [
    {
      header: translations.messageAdminThemeColumnName,
      accessor: "name",
      className: "font-medium",
      headerClassName: "rounded-tl-2xl",
    },
    {
      header: translations.messageAdminThemeColumnNameEN,
      accessor: "nameEN",
    },
    {
      header: translations.messageAdminThemeColumnNameFR,
      accessor: "nameFR",
    },
    {
      header: "Visible",
      accessor: (row) => (row.visible ? "✅" : "❌"),
    },
    {
      header: translations.messageAdminThemeColumnAction,
      accessor: (row) => {
        const actions: ActionItem<ThemeRow>[] = [
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

  return <Table columns={columns} data={themes} />;
};

export default ThemeTable;