import { useState, ChangeEvent, FormEvent, ReactElement } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useRouter, NextRouter } from "next/router";
import Lang from "@/lang/typeLang";
import { useForgotPassword } from "@/utils/hooks";

export type ForgotPasswordFormState = {
  email: string;
};

export type ForgotPasswordMutation = {
  forgotPassword: {
    message: string;
    code: number;
  };
};

export type ForgotPasswordMutationVariables = {
  data: {
    email: string;
    lang: "fr" | "en";
  };
};

const ForgotPasswordPage = (): ReactElement => {
  const router: NextRouter = useRouter();
  const { translations, lang }: { translations: Lang; lang: "fr" | "en" } = useLang();

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm] = useState<ForgotPasswordFormState>({
    email: "",
  });

  const [forgotPassword, { loading }] = useForgotPassword();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setForm((prevForm: ForgotPasswordFormState) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement | HTMLButtonElement>): Promise<void> => {
    event.preventDefault();

    if (!form.email) {
      showAlert("error", translations.messagePageForgotPasswordErrorInvalidEmail);
      return;
    }

    try {
      const res = await forgotPassword({
        data: {
          email: form.email,
          lang: lang,
        },
      });

      const response = res.data?.forgotPassword;

      if (response?.code === 200) {
        showAlert("success", translations.messagePageForgotPasswordSuccess);
        setForm({ email: "" });
        router.push("/admin/auth/login");
      } else if (response?.code === 500) {
        showAlert("error", translations.messagePageForgotPasswordErrorServer);
      } else {
        showAlert("error", translations.messagePageForgotPasswordErrorServer);
      }
    } catch (err: unknown) {
      console.error("Erreur Apollo :", err);
      showAlert("error", translations.messagePageForgotPasswordErrorServer);
    }
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
          onChange={handleChange}
          required
        />
        <div className="flex justify-center">
          <ButtonCustom
            text={
              loading
                ? translations?.messagePageForgotPasswordButton + "..."
                : translations?.messagePageForgotPasswordButton ?? ""
            }
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