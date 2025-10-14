import React from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import ButtonCustom from "@/components/Button/Button";

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;                // Titre facultatif, default "Confirmation"
  description: string;           // Obligatoire
  confirmLabel?: string;         // Default "Confirmer"
  cancelLabel?: string;          // Default "Annuler"
  onConfirm: () => void;         // Fonction à exécuter sur confirmer
  onCancel: () => void;          // Fonction à exécuter sur annuler
  confirmDisabled?: boolean;     // Bouton confirmer désactivé
  cancelDisabled?: boolean;      // Bouton annuler désactivé
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
}): JSX.Element => {
  return (
    <ModalCustom
      open={open}
      onClose={onCancel}
      width={420}
      className="flex-col items-start"
    >
      <h2 className="text-lg font-semibold text-text mb-4">{title}</h2>
      <p className="text-sm text-text">{description}</p>
      <div className="w-full flex justify-end gap-3">
        <ButtonCustom
          text={cancelLabel}
          onClick={onCancel}
          disable={cancelDisabled}
        />
        <ButtonCustom
          text={confirmLabel}
          onClick={onConfirm}
          disable={confirmDisabled}
        />
      </div>
    </ModalCustom>
  );
};

export default ConfirmDialog;