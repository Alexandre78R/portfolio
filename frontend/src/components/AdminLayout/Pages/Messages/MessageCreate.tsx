import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useSendMessageMutation,
  SendMessageMutation,
  SendMessageMutationVariables,
} from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import HtmlEditor from "../../components/Editor/HtmlEditor";
import { FetchResult } from "@apollo/client";
import TextAdmin from "../../components/Text/TextAdmin";

interface MessageFormState {
  readonly subject: string;
  readonly content: string;
  readonly recipients: string;
}

interface ToastActions {
  readonly showAlert: (
    type: "success" | "error",
    message: string
  ) => void;
}

const DEFAULT_FORM_STATE: MessageFormState = {
  subject: "",
  content: "",
  recipients: "",
};

const MessageCreate = (): ReactElement => {
  const langContext = useLang();
  const translations = langContext?.translations || {};
  const { showAlert }: ToastActions = CustomToast();

  const [form, setForm] = useState<MessageFormState>(DEFAULT_FORM_STATE);
  const [sendMessageMutation, { loading }] = useSendMessageMutation();

  const handleChange = (
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

  const handleContentChange = (content: string): void => {
    setForm((prev: MessageFormState): MessageFormState => ({
      ...prev,
      content,
    }));
  };

  const validateForm = (): boolean => {
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

  const handleSubmit = async (
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
      } else {
        const errorMessage: string =
          response?.message || translations?.messageAdminMessageError || "Une erreur s'est produite";
        showAlert("error", errorMessage);
      }
    } catch (error: unknown) {
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
        <p>toto,  dfojdsdsfjdsl</p>
        <TextAdmin type="h5">{translations?.messageAdminEditorCodeTitle || "; dclmldsxÉditeur HTML"}</TextAdmin>
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            {translations?.messageAdminMessageContent || "Contenu"}
          </label>
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
