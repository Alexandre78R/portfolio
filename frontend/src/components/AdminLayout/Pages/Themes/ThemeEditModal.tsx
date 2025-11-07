import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
  useEffect,
} from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import ButtonCustom from "@/components/Button/Button";
import { X } from "lucide-react";
import { ThemeRow } from "./ThemesList";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

interface ThemeEditModalProps {
  theme: ThemeRow | null;
  onClose: () => void;
}

const ThemeEditModal = ({
  theme,
  onClose,
}: ThemeEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const [form, setForm] = useState<ThemeRow | null>(theme);

  useEffect(() => {
    setForm(theme);
  }, [theme]);

  if (!form) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    console.log("Update theme:", form);
    onClose();
  };

  return (
    <ModalCustom open={!!theme} onClose={onClose} width="520px">
      <div className="mb-4 flex w-full items-center justify-between">
        <TextAdmin type="h2">
          {translations.messageAdminThemeEditTitle}
        </TextAdmin>

        <button onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          name="nameEN"
          value={form.nameEN}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          name="nameFR"
          value={form.nameFR}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
        />

        <div className="flex justify-end gap-3 pt-4">
          <ButtonCustom
            text={translations.messageAdminThemeEditCancel}
            onClick={onClose}
            disable={false}
            disableHover={false}
          />
          <ButtonCustom
            text={translations.messageAdminThemeEditSave}
            type="submit"
            disable={false}
            disableHover={false}
          />
        </div>
      </form>
    </ModalCustom>
  );
};

export default ThemeEditModal;