import React, { useState, useEffect, ReactElement, useCallback, ChangeEvent } from "react";
import { X } from "lucide-react";
import { ApolloError } from "@apollo/client";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import TextAdmin from "@/components/AdminLayout/components/Text/TextAdmin";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import CustomToast from "@/components/ToastCustom/CustomToast";

/**
 * Interface for translation item
 */
interface TranslationItemDTO {
  readonly key: string;
  readonly value: string;
}

/**
 * Props for TranslationsEditModal component
 */
interface TranslationsEditModalProps {
  readonly translation: TranslationItemDTO;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (value: string) => Promise<void>;
  readonly isLoading: boolean;
  readonly error: ApolloError | undefined;
  readonly translations: Record<string, string>;
}

/**
 * Translations edit modal component
 * @description Provides interface for editing translation values
 */
const TranslationsEditModal = ({
  translation,
  isOpen,
  onClose,
  onSave,
  isLoading,
  error,
  translations,
}: TranslationsEditModalProps): ReactElement => {
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();
  const [editValue, setEditValue]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>(translation.value);
  const [isSaving, setIsSaving]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [saveError, setSaveError]: [string | null, React.Dispatch<React.SetStateAction<string | null>>] = useState<string | null>(null);

  /**
   * Update edit value when translation changes
   */
  useEffect((): void => {
    setEditValue(translation.value);
    setSaveError(null);
  }, [translation]);

  /**
   * Handle save button click
   */
  const handleSave: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!editValue.trim()) {
      setSaveError("Translation value cannot be empty");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSave(editValue);
      const successMessage: string =
        translations.messageAdminTranslationsEditSuccess ||
        "La traduction a été modifiée avec succès.";
      showAlert("success", successMessage);
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : "An error occurred while saving";
      setSaveError(errorMessage);
      console.error("Error saving translation:", err);
      const errorAlert: string =
        translations.messageAdminTranslationsEditError ||
        "Une erreur est survenue lors de la modification.";
      showAlert("error", errorAlert);
    } finally {
      setIsSaving(false);
    }
  }, [editValue, onSave, showAlert, translations.messageAdminTranslationsEditSuccess, translations.messageAdminTranslationsEditError]);

  /**
   * Handle textarea change
   */
  const handleValueChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    setEditValue(e.currentTarget.value);
    setSaveError(null);
    },
    []
  );

  /**
   * Handle close button click
   */
  const handleClose: () => void = useCallback((): void => {
    if (!isSaving) {
      onClose();
    }
  }, [isSaving, onClose]);

  if (!isOpen) return <></>;

  const titleLabel: string = translations.messageAdminTranslationsEditTitle || "Modifier la traduction";
  const valueLabel: string = translations.messageAdminTranslationsEditValue || "Valeur";
  const errorLabel: string = translations.messageAdminTranslationsEditError || "Une erreur est survenue";
  const cancelLabel: string = translations.messageAdminTranslationsEditCancel || "Annuler";
  const saveLabel: string = translations.messageAdminTranslationsEditSave || "Sauvegarder";
  const keyLabel: string = "Clé";

  const displayError: string = saveError || error?.message || "";
  const isButtonDisabled: boolean = isSaving || !editValue.trim();
  const isSavingText: string = isSaving ? "..." : saveLabel;

  return (
    <ModalCustom open={isOpen} onClose={handleClose} width="600px">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <TextAdmin type="h2">
          {titleLabel}
        </TextAdmin>
        <button
          type="button"
          onClick={handleClose}
          disabled={isSaving}
          className="text-red-500 disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div className="space-y-4">
        {/* Key Field (Read-only) */}
        <div className="space-y-2">
          <TextAdmin type="span" className="text-sm font-medium">
            {keyLabel}
          </TextAdmin>
          <p className="px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded font-mono text-sm text-gray-900 dark:text-gray-100 break-words">
            {translation.key}
          </p>
        </div>

        {/* Value Field (Editable) */}
        <InputField
          id="translation-value"
          label={valueLabel}
          value={editValue}
          onChange={handleValueChange}
          multiline={true}
          rows={5}
          placeholder="Enter translation value..."
          aria-label="Translation value"
        />

        {/* Error Alert */}
        {displayError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm" role="alert">
            <span className="font-medium">{errorLabel}:</span> {displayError}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 mt-6">
        <ButtonCustom
          type="button"
          onClick={handleClose}
          disable={isSaving}
          text={cancelLabel}
        />
        <ButtonCustom
          type="button"
          onClick={handleSave}
          disable={isButtonDisabled}
          text={isSavingText}
        />
      </div>
    </ModalCustom>
  );
};

TranslationsEditModal.displayName = "TranslationsEditModal";

export default TranslationsEditModal;
