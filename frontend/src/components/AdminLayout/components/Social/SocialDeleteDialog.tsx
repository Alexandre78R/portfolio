import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import {
  GetSocialsListQuery,
  DeleteSocialMutation,
} from "@/types/graphql";
import { useDeleteSocialAdmin } from "@/utils/hooks";
import { FetchResult } from "@apollo/client/link/core/types";
import CustomToast from "@/components/ToastCustom/CustomToast";

interface SocialDeleteDialogProps {
  socialId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetSocialsListQuery>
  >;
}

const SocialDeleteDialog: React.FC<SocialDeleteDialogProps> = ({
  socialId,
  onClose,
  onRefresh,
}: SocialDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const [deleteSocialMutation] = useDeleteSocialAdmin();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm: () => Promise<void> = async (): Promise<void> => {
    if (!socialId) return;

    setLoading(true);

    try {
      const result = await deleteSocialMutation({
        id: socialId,
      });

      if (result.data?.deleteSocial?.code === 200) {
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
