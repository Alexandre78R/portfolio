import { ChangeEvent, ReactElement, useState, useEffect, useCallback } from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import TextAdmin from "@/components/AdminLayout/components/Text/TextAdmin";
import HtmlEditor from "@/components/AdminLayout/components/Editor/HtmlEditor";
import ButtonCustom from "@/components/Button/Button";
import CustomToast from "@/components/ToastCustom/CustomToast";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import InputBoolean from "@/components/AdminLayout/components/Input/InputBoolean";
import { useLang } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";
import { FetchResult } from "@apollo/client";
import { UpdateAboutMeMutation, GetAboutMeByIdQuery, useGetAboutMeByIdQuery } from "@/types/graphql";
import { useUpdateAboutMeAdmin } from "@/utils/hooks";

interface AboutMeEditModalProps {
  aboutMeId: number | null;
  onClose: () => void;
  onRefresh: () => Promise<any>;
}

interface FormData {
  id: number;
  titleEN: string;
  titleFR: string;
  descriptionEN: string;
  descriptionFR: string;
  isVisible: boolean;
}

const AboutMeEditModal: React.FC<AboutMeEditModalProps> = ({
  aboutMeId,
  onClose,
  onRefresh,
}: AboutMeEditModalProps): ReactElement | null => {
  const { data, loading: loadingData } = useGetAboutMeByIdQuery({
    variables: { id: aboutMeId || 0 },
    skip: !aboutMeId,
  });

  const [updateAboutMeMutation, { loading }] = useUpdateAboutMeAdmin();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();
  const { translations }: { translations: Lang } = useLang();

  const [form, setForm]: [FormData, React.Dispatch<React.SetStateAction<FormData>>] =
    useState<FormData>({
      id: 0,
      titleEN: "",
      titleFR: "",
      descriptionEN: "",
      descriptionFR: "",
      isVisible: false,
    });

  useEffect(() => {
    const aboutMe = data?.getAboutMeById?.aboutMe;
    if (aboutMe) {
      setForm({
        id: Number(aboutMe.id),
        titleEN: aboutMe.titleEN || "",
        titleFR: aboutMe.titleFR || "",
        descriptionEN: aboutMe.descriptionEN || "",
        descriptionFR: aboutMe.descriptionFR || "",
        isVisible: aboutMe.isVisible ?? false,
      } as FormData);
    }
  }, [data]);

  const handleTitleFRChange: (content: string) => void = useCallback((content: string) => {
    setForm((prev) => ({ ...prev, titleFR: content }));
  }, []);

  const handleTitleENChange: (content: string) => void = useCallback((content: string) => {
    setForm((prev) => ({ ...prev, titleEN: content }));
  }, []);

  const handleDescriptionFRChange: (content: string) => void = useCallback((content: string) => {
    setForm((prev) => ({ ...prev, descriptionFR: content }));
  }, []);

  const handleDescriptionENChange: (content: string) => void = useCallback((content: string) => {
    setForm((prev) => ({ ...prev, descriptionEN: content }));
  }, []);

  const handleVisibleChange: (event: ChangeEvent<HTMLInputElement>) => void = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, isVisible: event.target.checked }));
  }, []);

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.titleFR || !form.titleEN || !form.descriptionFR || !form.descriptionEN) {
      showAlert(
        "error",
        translations.messageAdminAboutMeEditError || "Tous les champs sont requis."
      );
      return;
    }

    try {
      const res = await updateAboutMeMutation({
        data: {
          id: form.id,
          titleEN: form.titleEN,
          titleFR: form.titleFR,
          descriptionEN: form.descriptionEN,
          descriptionFR: form.descriptionFR,
          isVisible: form.isVisible,
        },
      });

      const response = res.data?.updateAboutMe;

      if (response?.code === 200) {
        showAlert(
          "success",
          translations.messageAdminAboutMeEditSuccess || "Modification réussie."
        );
        await onRefresh();
        onClose();
      } else if (response?.code === 409) {
        showAlert(
          "error",
          response.message || "Un About Me visible existe déjà."
        );
      } else {
        showAlert(
          "error",
          translations.messageAdminAboutMeEditError || "Échec de la modification."
        );
      }
    } catch (error) {
      console.error(error);
      showAlert(
        "error",
        translations.messageErrorServerOff || "Erreur serveur."
      );
    }
  };

  if (!aboutMeId) return null;

  return (
    <ModalCustom open={!!aboutMeId} onClose={onClose} width="90%">
      <div className="space-y-6 p-4 max-w-6xl mx-auto max-h-[80vh] overflow-y-auto">
        <TextAdmin type="h2">
          {translations.messageAdminAboutMeEditTitle || "Modifier About Me"}
        </TextAdmin>

        {loadingData && <LoadingCustom />}

        {!loadingData && (
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <TextAdmin type="p">
              {translations.messageAdminAboutMeInputTitleFR || "Titre (FR)"}
            </TextAdmin>
            <HtmlEditor content={form.titleFR} onChange={handleTitleFRChange} />
          </div>

          <div className="space-y-2">
            <TextAdmin type="p">
              {translations.messageAdminAboutMeInputTitleEN || "Titre (EN)"}
            </TextAdmin>
            <HtmlEditor content={form.titleEN} onChange={handleTitleENChange} />
          </div>

          <div className="space-y-2">
            <TextAdmin type="p">
              {translations.messageAdminAboutMeInputDescFR || "Description (FR)"}
            </TextAdmin>
            <HtmlEditor
              content={form.descriptionFR}
              onChange={handleDescriptionFRChange}
            />
          </div>

          <div className="space-y-2">
            <TextAdmin type="p">
              {translations.messageAdminAboutMeInputDescEN || "Description (EN)"}
            </TextAdmin>
            <HtmlEditor
              content={form.descriptionEN}
              onChange={handleDescriptionENChange}
            />
          </div>

          <InputBoolean
            id="aboutme-visible"
            label={translations.messageAdminAboutMeInputVisible || "Visible"}
            value={form.isVisible}
            onChange={handleVisibleChange}
          />

          <div className="flex gap-4 justify-end">
            <ButtonCustom
              text={translations.messageAdminAboutMeEditCancel || "Annuler"}
              type="button"
              onClick={onClose}
              disable={loading}
            />
            <ButtonCustom
              text={
                loading
                  ? translations.messageAdminAboutMeCreateLoading || "Sauvegarde..."
                  : translations.messageAdminAboutMeEditConfirm || "Sauvegarder"
              }
              type="submit"
              disable={loading}
            />
          </div>
          </form>
        )}
      </div>
    </ModalCustom>
  );
};

AboutMeEditModal.displayName = "AboutMeEditModal";

export default AboutMeEditModal;
