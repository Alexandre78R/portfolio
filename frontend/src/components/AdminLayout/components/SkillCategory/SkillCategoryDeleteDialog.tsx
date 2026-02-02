import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import { useDeleteSkillCategoryAdmin } from "@/utils/hooks";
import { GetSkillsListQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { FetchResult } from "@apollo/client/link/core/types";

interface SkillCategoryDeleteDialogProps {
  categoryId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetSkillsListQuery>
  >;
}

const SkillCategoryDeleteDialog: React.FC<SkillCategoryDeleteDialogProps> = ({
  categoryId,
  onClose,
  onRefresh,
}: SkillCategoryDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>]  = useState<boolean>(false);

  const [deleteCategoryMutation] = useDeleteSkillCategoryAdmin();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm: () => Promise<void> = async (): Promise<void> => {
    if (!categoryId) return;

    setLoading(true);

    try {

      const result = await deleteCategoryMutation({
        id: categoryId,
      }); 

      const { data } = result;
      
      if (data?.deleteCategory?.code === 200) {
        showAlert("success", translations.messageAdminSkillCategoryDeleteSuccess);
        await onRefresh();
      } else {
        showAlert("error", translations.messageAdminSkillCategoryDeleteError);
      }
    } catch (err: Error | unknown) {
      // console.error("Mutation error:", err);
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
