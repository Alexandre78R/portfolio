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
import { useCreateSignatureAdmin } from "@/utils/hooks";
import { CreateSignatureInput } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import { FetchResult } from "@apollo/client/link/core/types";
import HtmlEditor from "@/components/AdminLayout/components/Editor/HtmlEditor";

const defaultForm: CreateSignatureInput = {
  name: "",
  description: "",
};

const SignaturesCreate: React.FC = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm]: [CreateSignatureInput, React.Dispatch<React.SetStateAction<CreateSignatureInput>>] = useState<CreateSignatureInput>(defaultForm);
  
  const [createSignatureMutation, { loading }] = useCreateSignatureAdmin();

  const handleChange: (e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void = (
    e:
      | string
      | ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
  ): void => {
    if (typeof e === "string") {
      return;
    }

    const { name, value }: { name: string; value: string } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit: (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => Promise<void> = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const payload: CreateSignatureInput = {
        name: form.name,
        description: form.description,
      };

      const res = await createSignatureMutation({
        data: payload,
      });

      const response = res.data?.createSignature;

      if (response?.code === 200 || response?.code === 201) {
        showAlert(
          "success",
          translations.messageAdminSignatureCreateSuccess
        );
        setForm(defaultForm);
      } else {
        showAlert(
          "error",
          translations.messageAdminSignatureCreateError
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
          {translations.messageAdminSignatureCreateTitle}
        </TextAdmin>
      }
    >
      {loading && <LoadingCustom />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="name"
          label={translations.messageAdminSignatureInputName}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder={translations.messageAdminSignatureInputNamePlaceholder}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            {translations.messageAdminSignatureInputDescription}
          </label>
          <HtmlEditor
            content={form.description}
            onChange={(content: string) => setForm({ ...form, description: content })}
            placeholder={translations.messageAdminSignatureInputDescriptionPlaceholder}
          />
        </div>

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={loading ? translations.messageAdminSignatureCreateLoading : translations.messageAdminSignatureCreateConfirm}
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

SignaturesCreate.displayName = 'SignaturesCreate';

export default SignaturesCreate;
