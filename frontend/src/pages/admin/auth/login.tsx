import { useState, ChangeEvent, FormEvent } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextFieldCustom from "@/components/TextFieldCustom/TextFieldCustom";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    console.log("Login cliqué !");
    console.log("Email:", form.email);
    console.log("Password:", form.password);
  };

  return (
    <AuthFormLayout title={translations.messagePageLoginTitle}>
      <form className="space-y-4" onSubmit={handleLogin}>
        <TextFieldCustom
          label={translations.messagePageLoginInputEmail}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextFieldCustom
          label={translations.messagePageLoginInputPassword}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <div className="flex justify-center">
          <ButtonCustom
            text={translations.messagePageLoginInputButtom}
            onClick={handleLogin}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;