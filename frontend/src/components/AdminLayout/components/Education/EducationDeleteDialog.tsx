import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import { useDeleteEducationAdmin } from "@/utils/hooks";
import { GetEducationsListQuery, DeleteEducationMutation } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { FetchResult, ApolloError } from "@apollo/client";

interface EducationDeleteDialogProps {
  educationId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetEducationsListQuery>
  >;
}

const EducationDeleteDialog: React.FC<EducationDeleteDialogProps> = ({
  educationId,
  onClose,
  onRefresh,
}: EducationDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const [deleteEducationMutation] = useDeleteEducationAdmin();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm: () => Promise<void> = async (): Promise<void> => {
    if (!educationId) return;

    setLoading(true);

    try {

      const result = await deleteEducationMutation({
        id: educationId,
      });
      
      const { data } = result;

      if (data?.deleteEducation?.code === 200) {
        showAlert("success", translations.messageAdminEducationDeleteSuccess);
        await onRefresh();
      } else {
        showAlert("error", translations.messageAdminEducationDeleteError);
      }
    } catch {
      showAlert("error", translations.messageAdminEducationDeleteError);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!educationId) return null;

  return (
    <ConfirmDialog
      open={true}
      title={translations.messageAdminEducationDeleteTitle}
      description={translations.messageAdminEducationDeleteDescription}
      confirmLabel={translations.messageAdminEducationDeleteConfirm}
      cancelLabel={translations.messageAdminEducationDeleteCancel}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmDisabled={loading}
    />
  );
};

export default EducationDeleteDialog;
