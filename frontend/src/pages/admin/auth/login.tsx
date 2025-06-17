import { useState, ChangeEvent, FormEvent } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import InputField from "@/components/InputField/InputField";
import { useMutation } from "@apollo/client";
import {
  MutationDocument,
  MutationMutation,
  MutationMutationVariables,
} from "@/types/graphql";

type LoginFormState = {
  email: string;
  password: string;
};

const LoginPage = (): React.ReactElement => {
  const { translations } = useLang();

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [login, { data, loading, error }] = useMutation<
    MutationMutation,
    MutationMutationVariables
  >(MutationDocument);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

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
        // TODO : set auth context / redirect
      } else {
        console.warn("❌ Erreur :", response?.message);
      }
    } catch (err) {
      console.error("Erreur Apollo :", err);
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

        {error && <p className="text-red-500 text-sm">{error.message}</p>}
        {data?.login?.code !== 200 && (
          <p className="text-red-500 text-sm">{data?.login?.message}</p>
        )}

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