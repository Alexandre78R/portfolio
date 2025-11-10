import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
  useEffect,
} from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import TextAdmin from "../Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import InputColor from "../Input/InputColor";
import InputBoolean from "../Input/InputBoolean";
import { X } from "lucide-react";
import { ThemeRow } from "../../Pages/Themes/ThemesList";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { 
  useUpdateThemeMutation, 
  GetThemesListQuery, 
  UpdateThemeInput,
  useGetThemeByIdQuery
} from "@/types/graphql";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";

interface ThemeEditModalProps {
  theme: ThemeRow | null;
  onClose: () => void;
  onRefresh: () => Promise<void | import('@apollo/client').ApolloQueryResult<GetThemesListQuery>>;
  onChange?: (updatedTheme: ThemeFormData) => void;
}

export interface ThemeFormData {
  id: string;
  name: string;
  nameEN: string;
  nameFR: string;
  visible: boolean;
  body: string;
  scrollHandle: string;
  scrollHandleHover: string;
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warn: string;
  info: string;
  grey: string;
  placeholder: string;
  admin: string;
  textDefault: string;
  text100: string;
  text200: string;
  text300: string;
  textButton: string;
}

const ThemeEditModal = ({
  theme,
  onClose,
  onRefresh,
  onChange,
}: ThemeEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm] = useState<ThemeFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateThemeMutation] = useUpdateThemeMutation();

  const { data: themeData, loading: themeLoading } = useGetThemeByIdQuery({
    variables: { id: Number(theme?.id) },
    skip: !theme?.id,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (themeData?.themeById?.theme) {
      const fullTheme = themeData.themeById.theme;
      const initialForm: ThemeFormData = {
        id: fullTheme.id,
        name: fullTheme.name,
        nameEN: fullTheme.nameEN ?? fullTheme.name,
        nameFR: fullTheme.nameFR ?? fullTheme.name,
        visible: fullTheme.visible ?? true,
        body: fullTheme.body ?? "#FFFFFF",
        scrollHandle: fullTheme.scrollHandle ?? "#CCCCCC",
        scrollHandleHover: fullTheme.scrollHandleHover ?? "#999999",
        primary: fullTheme.primary ?? "#000000",
        secondary: fullTheme.secondary ?? "#666666",
        success: fullTheme.success ?? "#00FF00",
        error: fullTheme.error ?? "#FF0000",
        warn: fullTheme.warn ?? "#FFA500",
        info: fullTheme.info ?? "#0000FF",
        grey: fullTheme.grey ?? "#808080",
        placeholder: fullTheme.placeholder ?? "#CCCCCC",
        admin: fullTheme.admin ?? "#000000",
        textDefault: fullTheme.textDefault ?? "#000000",
        text100: fullTheme.text100 ?? "#1a1a1a",
        text200: fullTheme.text200 ?? "#333333",
        text300: fullTheme.text300 ?? "#666666",
        textButton: fullTheme.textButton ?? "#FFFFFF",
      };
      setForm(initialForm);
      onChange?.(initialForm);
    } else if (!theme) {
      setForm(null);
    }
  }, [themeData, theme, onChange]);

  if (!theme) return null;

  if (themeLoading || !form) {
    return (
      <ModalCustom open={true} onClose={onClose} width="600px">
        <LoadingCustom />
      </ModalCustom>
    );
  }

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
    "admin",
    "textDefault",
    "text100",
    "text200",
    "text300",
    "textButton",
  ] as const;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    setForm(prev => {
      if (!prev) return prev;
      const updatedForm = type === "checkbox"
        ? { ...prev, [name]: (e.target as HTMLInputElement).checked }
        : { ...prev, [name]: value };
      onChange?.(updatedForm);
      return updatedForm;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);

    try {
      const updateData: UpdateThemeInput = {
        id: Number(form.id),
        name: form.name,
        nameEN: form.nameEN,
        nameFR: form.nameFR,
        visible: form.visible,
        body: form.body,
        scrollHandle: form.scrollHandle,
        scrollHandleHover: form.scrollHandleHover,
        primary: form.primary,
        secondary: form.secondary,
        success: form.success,
        error: form.error,
        warn: form.warn,
        info: form.info,
        grey: form.grey,
        placeholder: form.placeholder,
        admin: form.admin,
        textDefault: form.textDefault,
        text100: form.text100,
        text200: form.text200,
        text300: form.text300,
        textButton: form.textButton,
      };

      const { data } = await updateThemeMutation({
        variables: { data: updateData },
      });

      if (data?.updateTheme?.code === 200) {
        showAlert("success", translations.messageAdminThemeEditSave);
        await onRefresh();
        onClose();
      } else {
        showAlert("error", translations.messageAdminThemeEditError);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Erreur serveur !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom open={!!theme} onClose={onClose} width="600px">
      <div className="mb-4 flex w-full items-center justify-between">
        <TextAdmin type="h2">
          {translations.messageAdminThemeEditTitle}
        </TextAdmin>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField id="theme-name" label="Nom" name="name" value={form.name} onChange={handleChange}/>
          <InputField id="theme-nameEN" label="Nom EN" name="nameEN" value={form.nameEN} onChange={handleChange}/>
          <InputField id="theme-nameFR" label="Nom FR" name="nameFR" value={form.nameFR} onChange={handleChange}/>
        </div>

        <InputBoolean
          id="theme-visible"
          label="Visible"
          name="visible"
          value={form.visible}
          onChange={handleChange}
        />

        <TextAdmin type="h3" className="mt-4">Couleurs</TextAdmin>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colorFields.map(field => (
            <InputColor
              key={field}
              id={`theme-${field}`}
              label={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <ButtonCustom text={translations.messageAdminThemeEditCancel} onClick={onClose} disable={loading}/>
          <ButtonCustom text={translations.messageAdminThemeEditSave} type="submit" disable={loading}/>
        </div>
      </form>
    </ModalCustom>
  );
};

export default ThemeEditModal;