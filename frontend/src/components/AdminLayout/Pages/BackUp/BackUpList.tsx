import React, { useState } from "react";
import { useListBackupsAdmin, useGenerateBackupAdmin, useDeleteBackupAdmin, BackupFileInfo } from "@/utils/hooks";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import ButtonCustom from "@/components/Button/Button";
import Lang from "@/lang/typeLang";
import BackUpTable from "@/components/AdminLayout/components/Backup/BackUpTable";
export type { BackupFileInfo } from "@/utils/hooks";
const BackUpList = (): React.ReactElement => {
  const { backups, loading, error, refetch } = useListBackupsAdmin();
  const { generateBackup } = useGenerateBackupAdmin();
  const { deleteBackup } = useDeleteBackupAdmin();

  const [openCreateDialog, setOpenCreateDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName]: [string | null, React.Dispatch<React.SetStateAction<string | null>>] = useState<string | null>(null);

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();
  const { translations }: { translations: Lang } = useLang();

  const handleGenerateBackup: () => Promise<void> = async (): Promise<void> => {
    try {
      const response = await generateBackup();
      if (response.data?.generateDatabaseBackup.code === 200) {
        showAlert("success", translations.messagePageBackUpCreatedSuccess);
        await refetch();
      } else {
        showAlert(
          "error",
          response.data?.generateDatabaseBackup.message ||
            translations.messagePageBackUpCreatedError1
        );
      }
    } catch {
      showAlert("error", translations.messagePageBackUpCreatedError2);
    } finally {
      setOpenCreateDialog(false);
    }
  };

  const handleDeleteBackup: () => Promise<void> = async (): Promise<void> => {
    if (!selectedFileName) return;

    try {
      const response = await deleteBackup(selectedFileName);

      if (response.data?.deleteBackupFile.code === 200) {
        showAlert("success", translations.messagePageBackUpDeletedSuccess);
        await refetch();
      } else {
        showAlert(
          "error",
          response.data?.deleteBackupFile.message ??
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
  if (error)
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

      {backups.length === 0 ? (
        <p className="p-4 text-primary">
          {translations.messagePageBackUpListEmpty}
        </p>
      ) : (
        <BackUpTable
          backups={backups}
          translations={translations}
          onDelete={(fileName) => {
            setSelectedFileName(fileName);
            setOpenDeleteDialog(true);
          }}
        />
      )}

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