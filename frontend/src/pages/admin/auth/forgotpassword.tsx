import { useState, ChangeEvent, FormEvent, ReactElement } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

export type ForgotPasswordFormState = {
  email: string;
};

const ForgotPasswordPage = (): ReactElement => {
  const { translations }: { translations : Lang } = useLang();

  const [form, setForm] = useState<ForgotPasswordFormState>({
    email: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setForm((prevForm: ForgotPasswordFormState) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Demande de réinitialisation envoyée !", form);
  };

  return (
    <AuthFormLayout title={translations?.messagePageForgotPasswordTitle}>
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        data-testid="forgot-password-form"
        noValidate
      >
        <InputField
          id="forgot-email"
          name="email"
          label={translations?.messagePageForgotPasswordEmail ?? ""}
          type="email"
          value={form.email}
          onChange={handleChange as any}
          required
        />
        <div className="flex justify-center">
          <ButtonCustom
            text={translations?.messagePageForgotPasswordButton ?? ""}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ForgotPasswordPage;