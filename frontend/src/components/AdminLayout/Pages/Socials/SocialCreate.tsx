import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextAdmin from "../../components/Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useCreateSocialMutation,
  CreateSocialInput,
  CreateSocialMutation,
} from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";


const defaultForm: CreateSocialInput = {
  title: "",
  url: "",
  tab: 0,
};

const SocialCreate = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm] = useState<CreateSocialInput>(defaultForm);
  const [createSocialMutation, { loading }] =
    useCreateSocialMutation();

  const handleChange = (
    e:
      | string
      | ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
  ): void => {
    if (typeof e === "string") {
      return;
    }

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const payload: CreateSocialInput = {
        ...form,
        tab: Number(form.tab),
      };

      const res = await createSocialMutation({
        variables: { data: payload },
      });

      const response= res.data?.createSocial;

      if (response?.code === 200) {
        showAlert(
          "success",
          translations.messageAdminSocialCreateSuccess
        );
        setForm(defaultForm);
      } else {
        showAlert(
          "error",
          translations.messageAdminSocialCreateError
        );
      }
    } catch {
      showAlert("error", translations.messageErrorServerOff);
    }
  };

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations.messageAdminSocialCreateTitle}
        </TextAdmin>
      }
    >
      {loading && <LoadingCustom />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="title"
          label={translations.messageAdminSocialInputTitle}
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g., GitHub, LinkedIn, Twitter"
        />

        {/* URL */}
        <InputField
          id="url"
          label={translations.messageAdminSocialInputUrl}
          name="url"
          type="url"
          value={form.url}
          onChange={handleChange}
          required
          placeholder={translations.messageAdminSocialInputUrlPlaceholder}
        />

        {/* Tab */}
        <InputField
          id="tab"
          label={translations.messageAdminSocialInputTab}
          name="tab"
          type="number"
          value={String(form.tab)}
          onChange={handleChange}
          required
          placeholder={translations.messageAdminSocialInputTabPlaceholder}
        />

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={loading ? translations.messageAdminSocialCreateLoading : translations.messageAdminSocialCreateConfirm}
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

SocialCreate.displayName = 'SocialCreate';

export default SocialCreate;
