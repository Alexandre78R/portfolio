import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import CustomTextField from "@/components/TextFieldCustom/TextFieldCustom";
import ButtonCustom from "@/components/Button/Button";

const LoginPage = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login cliqué !");
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <AuthFormLayout title="Connexion">
      <form className="space-y-4">
        <CustomTextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <CustomTextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="flex justify-center">
          <ButtonCustom
            text="Se connecter"
            onClick={handleLogin}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;