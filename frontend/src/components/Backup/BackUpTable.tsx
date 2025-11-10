import React from "react";
import Table, { ColumnDef } from "../AdminLayout/components/Table/Table";
import BackupActions from "./BackupActions";
import { BackupFileInfo } from "../AdminLayout/Pages/BackUp/BackUpList";
import Lang from "@/lang/typeLang";

interface BackUpTableProps {
  backups: BackupFileInfo[];
  translations: Lang;
  onDelete: (fileName: string) => void;
}

export const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 B";
  const k: number = 1024;
  const sizes: string[]  = ["B", "KB", "MB", "GB", "TB"];
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });


const BackUpTable = ({
  backups,
  translations,
  onDelete,
}: BackUpTableProps): React.ReactElement => {
  const columns: ColumnDef<BackupFileInfo>[] = [
    {
      header: translations.messagePageBackUpListFileName,
      accessor: "fileName",
      className: "font-mono text-xs",
      headerClassName: "rounded-tl-2xl",
    },
    {
      header: translations.messagePageBackUpListSize,
      accessor: (row) => formatBytes(row.sizeBytes),
    },
    {
      header: translations.messagePageBackUpListDateCreated,
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      header: translations.messagePageBackUpListDateModified,
      accessor: (row) => formatDate(row.modifiedAt),
    },
    {
      header: translations.messagePageBackUpListAction,
      accessor: (row) => (
        <BackupActions row={row} onDelete={onDelete} />
      ),
      headerClassName: "rounded-tr-2xl",
    },
  ];

  return <Table columns={columns} data={backups} />;
};

export default BackUpTable;