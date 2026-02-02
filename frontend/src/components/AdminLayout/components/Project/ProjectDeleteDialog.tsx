import { ReactElement } from "react";
import { useDeleteProjectAdmin } from "@/utils/hooks";
import ConfirmDialog from "@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import { FetchResult, ApolloError } from "@apollo/client";
import { DeleteProjectMutation, DeleteProjectMutationVariables } from "@/types/graphql";

interface ProjectDeleteDialogProps {
  projectId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<any>;
}

const ProjectDeleteDialog: React.FC<ProjectDeleteDialogProps> = ({
  projectId,
  onClose,
  onRefresh,
}: ProjectDeleteDialogProps): ReactElement | null => {
  const [deleteProjectMutation] = useDeleteProjectAdmin();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();
  const { translations }: { translations: Lang } = useLang();

  if (!projectId) return null;

  const handleConfirm: () => Promise<void> = async (): Promise<void> => {
    try {
      const result = await deleteProjectMutation({
        id: projectId,
      });
      const { data } = result;

      const response: { code: number; message?: string } | undefined = data?.deleteProject;

      if (response?.code === 200) {
        showAlert(
          "success",
          translations.messageAdminProjectDeleteSuccess || "Project deleted successfully"
        );
        await onRefresh();
        onClose();
      } else {
        showAlert(
          "error",
          response?.message || translations.messageAdminProjectDeleteError || "Failed to delete project"
        );
      }
    } catch (error) {
      console.error(error);
      showAlert(
        "error",
        translations.messageAdminProjectDeleteError || "Failed to delete project"
      );
    }
  };

  return (
    <ConfirmDialog
      open={Boolean(projectId)}
      title={translations.messageAdminProjectDeleteTitle || "Delete Project"}
      description={
        translations.messageAdminProjectDeleteDescription ||
        "Are you sure you want to delete this project? This action cannot be undone."
      }
      confirmLabel={translations.messageAdminProjectDeleteConfirm || "Delete"}
      cancelLabel={translations.messageAdminProjectDeleteCancel || "Cancel"}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
};

export default ProjectDeleteDialog;
