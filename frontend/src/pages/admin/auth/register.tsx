import { useState, ChangeEvent, FormEvent } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";
import CustomSelect from "@/components/CustomSelect/CustomSelect";

type RegisterFormState = {
  email: string;
  prenom: string;
  nom: string;
  role: "admin" | "editor" | "view";
};

const RegisterPage = (): React.ReactElement => {
  const { translations } = useLang();

  const [form, setForm] = useState<RegisterFormState>({
    email: "",
    prenom: "",
    nom: "",
    role: "view",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (event: any) => {
    setForm((prev) => ({
      ...prev,
      role: event.target.value as RegisterFormState["role"],
    }));
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    console.log("Register cliqué !", form);
  };

  return (
    <AuthFormLayout title={translations?.messagePageRegisterTitle}>
      <form className="space-y-4" onSubmit={handleRegister}>
        <InputField
          id="register-email"
          name="email"
          label={translations?.messagePageRegisterEmail}
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          id="register-prenom"
          name="prenom"
          label={translations?.messagePageRegisterFirstName}
          value={form.prenom}
          onChange={handleChange}
        />
        <InputField
          id="register-nom"
          name="nom"
          label={translations?.messagePageRegisterLastName}
          value={form.nom}
          onChange={handleChange}
        />
        <CustomSelect
          id="register-role"
          label={translations?.messagePageRegisterRole}
          name="role"
          value={form.role}
          onChange={handleRoleChange}
          options={[
            { value: "admin", label: "admin" },
            { value: "editor", label: "editor" },
            { value: "view", label: "view" },
          ]}
        />
        <div className="flex justify-center">
          <ButtonCustom
            text={translations?.messagePageRegisterButtom}
            onClick={handleRegister}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default RegisterPage;
