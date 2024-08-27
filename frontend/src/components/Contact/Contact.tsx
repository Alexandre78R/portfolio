import { useLang } from "@/context/Lang/LangContext";
import { useState, ChangeEvent, MouseEvent } from "react";
import { Typography } from "@mui/material";
import ButtonCustom from "@/components/Button/Button";
import CustomToast from "@/components/ToastCustom/CustomToast";
import InputField from "@/components/InputField/InputField";

const Contact: React.FC = (): React.ReactElement => {
  const { translations } = useLang();
  const { showAlert } = CustomToast();

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
    console.log(formData);
    const { email, object, message } = formData;

    if (!email || !object || !message) {
      showAlert("error", "Veuillez remplir tous les champs avant de soumettre le formulaire.");
      return;
    }

    showAlert("success", "Merci pour votre message ! Je vous recontacterai dès que possible.");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-body p-8 shadow-lg mt-8 text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <Typography variant="h3" component="h3" className="text-2xl font-bold text-text mb-6">
          Contact
        </Typography>

        <form className="space-y-6 bg-body">
          <InputField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <InputField
            id="object"
            label="Object"
            value={formData.object}
            onChange={handleInputChange}
          />

          <InputField
            id="message"
            label="Message"
            multiline
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
          />

          <ButtonCustom
            onClick={handleClick}
            text="Send"
          />
        </form>
      </div>
    </div>
  );
};

export default Contact;