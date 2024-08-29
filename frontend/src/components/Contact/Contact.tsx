import { useLang } from "@/context/Lang/LangContext";
import { useState, ChangeEvent, MouseEvent } from "react";
import { Typography } from "@mui/material";
import ButtonCustom from "@/components/Button/Button";
import CustomToast from "@/components/ToastCustom/CustomToast";
import InputField from "@/components/InputField/InputField";
import { useSendContactMutation } from "@/types/graphql";
import Captcha from "../Captcha/Captcha";

const Contact: React.FC = (): React.ReactElement => {

  const { translations } = useLang();
  const { showAlert } = CustomToast();
  const [sendContact] = useSendContactMutation();

  const [captchaValid, setCaptchaValid] = useState<boolean | null>(null);

  const handleCaptchaValidation = (isValid: boolean) => {
    setCaptchaValid(isValid);
  };

  const [formData, setFormData] = useState<{
    email: string;
    object: string;
    message: string;
  }>({
    email: "",
    object: "",
    message: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleClick: () => void = (): void => {
    const { email, object, message } = formData;

    if (!email || !object || !message) {
      showAlert("error", translations.messageErrorFillAllInput);
      return;
    }

    sendContact({
      variables: {
        data: formData,
      },
      onCompleted(data) {
        if (data?.sendContact.status) {
          showAlert("success", translations.messageSuccessFormulaireSend);
        } else {
          console.log("Oncompleted")
          showAlert("error", translations.messageErrorNotSend);
        }
      },
      onError(error) {
        let errorMessage: string = translations.messageErrorServerOff;
        if (error.message === "Invaid format email.") {
          errorMessage = translations.messageErrorFormatEmail;
        }
        showAlert("error", errorMessage);
      },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-body p-8 shadow-lg mt-8 text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <Typography variant="h3" component="h3" className="text-2xl font-bold text-text mb-6">
          {translations.nameFormulaireContact}
        </Typography>

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
            multiline
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
          />

          <ButtonCustom
            onClick={handleClick}
            text={translations.buttonSendMessageContact}
          />
        </form>
      </div>
      <Captcha onValidate={handleCaptchaValidation} />
    </div>
  );
};

export default Contact;