import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useDeleteUserMutation, GetUsersListQuery } from "@/types/graphql";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";

interface UserDeleteDialogProps {
  userId: string | null;
  onClose: () => void;
  onRefresh: () => Promise<void | import('@apollo/client').ApolloQueryResult<GetUsersListQuery>>;
}

const UserDeleteDialog = ({
  userId,
  onClose,
  onRefresh,
}: UserDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteUserMutation] = useDeleteUserMutation();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();

  const handleConfirm = async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);

    try {
      const { data } = await deleteUserMutation({ variables: { id: Number(userId) } });

      if (data?.deleteUser?.code === 200) {
        showAlert("success", translations.messageAdminUserDeleteSuccess);
        await onRefresh();
      } else {
        showAlert("error", translations.messageAdminUserDeleteError);
      }
    } catch (error) {
      showAlert("error", translations.messageAdminUserDeleteError);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!userId) return null;

  return (
    <ConfirmDialog
      open={true}
      title={translations.messageAdminUserDeleteTitle}
      description={translations.messageAdminUserDeleteDescription}
      confirmLabel={translations.messageAdminUserDeleteConfirm}
      cancelLabel={translations.messageAdminUserDeleteCancel}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmDisabled={loading}
    />
  );
};

export default UserDeleteDialog;
