import React, { ReactElement } from "react";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

interface ThemeDeleteDialogProps {
  themeId: string | null;
  onClose: () => void;
}

const ThemeDeleteDialog = ({
  themeId,
  onClose,
}: ThemeDeleteDialogProps): ReactElement => {
  const { translations }: { translations: Lang } = useLang();

  const handleConfirm = async (): Promise<void> => {
    if (!themeId) return;
    console.log("Delete theme:", themeId);
    onClose();
  };

  return (
    <ConfirmDialog
      open={!!themeId}
      title={translations.messageAdminThemeDeleteTitle}
      description={
        translations.messageAdminThemeDeleteDescription
      }
      confirmLabel={
        translations.messageAdminThemeDeleteConfirm
      }
      cancelLabel={
        translations.messageAdminThemeDeleteCancel
      }
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
};

export default ThemeDeleteDialog;
