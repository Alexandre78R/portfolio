import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import {
  useDeleteSocialMutation,
  GetSocialsListQuery,
} from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";

interface SocialDeleteDialogProps {
  socialId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetSocialsListQuery>
  >;
}

const SocialDeleteDialog = ({
  socialId,
  onClose,
  onRefresh,
}: SocialDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteSocialMutation] = useDeleteSocialMutation();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm = async (): Promise<void> => {
    if (!socialId) return;

    setLoading(true);

    try {
      const { data } = await deleteSocialMutation({
        variables: { id: socialId },
      });

      if (data?.deleteSocial?.code === 200) {
        showAlert("success", translations.messageAdminSocialDeleteSuccess);
        await onRefresh();
      } else {
        showAlert("error", translations.messageAdminSocialDeleteError);
      }
    } catch {
      showAlert("error", translations.messageAdminSocialDeleteError);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!socialId) return null;

  return (
    <ConfirmDialog
      open={true}
      title={translations.messageAdminSocialDeleteTitle}
      description={translations.messageAdminSocialDeleteDescription}
      confirmLabel={translations.messageAdminSocialDeleteConfirm}
      cancelLabel={translations.messageAdminSocialDeleteCancel}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmDisabled={loading}
    />
  );
};

export default SocialDeleteDialog;
