import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextAdmin from "../../../components/Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import {
  useCreateCategoryMutation,
  CreateCategoryInput,
} from "@/types/graphql";

/**
 * Default form values
 */
const defaultForm: CreateCategoryInput = {
  categoryEN: "",
  categoryFR: "",
};

const SkillCategoryCreate = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm] = useState<CreateCategoryInput>(defaultForm);
  const [createCategoryMutation, { loading }] = useCreateCategoryMutation();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Submit form
   */
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const res = await createCategoryMutation({
        variables: { data: form },
      });

      const response = res.data?.createCategory;

      if (response?.code === 200) {
        showAlert(
          "success",
          translations.messageAdminSkillCategoryCreateSuccess
        );
        setForm(defaultForm);
      } else {
        showAlert(
          "error",
          response?.message || translations.messageAdminSkillCategoryCreateError
        );
      }
    } catch (err) {
      console.error(err);
      showAlert("error", translations.messageErrorServerOff);
    }
  };

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations.messageAdminSkillCategoryCreateTitle}
        </TextAdmin>
      }
    >
      {loading && <LoadingCustom />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="categoryEN"
          name="categoryEN"
          label="Category (EN)"
          type="text"
          placeholder="e.g., Programming"
          value={form.categoryEN}
          onChange={handleChange}
          required
        />

        <InputField
          id="categoryFR"
          name="categoryFR"
          label="Category (FR)"
          type="text"
          placeholder="e.g., Programmation"
          value={form.categoryFR}
          onChange={handleChange}
          required
        />

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={
              loading
                ? translations.messageAdminSkillCategoryCreateLoading
                : translations.messageAdminSkillCategoryCreateConfirm
            }
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

SkillCategoryCreate.displayName = "SkillCategoryCreate";

export default SkillCategoryCreate;
