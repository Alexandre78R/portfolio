import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import {
  useDeleteSkillCategoryMutation,
  GetSkillsListQuery,
} from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";

interface SkillCategoryDeleteDialogProps {
  categoryId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetSkillsListQuery>
  >;
}

const SkillCategoryDeleteDialog = ({
  categoryId,
  onClose,
  onRefresh,
}: SkillCategoryDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteCategoryMutation] = useDeleteSkillCategoryMutation();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm = async (): Promise<void> => {
    if (!categoryId) return;

    setLoading(true);

    try {
      const { data } = await deleteCategoryMutation({
        variables: { id: categoryId },
      });

      if (data?.deleteCategory?.code === 200) {
        showAlert("success", translations.messageAdminSkillCategoryDeleteSuccess);
        await onRefresh();
      } else {
        showAlert("error", translations.messageAdminSkillCategoryDeleteError);
      }
    } catch {
      showAlert("error", translations.messageAdminSkillCategoryDeleteError);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!categoryId) return null;

  return (
    <ConfirmDialog
      open={true}
      title={translations.messageAdminSkillCategoryDeleteTitle}
      description={translations.messageAdminSkillCategoryDeleteDescription}
      confirmLabel={translations.messageAdminSkillCategoryDeleteConfirm}
      cancelLabel={translations.messageAdminSkillCategoryDeleteCancel}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmDisabled={loading}
    />
  );
};

export default SkillCategoryDeleteDialog;
