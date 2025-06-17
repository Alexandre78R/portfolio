import { useState, ChangeEvent, FormEvent } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";

type ForgotPasswordFormState = {
  email: string;
};

const ForgotPasswordPage = (): React.ReactElement => {
  const { translations } = useLang();

  const [form, setForm] = useState<ForgotPasswordFormState>({
    email: "",
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
    console.log("Demande de réinitialisation envoyée !", form);
  };

  return (
    <AuthFormLayout title={translations?.messagePageForgotPasswordTitle}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="forgot-email"
          name="email"
          label={translations?.messagePageForgotPasswordEmail}
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <div className="flex justify-center">
          <ButtonCustom
            text={translations?.messagePageForgotPasswordButton}
            onClick={handleSubmit}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ForgotPasswordPage;