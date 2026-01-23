import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import TextAdmin from "../Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import { X } from "lucide-react";
import { SocialRow } from "./SocialTable";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useUpdateSocialMutation,
  GetSocialsListQuery,
  UpdateSocialInput,
  useGetSocialByIdQuery,
} from "@/types/graphql";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";

interface SocialEditModalProps {
  social: SocialRow | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetSocialsListQuery>
  >;
}

export interface SocialFormData {
  id: number;
  title: string;
  url: string;
  tab: number;
}

const SocialEditModal = ({
  social,
  onClose,
  onRefresh,
}: SocialEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm] = useState<SocialFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateSocialMutation] = useUpdateSocialMutation();

  const { data, loading: socialLoading } = useGetSocialByIdQuery({
    variables: { id: social?.id ?? 0 },
    skip: !social,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getSocialById?.social) {
      const socialData = data.getSocialById.social;
      const newData: SocialFormData = {
        id: Number(socialData.id),
        title: socialData.title ?? "",
        url: socialData.url ?? "",
        tab: socialData.tab ?? 0,
      };
      setForm(newData);
    }
  }, [data]);

  if (!social) return null;

  if (socialLoading || !form) {
    return (
      <ModalCustom open={true} onClose={onClose} width="600px">
        <LoadingCustom />
      </ModalCustom>
    );
  }

  const handleChange = (
    e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    if (typeof e === "string") {
      return;
    } else {
      const { name, value } = e.target;
      if (name === "tab") {
        // Convertir tab en number immédiatement
        setForm((prev) => (prev ? { ...prev, [name]: Number(value) } : prev));
      } else {
        setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form) return;
    
    setLoading(true);
    
    try {
        console.log("Submitting form:", form);
      const updateData: UpdateSocialInput = {
        title: form.title,
        url: form.url,
        tab: Number(form.tab),
      };

      const { data } = await updateSocialMutation({
        variables: { id: Number(form.id), data: updateData },
      });

      if (data?.updateSocial?.code === 200) {
        showAlert("success", translations.messageAdminSocialEditSuccess);
        await onRefresh();
        onClose();
      } else {
        showAlert("error", translations.messageAdminSocialEditError);
      }
    } catch (err) {
      console.error("Mutation error:", err);
      showAlert("error", translations.messageAdminSocialEditError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom open={true} onClose={onClose} width="600px">
      <div className="mb-4 flex items-center justify-between">
        <TextAdmin type="h2">
          {translations.messageAdminSocialEditTitle}
        </TextAdmin>
        <button onClick={onClose} className="text-red-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="title"
          label={translations.messageAdminSocialInputTitle}
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <InputField
          id="url"
          label={translations.messageAdminSocialInputUrl}
          name="url"
          value={form.url}
          onChange={handleChange}
          required
        />
        <InputField
          id="tab"
          label={translations.messageAdminSocialInputTab}
          name="tab"
          type="number"
          value={String(form.tab)}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end gap-3 mt-6">
          <ButtonCustom text={translations.messageAdminSocialEditCancel} onClick={onClose} />
          <ButtonCustom
            text={translations.messageAdminSocialEditConfirm}
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </ModalCustom>
  );
};

export default SocialEditModal;
