import React, { ReactElement, useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import { useMutation } from "@apollo/client";
import { DELETE_SIGNATURE } from "@/requetes/mutations/signatures.mutations";
import { FetchResult } from "@apollo/client/link/core/types";
import CustomToast from "@/components/ToastCustom/CustomToast";

interface SignatureDeleteDialogProps {
  signatureId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<any>;
}

const SignatureDeleteDialog: React.FC<SignatureDeleteDialogProps> = ({
  signatureId,
  onClose,
  onRefresh,
}: SignatureDeleteDialogProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const [deleteSignatureMutation] = useMutation(DELETE_SIGNATURE);
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleConfirm: () => Promise<void> = async (): Promise<void> => {
    if (!signatureId) return;

    setLoading(true);

    try {
      const { data }: FetchResult = await deleteSignatureMutation({
        variables: { id: signatureId },
      });

      if (data?.deleteSignature?.code === 200) {
        showAlert("success", translations.messageAdminSignatureDeleteSuccess);
        await onRefresh();
      } else {
        showAlert("error", translations.messageAdminSignatureDeleteError);
      }
    } catch {
      showAlert("error", translations.messageAdminSignatureDeleteError);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!signatureId) return null;

  return (
    <ConfirmDialog
      open={true}
      title={translations.messageAdminSignatureDeleteTitle}
      description={translations.messageAdminSignatureDeleteDescription}
      confirmLabel={translations.messageAdminSignatureDeleteConfirm}
      cancelLabel={translations.messageAdminSignatureDeleteCancel}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmDisabled={loading}
    />
  );
};

export default SignatureDeleteDialog;
