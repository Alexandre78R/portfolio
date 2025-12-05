import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import {
  useDeleteSkillMutation,
  GetSkillsListQuery,
} from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";

interface SkillDeleteDialogProps {
  skillId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetSkillsListQuery>
  >;
}

const SkillDeleteDialog = ({
  skillId,
  onClose,
  onRefresh,
}: SkillDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteSkillMutation] = useDeleteSkillMutation();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm = async (): Promise<void> => {
    if (!skillId) return;

    setLoading(true);

    try {
      const { data } = await deleteSkillMutation({
        variables: { id: skillId },
      });

      if (data?.deleteSkill?.code === 200) {
        showAlert("success", translations.messageAdminSkillDeleteSuccess || "Skill deleted successfully!");
        await onRefresh();
      } else {
        showAlert("error", translations.messageAdminSkillDeleteError || "Error deleting skill");
      }
    } catch {
      showAlert("error", translations.messageAdminSkillDeleteError || "Error deleting skill");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!skillId) return null;

  return (
    <ConfirmDialog
      open={true}
      title={translations.messageAdminSkillDeleteTitle || "Delete Skill"}
      description={translations.messageAdminSkillDeleteDescription || "Are you sure you want to delete this skill?"}
      confirmLabel={translations.messageAdminSkillDeleteConfirm || "Delete"}
      cancelLabel={translations.messageAdminSkillDeleteCancel || "Cancel"}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmDisabled={loading}
    />
  );
};

export default SkillDeleteDialog;
