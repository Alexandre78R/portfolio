import React, { ReactElement, ChangeEvent, FormEvent, useState } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import ButtonCustom from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import InputColor from "../../components/Input/InputColor";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useCreateThemeMutation } from "@/types/graphql";
import Lang from "@/lang/typeLang";
import TextAdmin from "../../components/Text/TextAdmin";
import { CreateThemeInput } from "@/types/graphql";
import InputBoolean from "../../components/Input/InputBoolean";

const defaultTheme: CreateThemeInput = {
  name: "",
  nameEN: "",
  nameFR: "",
  visible: true,
  body: "#ffffff",
  scrollHandle: "#cccccc",
  scrollHandleHover: "#aaaaaa",
  primary: "#0000ff",
  secondary: "#00ff00",
  success: "#1C8036",
  error: "#AA2020",
  warn: "#EBCC2A",
  info: "#3B89FF",
  grey: "#7F7F7F",
  placeholder: "#A0AEC0",
  footer: "#000000",
  admin: "#000000",
  textDefault: "#F8F8FD",
  text100: "#FFFFFF",
  text200: "#E1E9CC",
  text300: "#CDCDCD",
  textButton: "#FFFFFF",
};

const ThemeCreate = (): ReactElement => {
  const { showAlert } = CustomToast();
  const { translations }: { translations: Lang } = useLang();

  const [form, setForm] = useState<CreateThemeInput>(defaultTheme);

  const [createThemeMutation, { loading }] = useCreateThemeMutation();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "visible") {
      setForm(prev => ({ ...prev, visible: value === "true" }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await createThemeMutation({ variables: { data: form } });
      const response = res.data?.createTheme;

      if (response?.code === 200) {
        showAlert("success", translations.messagePageAddNewThemesSucces);
      } else {
        showAlert("error",  translations.messagePageAddNewThemesError);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", translations.messageErrorServerOff);
    }
  };

  // Tous les champs couleurs
  const colorFields = [
    "body",
    "scrollHandle",
    "scrollHandleHover",
    "primary",
    "secondary",
    "success",
    "error",
    "warn",
    "info",
    "grey",
    "placeholder",
    "footer",
    "admin",
    "textDefault",
    "text100",
    "text200",
    "text300",
    "textButton",
  ] as const;

  return (
    <AuthFormLayout title={<TextAdmin type="h2">{translations.messagePageAddNewThemesTitleH2}</TextAdmin>}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Nom du thème */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            id="theme-name"
            label={translations.messagePageAddNewThemesInputThemeName}
            placeholder={translations.messagePageAddNewThemesInputThemeName}
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <InputField
            id="theme-nameEN"
            label={translations.messagePageAddNewThemesInputThemeNameEN}
            placeholder={translations.messagePageAddNewThemesInputThemeNameEN}
            name="nameEN"
            value={form.nameEN}
            onChange={handleChange}
            required
          />
          <InputField
            id="theme-nameFR"
            label={translations.messagePageAddNewThemesInputThemeNameFR}
            placeholder={translations.messagePageAddNewThemesInputThemeNameFR}
            name="nameFR"
            value={form.nameFR}
            onChange={handleChange}
            required
          />
        </div>

        {/* Visible */}
        <InputBoolean
          id="theme-visible"
          label={translations.messagePageAddNewThemesTextVisible}
          labelType="h3"
          name={translations.messagePageAddNewThemesTextVisible}
          value={form.visible}
          onChange={handleChange}
          className="text-primary my-4 w-1/3"
          optionClassName="scale-125 text-secondary"
          selectedClassName="bg-primary text-white"
        />

        {/* Colors */}
        <TextAdmin type="h3" className="mt-4">{translations.messagePageAddNewThemesTitleColors}</TextAdmin>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colorFields.map(field => (
            <InputColor
              key={field}
              id={`color-${field}`}
              label={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <ButtonCustom
            text={loading ? translations.messagePageAddNewThemesButtonTextLoading : translations.messagePageAddNewThemesButtonTextSucces}
            onClick={handleSubmit}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ThemeCreate;