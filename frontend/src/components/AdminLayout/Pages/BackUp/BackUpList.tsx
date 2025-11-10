import React, { useState } from "react";
import {
  useGetBackupsListQuery,
  useGenerateDatabaseBackupMutation,
  useDeleteBackupFileMutation,
} from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import ButtonCustom from "@/components/Button/Button";
import Lang from "@/lang/typeLang";
import BackUpTable from "@/components/AdminLayout/components/Backup/BackUpTable";

export interface BackupFileInfo {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
  modifiedAt: string;
}

const BackUpList = (): React.ReactElement => {
  const { data, loading, error, refetch } = useGetBackupsListQuery();
  const [generateBackup] = useGenerateDatabaseBackupMutation();
  const [deleteBackupFile] = useDeleteBackupFileMutation();

  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();
  const { translations }: { translations: Lang } = useLang();

  const backups: BackupFileInfo[] =
    data?.listBackupFiles?.files
      ?.slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ) ?? [];

  const handleGenerateBackup = async (): Promise<void> => {
    try {
      const { data } = await generateBackup();
      if (data?.generateDatabaseBackup.code === 200) {
        showAlert("success", translations.messagePageBackUpCreatedSuccess);
        await refetch();
      } else {
        showAlert("error", translations.messagePageBackUpCreatedError1);
      }
    } catch {
      showAlert("error", translations.messagePageBackUpCreatedError2);
    } finally {
      setOpenCreateDialog(false);
    }
  };

  const handleDeleteBackup = async (): Promise<void> => {
    if (!selectedFileName) return;

    try {
      const { data } = await deleteBackupFile({
        variables: { fileName: selectedFileName },
      });

      if (data?.deleteBackupFile.code === 200) {
        showAlert("success", translations.messagePageBackUpDeletedSuccess);
        await refetch();
      } else {
        showAlert(
          "error",
          data?.deleteBackupFile.message ??
            translations.messagePageBackUpDeletedError1
        );
      }
    } catch {
      showAlert("error", translations.messagePageBackUpDeletedError2);
    } finally {
      setOpenDeleteDialog(false);
      setSelectedFileName(null);
    }
  };

  if (loading) return <LoadingCustom />;
  if (error || !data?.listBackupFiles?.files)
    return (
      <p className="p-4 text-primary">
        {translations.messagePageBackUpListNotFound}
      </p>
    );

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messagePageBackUpListTitle}
      </TextAdmin>

      <ButtonCustom
        text={translations.messagePageBackUpButtomCreated}
        onClick={() => setOpenCreateDialog(true)}
        disable={false}
        disableHover={false}
      />

      <BackUpTable
        backups={backups}
        translations={translations}
        onDelete={(fileName) => {
          setSelectedFileName(fileName);
          setOpenDeleteDialog(true);
        }}
      />

      <ConfirmDialog
        open={openCreateDialog}
        title={translations.messagePageBackUpTitleConfirmCreated}
        description={translations.messagePageBackUpDescConfirmCreated}
        confirmLabel={
          translations.messagePageBackUpMessageButtonValideCreated
        }
        cancelLabel={
          translations.messagePageBackUpMessageButtonCancelCreated
        }
        onConfirm={handleGenerateBackup}
        onCancel={() => setOpenCreateDialog(false)}
      />

      <ConfirmDialog
        open={openDeleteDialog}
        title={translations.messagePageBackUpTitleConfirmDeleted}
        description={translations.messagePageBackUpDescConfirmDeleted}
        confirmLabel={
          translations.messagePageBackUpMessageButtonValideDeleted
        }
        cancelLabel={
          translations.messagePageBackUpMessageButtonCancelDeleted
        }
        onConfirm={handleDeleteBackup}
        onCancel={() => setOpenDeleteDialog(false)}
      />
    </div>
  );
};

export default BackUpList;