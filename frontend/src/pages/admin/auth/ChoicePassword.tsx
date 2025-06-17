import { useState, ChangeEvent, FormEvent } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";

type ChoicePasswordFormState = {
  password: string;
  newPassword: string;
};

const ChoicePasswordPage = (): React.ReactElement => {
  const { translations } = useLang();

  const [form, setForm] = useState<ChoicePasswordFormState>({
    password: "",
    newPassword: "",
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Changement de mot de passe !", form);
  };

  return (
    <AuthFormLayout title={translations?.messagePageChoicePasswordTitle}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="choice-password"
          name="password"
          label={translations?.messagePageChoicePasswordOld}
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <InputField
          id="choice-new-password"
          name="newPassword"
          label={translations?.messagePageChoicePasswordNew}
          type="password"
          value={form.newPassword}
          onChange={handleChange}
        />
        <div className="flex justify-center">
          <ButtonCustom
            text={translations?.messagePageChoicePasswordButton}
            onClick={handleSubmit}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ChoicePasswordPage;