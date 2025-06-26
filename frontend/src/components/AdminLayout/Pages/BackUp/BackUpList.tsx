import React from "react";
import { useGetBackupsListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Download, Eye } from "lucide-react";

const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

interface BackupFileInfo {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
  modifiedAt: string;
}

const BackUpList = (): React.ReactElement => {
  const { data, loading, error } = useGetBackupsListQuery();
  const { translations } = useLang();

  if (loading) return <LoadingCustom />;
  if (error || !data?.listBackupFiles?.files)
    return (
      <p className="p-4 text-primary">
        {"Erreur lors du chargement des fichiers de sauvegarde."}
      </p>
    );

  const backups: BackupFileInfo[] = data.listBackupFiles.files;

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
        <>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/backups/${row.fileName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary hover:text-secondary transition-colors"
          >
            <Eye className="h-4 w-4" />
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/backups/${row.fileName}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary hover:text-secondary transition-colors"
          >
            <Download className="h-4 w-4" />
          </a>
        </>
      ),
      headerClassName: "rounded-tr-2xl",
    },
  ];

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">{translations.messagePageBackUpListTitle}</TextAdmin>
      <Table columns={columns} data={backups} />
    </div>
  );
};

export default BackUpList;