import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";

export interface SocialRow {
  id: number;
  title: string;
  url: string;
  tab: number;
}

interface SocialTableProps {
  socials: SocialRow[];
  translations: Lang;
  onEdit: (social: SocialRow) => void;
  onDelete: (socialId: number) => void;
}

const SocialTable: React.FC<SocialTableProps> = ({
  socials,
  translations,
  onEdit,
  onDelete,
}: SocialTableProps): ReactElement => {
  const columns: ColumnDef<SocialRow>[] = [
    {
      header: translations.messageAdminSocialColumnTitle,
      accessor: "title",
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSocialColumnUrl,
      accessor: (row) => (
        <a 
          href={row.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 truncate max-w-xs inline-block"
        >
          {row.url}
        </a>
      ),
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSocialColumnTab,
      accessor: "tab",
      className: "px-4 py-3 text-center",
    },
    {
      header: translations.messageAdminSocialColumnAction,
      accessor: (row) => {
        const actions: ActionItem<SocialRow>[] = [
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

  return <Table columns={columns} data={socials} />;
};

export default SocialTable;
