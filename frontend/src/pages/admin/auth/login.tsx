import React, { useState, ChangeEvent, FormEvent } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useMutation, MutationResult, MutationFunction } from "@apollo/client";
import {
  MutationDocument,
  MutationMutation,
  MutationMutationVariables,
} from "@/types/graphql";
import { useRouter, NextRouter } from "next/router";
import Lang from "@/lang/typeLang";

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

  const [login, { data, loading, error }]: [
    MutationFunction<MutationMutation, MutationMutationVariables>,
    MutationResult<MutationMutation>
  ] = useMutation<MutationMutation, MutationMutationVariables>(MutationDocument);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.target;
    setForm((prev: LoginFormState): LoginFormState => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    console.log("varible NEXT_PUBLIC_JWT_SECRET -->", process.env.NEXT_PUBLIC_JWT_SECRET);

    try {
      const res = await login({
        variables: {
          data: {
            email: form.email,
            password: form.password,
          },
        },
      });

      const response = res.data?.login;

      if (response?.code === 200) {
        console.log("✅ Connexion réussie :", response.message);
        showAlert("success", translations.messagePageLoginMessageSuccess);
        router.push("/404");
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
          onChange={handleChange}
          name="email"
        />
        <InputField
          id="login-password"
          label={translations.messagePageLoginInputPassword}
          type="password"
          value={form.password}
          onChange={handleChange}
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
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;