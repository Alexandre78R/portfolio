import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import InputSelect, { SelectOption } from "@/components/AdminLayout/components/Input/InputSelect";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useSendMessageMutation,
  SendMessageMutation,
  SendMessageMutationVariables,
  useGetSignaturesListQuery,
} from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import HtmlEditor from "../../components/Editor/HtmlEditor";
import { FetchResult } from "@apollo/client";
import TextAdmin from "../../components/Text/TextAdmin";

interface MessageFormState {
  readonly subject: string;
  readonly content: string;
  readonly recipients: string;
  readonly selectedSignatureId: string;
}

interface SignatureData {
  readonly id: number | string;
  readonly name: string;
  readonly description: string;
}

const DEFAULT_FORM_STATE: MessageFormState = {
  subject: "",
  content: "",
  recipients: "",
  selectedSignatureId: "",
};

const MessageCreate: React.FC = (): ReactElement => {
  const langContext: { translations: Lang } = useLang();
  const translations: Lang = langContext?.translations || {};
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();

  const [form, setForm]: [MessageFormState, React.Dispatch<React.SetStateAction<MessageFormState>>] = useState<MessageFormState>(DEFAULT_FORM_STATE);
  const [contentWithoutSignature, setContentWithoutSignature]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [appliedSignatureId, setAppliedSignatureId]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const isApplyingSignature: React.MutableRefObject<boolean> = React.useRef<boolean>(false);
  const [sendMessageMutation, { loading }] = useSendMessageMutation();
  const { data: signaturesData } = useGetSignaturesListQuery({
    fetchPolicy: "cache-and-network",
  });

  const signatures: SignatureData[] = React.useMemo(
    (): SignatureData[] => {
      if (!signaturesData?.listAllSignatures?.signatures) {
        return [];
      }
      return (signaturesData.listAllSignatures.signatures as any[])
        .filter((sig): sig is NonNullable<typeof sig> => !!sig)
        .map((sig) => ({
          id: Number(sig.id),
          name: sig.name,
          description: sig.description,
        }));
    },
    [signaturesData]
  );

  const signatureOptions: readonly SelectOption<string>[] = React.useMemo(
    (): readonly SelectOption<string>[] => [
      {
        label: translations?.messageAdminMessageSelectSignature || "-- Choisir une signature --",
        value: "",
      },
      ...signatures.map((sig): SelectOption<string> => ({
        label: sig.name,
        value: sig.id.toString(),
      })),
    ],
    [signatures, translations]
  );

  const handleChange: (e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void = (
    e:
      | string
      | ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
  ): void => {
    if (typeof e === "string") {
      return;
    }

    const { name, value }: { name: string; value: string } = e.target;

    setForm((prev: MessageFormState): MessageFormState => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange: (content: string) => void = (content: string): void => {
    if (isApplyingSignature.current) {
      return;
    }
    let cleanContent: string = content;
    
    if (appliedSignatureId) {
      const currentSignature: SignatureData | undefined = signatures.find(
      (sig): boolean => sig.id.toString() === appliedSignatureId
      );
      
      if (currentSignature) {
        const sigWithBreak: string = `<br />${currentSignature.description}`;
        const sigWithoutBreak: string = currentSignature.description;
        
        if (content.includes(sigWithBreak)) {
          cleanContent = content.replace(sigWithBreak, "");
        } else if (content.includes(sigWithoutBreak)) {
          cleanContent = content.replace(sigWithoutBreak, "");
        }
      }
    }

    setContentWithoutSignature(cleanContent);
    setForm((prev: MessageFormState): MessageFormState => ({
      ...prev,
      content,
      selectedSignatureId: "",
    }));
  };

  const applySignature: (signatureId: string) => void = (signatureId: string): void => {
    isApplyingSignature.current = true;

    if (!signatureId) {
      setForm((prev: MessageFormState): MessageFormState => ({
        ...prev,
        content: contentWithoutSignature,
        selectedSignatureId: "",
      }));
      setAppliedSignatureId("");
      setTimeout(() => {
        isApplyingSignature.current = false;
      }, 0);
      return;
    }

    const selectedSignature: SignatureData | undefined = signatures.find(
      (sig): boolean => sig.id.toString() === signatureId
    );

    if (!selectedSignature) {
      isApplyingSignature.current = false;
      return;
    }

    const baseContent: string = contentWithoutSignature.trim();
    const signatureHtml: string = selectedSignature.description;
    const endsWithBlock: boolean = /<\/(p|div|ul|ol|li|blockquote|h[1-6])>\s*$/i.test(baseContent);
    const signatureStartsWithBlock: boolean = /^\s*<(p|div|ul|ol|li|blockquote|h[1-6])(?:\s|>)/i.test(
      signatureHtml
    );
    const separator: string = baseContent && !endsWithBlock && !signatureStartsWithBlock ? "<br />" : "";
    const newContent: string = baseContent
      ? `${baseContent}${separator}${signatureHtml}`
      : signatureHtml;

    setForm((prev: MessageFormState): MessageFormState => ({
      ...prev,
      content: newContent,
      selectedSignatureId: signatureId,
    }));
    setAppliedSignatureId(signatureId);

    setTimeout(() => {
      isApplyingSignature.current = false;
    }, 0);
  };

  const validateForm: () => boolean = (): boolean => {
    if (!form.subject.trim()) {
      showAlert("error", translations?.messageAdminMessageSubjectRequired || "Le sujet est requis");
      return false;
    }

    if (!form.content.trim()) {
      showAlert("error", translations?.messageAdminMessageContentRequired || "Le contenu est requis");
      return false;
    }

    if (!form.recipients.trim()) {
      showAlert("error", translations?.messageAdminMessageRecipientsRequired || "Les destinataires sont requis");
      return false;
    }

    return true;
  };

  const handleSubmit: (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => Promise<void> = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const variables: SendMessageMutationVariables = {
        subject: form.subject.trim(),
        content: form.content,
        recipients: form.recipients.trim(),
      };

      const result: FetchResult<SendMessageMutation> =
        await sendMessageMutation({
          variables,
        });

      const response = result?.data?.sendMessage;

      if (response?.code === 200) {
        showAlert("success", translations?.messageAdminMessageSuccess || "Message envoyé avec succès");
        setForm(DEFAULT_FORM_STATE);
        setContentWithoutSignature("");
      } else {
        const errorMessage: string =
          response?.message || translations?.messageAdminMessageError || "Une erreur s'est produite";
        showAlert("error", errorMessage);
      }
    } catch (error: Error | unknown) {
      const errorMessage: string =
        error instanceof Error
          ? error.message
          : (translations?.messageAdminMessageSendError || "Erreur lors de l'envoi du message");
      console.error("Error sending message:", errorMessage);
      showAlert("error", errorMessage);
    }
  };

  if (loading) return <LoadingCustom />;

  return (
    <AuthFormLayout title={translations?.messageAdminMessageCreateTitle || "Créer un message"}>
      <TextAdmin type="h5">{translations?.messageAdminEditorCodeTitle || "Éditeur HTML"}</TextAdmin>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          id="subject"
          label={translations?.messageAdminMessageSubject || "Sujet"}
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder={translations?.messageAdminMessagePlaceholderSubject || "Entrez le sujet"}
          required
        />

        <InputField
          id="recipients"
          label={translations?.messageAdminMessageRecipients || "Destinataires"}
          type="text"
          name="recipients"
          value={form.recipients}
          onChange={handleChange}
          placeholder={translations?.messageAdminMessagePlaceholderRecipients || "Entrez les destinataires"}
          required
        />

        <InputSelect<string>
          id="signature-select"
          label={translations?.messageAdminMessageSignature || "Sélectionner une signature"}
          name="signature-select"
          value={form.selectedSignatureId}
          options={signatureOptions}
          onChange={(e: ChangeEvent<HTMLSelectElement>): void => applySignature(e.target.value)}
        />

        <div className="space-y-2">
          <TextAdmin type="p">{translations?.messageAdminMessageContent || "Contenu"}</TextAdmin>
          <HtmlEditor
            content={form.content}
            onChange={handleContentChange}
          />
        </div>

        <div className="flex gap-4">
          <ButtonCustom
            onClick={handleSubmit}
            type="submit"
            text={translations?.messageAdminMessageSend || "Envoyer"}
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default MessageCreate;
