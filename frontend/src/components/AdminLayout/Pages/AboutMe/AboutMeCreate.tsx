import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextAdmin from "../../components/Text/TextAdmin";
import HtmlEditor from "../../components/Editor/HtmlEditor";
import ButtonCustom from "@/components/Button/Button";
import InputBoolean from "@/components/AdminLayout/components/Input/InputBoolean";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import {
  CreateAboutMeInput,
  CreateAboutMeMutation,
  useCreateAboutMeMutation,
} from "@/types/graphql";
import { FetchResult } from "@apollo/client";

const defaultForm: CreateAboutMeInput = {
  titleEN: "",
  titleFR: "",
  descriptionEN: "",
  descriptionFR: "",
  isVisible: false,
};

const AboutMeCreate: React.FC = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm]: [CreateAboutMeInput, React.Dispatch<React.SetStateAction<CreateAboutMeInput>>] =
    useState<CreateAboutMeInput>(defaultForm);

  const [createAboutMeMutation, { loading }] = useCreateAboutMeMutation();

  const handleTitleFRChange: (content: string) => void = (content: string): void => {
    setForm((prev) => ({ ...prev, titleFR: content }));
  };

  const handleTitleENChange: (content: string) => void = (content: string): void => {
    setForm((prev) => ({ ...prev, titleEN: content }));
  };

  const handleDescriptionFRChange: (content: string) => void = (content: string): void => {
    setForm((prev) => ({ ...prev, descriptionFR: content }));
  };

  const handleDescriptionENChange: (content: string) => void = (content: string): void => {
    setForm((prev) => ({ ...prev, descriptionEN: content }));
  };

  const handleVisibleChange: (event: ChangeEvent<HTMLInputElement>) => void = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, isVisible: event.target.checked }));
  };

  const handleSubmit: (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => Promise<void> = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!form.titleEN || !form.titleFR || !form.descriptionEN || !form.descriptionFR) {
      showAlert("error", translations.messageErrorFieldsRequired || "Tous les champs sont requis.");
      return;
    }

    try {
      const res: FetchResult<CreateAboutMeMutation> = await createAboutMeMutation({
        variables: {
          data: {
            titleEN: form.titleEN,
            titleFR: form.titleFR,
            descriptionEN: form.descriptionEN,
            descriptionFR: form.descriptionFR,
            isVisible: form.isVisible,
          },
        },
      });

      const response = res.data?.createAboutMe;

      if (response?.code === 201) {
        showAlert("success", translations.messageAdminAboutMeCreateSuccess);
        setForm(defaultForm);
      } else if (response?.code === 409) {
        showAlert("error", translations.messageAdminAboutMeCreateError);
      } else {
        showAlert("error", translations.messageAdminAboutMeCreateError);
      }
    } catch {
      showAlert("error", translations.messageErrorServerOff);
    }
  };

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations.messageAdminAboutMeCreateTitle}
        </TextAdmin>
      }
    >
      {loading && <LoadingCustom />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Titre FR */}
        <div className="space-y-2">
          <label className="text-primary font-medium">
            {translations.messageAdminAboutMeInputTitleFR}
          </label>
          <HtmlEditor content={form.titleFR} onChange={handleTitleFRChange} />
        </div>

        {/* Titre EN */}
        <div className="space-y-2">
          <label className="text-primary font-medium">
            {translations.messageAdminAboutMeInputTitleEN}
          </label>
          <HtmlEditor content={form.titleEN} onChange={handleTitleENChange} />
        </div>

        {/* Description FR */}
        <div className="space-y-2">
          <label className="text-primary font-medium">
            {translations.messageAdminAboutMeInputDescFR}
          </label>
          <HtmlEditor
            content={form.descriptionFR}
            onChange={handleDescriptionFRChange}
          />
        </div>

        {/* Description EN */}
        <div className="space-y-2">
          <label className="text-primary font-medium">
            {translations.messageAdminAboutMeInputDescEN}
          </label>
          <HtmlEditor
            content={form.descriptionEN}
            onChange={handleDescriptionENChange}
          />
        </div>

        {/* Visible */}
        <InputBoolean
          id="aboutme-visible"
          label={translations.messageAdminAboutMeInputVisible}
          value={form.isVisible}
          onChange={handleVisibleChange}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <ButtonCustom
            type="submit"
            disable={loading}
            className="px-6 py-3 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
            text={
              loading
                ? translations.messageAdminAboutMeCreateLoading || "Chargement..."
                : translations.messageAdminAboutMeCreateConfirm || "Créer"
            }
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default AboutMeCreate;
