import { useLang } from "@/context/Lang/LangContext";
import { useState, ChangeEvent, MouseEvent } from "react";
import { TextField, Typography } from "@mui/material";
import ButtonCustom from "../Button/Button";
import CustomToast from "../ToastCustom/CustomToast";

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

  const handleClick = () => {
    console.log(formData)
    showAlert("success", "Form submitted successfully");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-body p-8 shadow-lg mt-8 text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <Typography variant="h3" component="h3" className="text-2xl font-bold text-text mb-6">
          Contact
        </Typography>

        <form className="space-y-6 bg-body">
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={handleInputChange}
            className="bg-white border border-gray-300 rounded-md text-text"
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--primary-color)",
                borderWidth: "0.2rem",
              },
              "& .MuiFormLabel-root": {
                color: "var(--primary-color)",
                fontWeight: "bold",
                backgroundColor: "white",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiFormLabel-root": {
                color: "var(--primary-color)",
                fontWeight: "bold",
                backgroundColor: "white",
              },
            }}
          />

          <TextField
            id="object"
            label="Object"
            variant="outlined"
            fullWidth
            required
            value={formData.object}
            onChange={handleInputChange}
            className="bg-white border border-gray-300 rounded-md text-text"
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--primary-color)",
                borderWidth: "0.2rem",
              },
              "& .MuiFormLabel-root": {
                color: "var(--primary-color)",
                fontWeight: "bold",
                backgroundColor: "white",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiFormLabel-root": {
                color: "var(--primary-color)",
                fontWeight: "bold",
                backgroundColor: "white",
              },
            }}
          />

          <TextField
            id="message"
            label="Message"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            required
            value={formData.message}
            onChange={handleInputChange}
            className="bg-white border border-gray-300 rounded-md text-text"
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--primary-color)",
                borderWidth: "0.2rem",
              },
              "& .MuiFormLabel-root": {
                color: "var(--primary-color)",
                fontWeight: "bold",
                backgroundColor: "white",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiFormLabel-root": {
                color: "var(--primary-color)",
                fontWeight: "bold",
                backgroundColor: "white",
              },
            }}
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