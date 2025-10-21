import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";

import { useLang } from "@/context/Lang/LangContext";
import ButtonCustom from "@/components/Button/Button";
import CustomToast from "@/components/ToastCustom/CustomToast";
import InputField from "@/components/InputField/InputField";
import Captcha from "../Captcha/Captcha";
import TitleH3 from "../Title/TitleH3";

import { useSendContactMutation, SendContactMutation, SendContactMutationVariables } from "@/types/graphql";
import { checkRegex, emailRegex } from "@/regex";
import Lang from "@/lang/typeLang";

interface FormData {
  email: string;
  object: string;
  message: string;
}

const Contact: React.FC = (): React.ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();

  const [sendContact] = useSendContactMutation();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    object: "",
    message: "",
  });

  const [captchaValid, setCaptchaValid] = useState<boolean | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [authorizeGenerateCaptcha, setAuthorizeGenerateCaptcha] = useState<boolean>(false);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const handleCaptchaValidation = (isValid: boolean): void => {
    setCaptchaValid(isValid);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (!captchaValid) return;

    sendContact({
      variables: { data: formData } as SendContactMutationVariables,
      onCompleted: (data: SendContactMutation | undefined): void => {
        if (data?.sendContact.status) {
          showAlert("success", translations.messageSuccessFormulaireSend);
          setFormData({ email: "", object: "", message: "" });
          setCaptchaValid(false);
        } else {
          showAlert("error", translations.messageErrorNotSend);
          setCaptchaValid(true);
        }
      },
      onError: (error: Error): void => {
        console.error("Contact error:", error);
        const errorMessage: string =
          error.message === "Invaid format email."
            ? translations.messageErrorFormatEmail
            : translations.messageErrorServerOff;

        showAlert("error", errorMessage);
        setCaptchaValid(true);
        handleOpen();
      },
    });
  }, [captchaValid, formData, sendContact, showAlert, translations]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    const { email, object, message } : FormData = formData;

    if (!email || !object || !message) {
      showAlert("error", translations.messageErrorFillAllInput);
      return;
    }

    if (!checkRegex(emailRegex, email)) {
      showAlert("error", translations.messageErrorFormatEmail);
      return;
    }

    setAuthorizeGenerateCaptcha(true);
    handleOpen();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-body p-8 shadow-lg mt-8 text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <TitleH3 title={translations.nameFormulaireContact} />
        <form className="space-y-6 bg-body">
          <InputField
            id="email"
            label={translations.inputNameContactEmail}
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <InputField
            id="object"
            label={translations.inputNameContactObject}
            value={formData.object}
            onChange={handleInputChange}
          />
          <InputField
            id="message"
            label={translations.inputNameContactMessage}
            value={formData.message}
            multiline
            rows={6}
            onChange={handleInputChange}
          />
          <ButtonCustom
            onClick={handleClick}
            text={translations.buttonSendMessageContact}
          />
        </form>
      </div>
      {open && (
        <Captcha
          open={open}
          onClose={handleClose}
          onValidate={handleCaptchaValidation}
          authorizeGenerateCaptcha={authorizeGenerateCaptcha}
          setAuthorizeGenerateCaptcha={setAuthorizeGenerateCaptcha}
        />
      )}
    </div>
  );
};

export default Contact;