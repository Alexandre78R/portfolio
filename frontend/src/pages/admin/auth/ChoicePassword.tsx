import { useState, ChangeEvent, FormEvent, ReactElement } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

export type ChoicePasswordFormState = {
  password: string;
  newPassword: string;
};

const ChoicePasswordPage = (): ReactElement => {

  const { translations }: { translations: Lang } = useLang();

  const [form, setForm] = useState<ChoicePasswordFormState>({
    password: "",
    newPassword: "",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value }: { name: string; value: string } = event.target;
    setForm((prev: ChoicePasswordFormState) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Changement de mot de passe !", form);
  };

  return (
    <AuthFormLayout title={translations?.messagePageChoicePasswordTitle ?? ""}>
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        data-testid="choice-password-form"
        noValidate
      >
        <InputField
          id="choice-password"
          name="password"
          label={translations?.messagePageChoicePasswordOld ?? ""}
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <InputField
          id="choice-new-password"
          name="newPassword"
          label={translations?.messagePageChoicePasswordNew ?? ""}
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <div className="flex justify-center">
          <ButtonCustom
            text={translations?.messagePageChoicePasswordButton ?? ""}
            onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ChoicePasswordPage;