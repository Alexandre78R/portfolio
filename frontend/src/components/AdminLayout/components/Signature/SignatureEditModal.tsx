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
import { SignatureRow } from "./SignatureTable";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useUpdateSignatureAdmin } from "@/utils/hooks";
import { UpdateSignatureInput, GetSignatureByIdQuery, useGetSignatureByIdQuery } from "@/types/graphql";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import { FetchResult } from "@apollo/client/link/core/types";
import HtmlEditor from "@/components/AdminLayout/components/Editor/HtmlEditor";

interface SignatureEditModalProps {
  signature: SignatureRow | null;
  onClose: () => void;
  onRefresh: () => Promise<any>;
}

export interface SignatureFormData {
  id: number;
  name: string;
  description: string;
}

const SignatureEditModal: React.FC<SignatureEditModalProps> = ({
  signature,
  onClose,
  onRefresh,
}: SignatureEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm]: [SignatureFormData | null, React.Dispatch<React.SetStateAction<SignatureFormData | null>>] = useState<SignatureFormData | null>(null);
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [updateSignatureMutation] = useUpdateSignatureAdmin();

  const { data, loading: signatureLoading } = useGetSignatureByIdQuery({
    variables: { id: signature?.id ?? 0 },
    skip: !signature,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getSignatureById?.signature) {
      const signatureData = data.getSignatureById.signature;
      const newData: SignatureFormData = {
        id: Number(signatureData.id),
        name: signatureData.name ?? "",
        description: signatureData.description ?? "",
      } as SignatureFormData;
      setForm(newData);
    }
  }, [data]);

  if (!signature) return null;

  if (signatureLoading || !form) {
    return (
      <ModalCustom open={true} onClose={onClose} width="600px">
        <LoadingCustom />
      </ModalCustom>
    );
  }

  const handleChange: (e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void = (
    e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    if (typeof e === "string") {
      return;
    } else {
      const { name, value } = e.target;
      setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form) return;
    
    setLoading(true);
    
    try {
      const updateData: UpdateSignatureInput = {
        id: Number(form.id),
        name: form.name,
        description: form.description,
      };

      const result = await updateSignatureMutation({
        data: updateData,
      });
      
      const { data } = result;

      if (data?.updateSignature?.code === 200) {
        showAlert("success", translations.messageAdminSignatureEditSuccess);
        await onRefresh();
        onClose();
      } else {
        showAlert("error", translations.messageAdminSignatureEditError);
      }
    } catch (err) {
      console.error("Mutation error:", err);
      showAlert("error", translations.messageAdminSignatureEditError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom open={true} onClose={onClose} width="600px">
      <div className="mb-4 flex items-center justify-between">
        <TextAdmin type="h2">
          {translations.messageAdminSignatureEditTitle}
        </TextAdmin>
        <button onClick={onClose} className="text-red-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="name"
          label={translations.messageAdminSignatureInputName}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder={translations.messageAdminSignatureInputNamePlaceholder}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            {translations.messageAdminSignatureInputDescription}
          </label>
          <HtmlEditor
            content={form.description}
            onChange={(content: string) => setForm({ ...form, description: content })}
            placeholder={translations.messageAdminSignatureInputDescriptionPlaceholder}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <ButtonCustom
            text={translations.messageAdminSignatureEditCancel}
            type="button"
            onClick={onClose}
            disable={loading}
            className="bg-gray-500 hover:bg-gray-600"
          />
          <ButtonCustom
            text={loading ? translations.messageAdminSignatureCreateLoading : translations.messageAdminSignatureEditConfirm}
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </ModalCustom>
  );
};

export default SignatureEditModal;
