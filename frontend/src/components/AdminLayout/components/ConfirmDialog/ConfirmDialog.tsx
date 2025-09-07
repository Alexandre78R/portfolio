import React from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import ButtonCustom from "@/components/Button/Button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirmation",
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  cancelDisabled = false,
}) => {
  return (
    <ModalCustom open={open} onClose={onCancel} width={420} className="flex-col items-start">
      <h2 className="text-lg font-semibold text-text mb-4">{title}</h2>
      <p className="text-sm text-text ">{description}</p>
      <div className="w-full flex justify-end gap-3">
        <ButtonCustom
          text={cancelLabel}
          onClick={onCancel}
          disable={cancelDisabled}
        />
        <ButtonCustom
          text={confirmLabel}
          onClick={onConfirm}
        />
      </div>
    </ModalCustom>
  );
};

export default ConfirmDialog;