import React, { useState, ChangeEvent, FormEvent } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useRouter, NextRouter } from "next/router";
import Link from "next/link";
import Lang from "@/lang/typeLang";
import { useLogin } from "@/utils/hooks";

export type LoginFormState = {
  email: string;
  password: string;
};

const LoginPage = (): React.ReactElement => {

  const router: NextRouter = useRouter();

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const { translations }: { translations: Lang } = useLang();

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [login, { loading }] = useLogin();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.target;
    setForm((prev: LoginFormState): LoginFormState => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    try {
      const res = await login({
        email: form.email,
        password: form.password,
      });

      const response = res.data?.login;

      if (response?.code === 200) {
        console.log("✅ Connexion réussie :", response.message);
      
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        
        showAlert("success", translations.messagePageLoginMessageSuccess);
        if (process.env.NODE_ENV === "test") {
          router.push("/admin");
        } else {
          window.location.href = "/admin";
        }
      } else if (response?.code === 401) {
        console.warn("❌ Identifiants invalides :", response.message);
        showAlert("error", translations.messagePageLoginMessageErrorServer);
      } else if (response?.code === 500) {
        console.error("❌ Erreur serveur :", response.message);
        showAlert("error", translations.messagePageLoginMessageErrorUnexpected);
      } else {
        console.warn("⚠️ Autre erreur :", response?.message);
        showAlert("error", translations.messagePageLoginMessageErrorServer);
      }
    } catch (err: unknown) {
      console.error("Erreur Apollo :", err);
      showAlert("error", "Erreur serveur : veuillez réessayer plus tard.");
    }
  };

  return (
    <AuthFormLayout title={translations.messagePageLoginTitle}>
      <form className="space-y-4" onSubmit={handleLogin}>
        <InputField
          id="login-email"
          label={translations.messagePageLoginInputEmail}
          type="email"
          value={form.email}
          onChange={handleChange as any}
          name="email"
        />
        <InputField
          id="login-password"
          label={translations.messagePageLoginInputPassword}
          type="password"
          value={form.password}
          onChange={handleChange as any}
          name="password"
        />

        <div className="flex justify-center">
          <ButtonCustom
            text={
              loading
                ? translations.messagePageLoginInputButtom + "..."
                : translations.messagePageLoginInputButtom
            }
            onClick={handleLogin}
          />
        </div>

        <div className="flex justify-center mt-4">
          <Link href="/admin/auth/forgotpassword">
            <span className="text-primary hover:text-secondary cursor-pointer text-sm">
              {translations.messagePageForgotPasswordTitle}
            </span>
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;