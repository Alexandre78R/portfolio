import { ReactElement } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_ABOUT_ME } from "@/requetes/mutations/aboutme.mutations";
import ConfirmDialog from "@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import { FetchResult } from "@apollo/client/link/core/types";
import { DeleteAboutMeMutation } from "@/types/graphql";

interface AboutMeDeleteDialogProps {
  aboutMeId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<any>;
}

const AboutMeDeleteDialog: React.FC<AboutMeDeleteDialogProps> = ({
  aboutMeId,
  onClose,
  onRefresh,
}: AboutMeDeleteDialogProps): ReactElement | null => {
  const [deleteAboutMeMutation] = useMutation<
    DeleteAboutMeMutation,
    { id: number }
  >(DELETE_ABOUT_ME);
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();
  const { translations }: { translations: Lang } = useLang();

  if (!aboutMeId) return null;

  const handleConfirm: () => Promise<void> = async (): Promise<void> => {
    try {
      const result: FetchResult<DeleteAboutMeMutation> = await deleteAboutMeMutation({
        variables: { id: aboutMeId },
      });
      const { data } = result;

      const response: { code: number; message?: string } | undefined = data?.deleteAboutMe;

      if (response?.code === 200) {
        showAlert(
          "success",
          translations.messageAdminAboutMeDeleteSuccess || "About Me supprimé avec succès"
        );
        await onRefresh();
        onClose();
      } else {
        showAlert(
          "error",
          response?.message ||
            translations.messageAdminAboutMeDeleteError ||
            "Échec de la suppression"
        );
      }
    } catch (error) {
      console.error(error);
      showAlert(
        "error",
        translations.messageAdminAboutMeDeleteError || "Échec de la suppression"
      );
    }
  };

  return (
    <ConfirmDialog
      open={Boolean(aboutMeId)}
      title={translations.messageAdminAboutMeDeleteTitle || "Supprimer About Me"}
      description={
        translations.messageAdminAboutMeDeleteDescription ||
        "Êtes-vous sûr de vouloir supprimer cet About Me ? Cette action est irréversible."
      }
      confirmLabel={translations.messageAdminAboutMeDeleteConfirm || "Supprimer"}
      cancelLabel={translations.messageAdminAboutMeDeleteCancel || "Annuler"}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
};

export default AboutMeDeleteDialog;
