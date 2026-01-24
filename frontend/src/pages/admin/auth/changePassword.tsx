import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useMutation, MutationResult, MutationFunction, FetchResult } from "@apollo/client";
import { useRouter, NextRouter } from "next/router";
import Lang from "@/lang/typeLang";
import { CHANGE_PASSWORD } from "@/requetes/mutations/user.mutations";
import { useUser, UserContextType } from "@/context/UserContext/UserContext";

export type ChangePasswordFormState = {
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordMutation = {
  changePassword: {
    message: string;
    code: number;
  };
};

export type ChangePasswordMutationVariables = {
  email: string;
  newPassword: string;
};

const ChangePasswordPage = (): React.ReactElement => {
  const router: NextRouter = useRouter();

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const { translations }: { translations: Lang } = useLang();
  const { user, loading: userLoading, refetch }: UserContextType = useUser();

  const [form, setForm]: [ChangePasswordFormState, React.Dispatch<React.SetStateAction<ChangePasswordFormState>>] = useState<ChangePasswordFormState>({
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, { loading }]: [
    MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>,
    MutationResult<ChangePasswordMutation>
  ] = useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(CHANGE_PASSWORD);

  useEffect((): void => {
    if (!userLoading) {
      if (!user) {
        const token: string | null = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          console.log("⚠️ Pas de token, redirection vers login");
          router.replace("/admin/auth/login");
        }
      } else if (user.isPasswordChange) {
        console.log("✅ Mot de passe déjà changé, redirection vers dashboard");
        router.replace("/admin/dashboard");
      }
    }
  }, [user, userLoading, router]);

  const handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value }: { name: string; value: string } = e.target;
    setForm((prev: ChangePasswordFormState): ChangePasswordFormState => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword: (e: FormEvent<HTMLFormElement | HTMLButtonElement | HTMLAnchorElement>) => Promise<void> = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement | HTMLAnchorElement>
  ): Promise<void> => {
    e.preventDefault();

    if (form.newPassword.length < 8) {
      showAlert("error", translations.messagePageChoicePasswordErrorMinLength);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showAlert("error", translations.messagePageChoicePasswordErrorMismatch);
      return;
    }

    if (!user?.email) {
      showAlert("error", translations.messagePageChoicePasswordErrorEmailNotFound);
      return;
    }

    try {
      const res: FetchResult<ChangePasswordMutation> = await changePassword({
        variables: {
          email: user.email,
          newPassword: form.newPassword,
        },
      });

      const response = res.data?.changePassword;

      if (response?.code === 200) {
        // console.log("✅ Mot de passe changé avec succès :", response.message);

        showAlert("success", translations.messagePageChoicePasswordSuccess);
        
        // Rafraîchir les données utilisateur pour mettre à jour isPasswordChange
        await refetch();
        
        // Rediriger vers le dashboard
        router.push("/admin/dashboard");
      } else if (response?.code === 400) {
        // console.warn("❌ Erreur de validation :", response.message);
        showAlert("error", response.message);
      } else if (response?.code === 500) {
        // console.error("❌ Erreur serveur :", response.message);
        showAlert("error", translations.messagePageChoicePasswordErrorServer);
      } else {
        // console.warn("⚠️ Autre erreur :", response?.message);
        showAlert("error", translations.messagePageChoicePasswordErrorUnexpected);
      }
    } catch (err: unknown) {
      // console.error("Erreur Apollo :", err);
      showAlert("error", translations.messagePageChoicePasswordErrorServer);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <AuthFormLayout title={translations.messagePageChoicePasswordTitle}>
      <form className="space-y-4" onSubmit={handleChangePassword}>
        <InputField
          id="change-password-new"
          label={translations.messagePageChoicePasswordNew}
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          name="newPassword"
        />
        <InputField
          id="change-password-confirm"
          label={translations.messagePageChoicePasswordConfirm}
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
        />

        <div className="flex justify-center">
          <ButtonCustom
            text={
              loading
                ? translations.messagePageChoicePasswordButton + "..."
                : translations.messagePageChoicePasswordButton
            }
            onClick={handleChangePassword}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ChangePasswordPage;
