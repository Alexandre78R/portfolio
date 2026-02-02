import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { GetUsersListQuery, DeleteUserMutation } from "@/types/graphql";
import { useDeleteUserAdmin } from "@/utils/hooks";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { FetchResult } from "@apollo/client/link/core/types";

interface UserDeleteDialogProps {
  userId: string | null;
  onClose: () => void;
  onRefresh: () => Promise<void | import('@apollo/client').ApolloQueryResult<GetUsersListQuery>>;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  userId,
  onClose,
  onRefresh,
}: UserDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const [deleteUserMutation] = useDeleteUserAdmin();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();

  const handleConfirm = async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);

    try {
      const result = await deleteUserMutation({ id: Number(userId) });

      if (result.data?.deleteUser?.code === 200) {
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
