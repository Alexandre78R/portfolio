import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useDeleteExperienceMutation, GetExperiencesListQuery, DeleteExperienceMutation  } from "@/types/graphql";
import { useLang } from "@/context/Lang/LangContext";
import { FetchResult } from "@apollo/client/link/core/types";

interface ExperienceDeleteDialogProps {
  experienceId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<void | import("@apollo/client").ApolloQueryResult<GetExperiencesListQuery>>;
}

const ExperienceDeleteDialog: React.FC<ExperienceDeleteDialogProps> = ({ experienceId, onClose, onRefresh }: ExperienceDeleteDialogProps): ReactElement | null => {
  
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const [deleteExperienceMutation] = useDeleteExperienceMutation();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm: () => Promise<void> = async () => {
    if (!experienceId) return;
    setLoading(true);
    try {
      const result: FetchResult<DeleteExperienceMutation> = await deleteExperienceMutation({ variables: { id: experienceId } });
      const { data } = result;
      if (data?.deleteExperience?.code === 200) {
        showAlert("success", translations.messageAdminExperienceDeleteSuccess);
        await onRefresh();
      } else showAlert("error", translations.messageAdminExperienceDeleteError);
    } catch {
      showAlert("error", translations.messageAdminExperienceDeleteError);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!experienceId) return null;

  return (
    <ConfirmDialog
      open={true}
      title={translations.messageAdminExperienceDeleteTitle}
      description={translations.messageAdminExperienceDeleteDescription}
      confirmLabel={translations.messageAdminExperienceDeleteConfirm}
      cancelLabel={translations.messageAdminExperienceDeleteCancel}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmDisabled={loading}
    />
  );
};

export default ExperienceDeleteDialog;
