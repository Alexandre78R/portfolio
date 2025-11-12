import React, {
  ReactElement,
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextAdmin from "../../components/Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import SelectField from "../../components/Input/SelectField";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useCreateUserMutation } from "@/types/graphql";
import { SelectOption, UserRole, getUserRoleOptions } from "./user.type";

interface CreateUserForm {
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
}

const defaultForm: CreateUserForm = {
  firstname: "",
  lastname: "",
  email: "",
  role: UserRole.view,
};

const UserCreate = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert } = CustomToast();
  
  const [form, setForm] = useState<CreateUserForm>(defaultForm);
  
  const [createUserMutation, { loading }] = useCreateUserMutation();
  
  const USER_ROLE_OPTIONS: SelectOption<UserRole>[] = getUserRoleOptions(translations);
  
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const { data } = await createUserMutation({ variables: { data: form } });

      if (data?.registerUser.code === 201) {
        showAlert("success", translations.messageAdminUserCreateSuccess);
        setForm(defaultForm);
      } else {
        showAlert("error", translations.messageAdminUserCreateError);
      }
    } catch (err) {
      showAlert("error", translations.messageErrorServerOff);
    }
  };

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations.messageAdminUserCreateTitle}
        </TextAdmin>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Infos utilisateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="user-firstname"
            label={translations.messageAdminUserColumnFirstname}
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            required
          />

          <InputField
            id="user-lastname"
            label={translations.messageAdminUserColumnLastname}
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <InputField
          id="user-email"
          label={translations.messageAdminUserColumnEmail}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Role */}
        <SelectField<UserRole>
          id="user-role"
          label={translations.messageAdminUserColumnRole}
          name="role"
          value={form.role}
          options={USER_ROLE_OPTIONS}
          onChange={handleChange}
        />

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <ButtonCustom
            text={
              loading
                ? translations.messageAdminUserCreateLoading
                : translations.messageAdminUserCreateButton
            }
            onClick={handleSubmit}
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default UserCreate;