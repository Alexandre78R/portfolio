import React, { useState } from "react";
import {
  useGetBackupsListQuery,
  useGenerateDatabaseBackupMutation,
  useDeleteBackupFileMutation,
} from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Table, { ColumnDef} from "../../components/Table/Table";
import { Download, Eye, Trash } from "lucide-react";
import useCustomToast from "@/components/ToastCustom/CustomToast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import ButtonCustom from "@/components/Button/Button";

export interface BackupFileInfo {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
  modifiedAt: string;
}

const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 B";
  const k : number = 1024;
  const sizes:  string[] = ["B", "KB", "MB", "GB", "TB"];
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const BackUpList: React.FC = (): JSX.Element => {
  const { data, loading, error, refetch } = useGetBackupsListQuery();
  const [generateBackup] = useGenerateDatabaseBackupMutation();
  const [deleteBackupFile] = useDeleteBackupFileMutation();

  const { translations } = useLang();
  const { showAlert } = useCustomToast();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleOpenDialog = (): void => setOpenDialog(true);
  const handleCloseDialog = (): void => setOpenDialog(false);

  const handleGenerateBackup = async (): Promise<void> => {
    try {
      const response = await generateBackup();
      if (response.data?.generateDatabaseBackup.code === 200) {
        showAlert("success", translations.messagePageBackUpCreatedSuccess);
        await refetch();
      } else {
        showAlert("error", translations.messagePageBackUpCreatedError1);
      }
    } catch {
      showAlert("error", translations.messagePageBackUpCreatedError2);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleDeleteBackup = async (): Promise<void> => {
    if (!selectedFileName) return;

    try {
      const response = await deleteBackupFile({
        variables: { fileName: selectedFileName },
      });
      if (response.data?.deleteBackupFile.code === 200) {
        showAlert("success", translations.messagePageBackUpDeletedSuccess);
        await refetch();
      } else {
        showAlert(
          "error",
          response.data?.deleteBackupFile.message ||
            translations.messagePageBackUpDeletedError1
        );
      }
    } catch {
      showAlert("error", translations.messagePageBackUpDeletedError2);
    } finally {
      setSelectedFileName(null);
      setOpenDeleteDialog(false);
    }
  };

  if (loading) return <LoadingCustom />;
  if (error || !data?.listBackupFiles?.files)
    return (
      <p className="p-4 text-primary">
        {translations.messagePageBackUpListNotFound}
      </p>
    );

  const backups: BackupFileInfo[] = [...data.listBackupFiles.files].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
        <div className="flex gap-2">
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
          <button
            onClick={() => {
              setSelectedFileName(row.fileName);
              setOpenDeleteDialog(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary hover:text-secondary transition-colors"
          >
            <Trash className="h-4 w-4" />
          </button>
          {/* <ButtonCustom
              
            text={<Trash className="h-4 w-4" />}
            onClick={() => {
              setSelectedFileName(row.fileName);
              setOpenDeleteDialog(true);
            }}
          /> */}
        </div>
      ),
      headerClassName: "rounded-tr-2xl",
    },
  ];

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">{translations.messagePageBackUpListTitle}</TextAdmin>
      <ButtonCustom
        text={translations.messagePageBackUpButtomCreated}
        onClick={handleOpenDialog}
        disable={false}
        disableHover={false}
      />
      <Table columns={columns} data={backups} />
      <ConfirmDialog
        open={openDialog}
        title={translations.messagePageBackUpTitleConfirmCreated}
        description={translations.messagePageBackUpDescConfirmCreated}
        confirmLabel={translations.messagePageBackUpMessageButtonValideCreated}
        cancelLabel={translations.messagePageBackUpMessageButtonCancelCreated}
        onConfirm={handleGenerateBackup}
        onCancel={handleCloseDialog}
      />
      <ConfirmDialog
        open={openDeleteDialog}
        title={translations.messagePageBackUpTitleConfirmDeleted}
        description={translations.messagePageBackUpDescConfirmDeleted}
        confirmLabel={translations.messagePageBackUpMessageButtonValideDeleted}
        cancelLabel={translations.messagePageBackUpMessageButtonCancelDeleted}
        onConfirm={handleDeleteBackup}
        onCancel={() => {
          setSelectedFileName(null);
          setOpenDeleteDialog(false);
        }}
      />
    </div>
  );
};

export default BackUpList;