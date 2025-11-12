import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import {
  useDeleteEducationMutation,
  GetEducationsListQuery,
} from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";

interface EducationDeleteDialogProps {
  educationId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetEducationsListQuery>
  >;
}

const EducationDeleteDialog = ({
  educationId,
  onClose,
  onRefresh,
}: EducationDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteEducationMutation] = useDeleteEducationMutation();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm = async (): Promise<void> => {
    if (!educationId) return;

    setLoading(true);

    try {
      const { data } = await deleteEducationMutation({
        variables: { id: educationId },
      });

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
