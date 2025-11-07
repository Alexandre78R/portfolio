import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import { useDeleteThemeMutation, GetThemesListQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";

interface ThemeDeleteDialogProps {
  themeId: string | null;
  onClose: () => void;
  onRefresh: () => Promise<void>; 
}

const ThemeDeleteDialog = ({
  themeId,
  onClose,
  onRefresh,
}: ThemeDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteThemeMutation] = useDeleteThemeMutation();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();

  const handleConfirm = async (): Promise<void> => {
    if (!themeId) return;

    setLoading(true);

    try {
      const id: number = Number(themeId);

      const { data } = await deleteThemeMutation({
        variables: { id },
      });

      if (data?.deleteTheme?.code === 200) {
        showAlert("success", translations.messageAdminThemeDeleteSuccess);
        await onRefresh();
      } else {
        showAlert("error", translations.messageAdminThemeDeleteError);
      }
    } catch (error) {
      showAlert("error", translations.messageAdminThemeDeleteError);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!themeId) return null;

  return (
    <ConfirmDialog
      open={true}
      title={translations.messageAdminThemeDeleteTitle}
      description={translations.messageAdminThemeDeleteDescription}
      confirmLabel={translations.messageAdminThemeDeleteConfirm}
      cancelLabel={translations.messageAdminThemeDeleteCancel}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmDisabled={loading} 
    />
  );
};

export default ThemeDeleteDialog;