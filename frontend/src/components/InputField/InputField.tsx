import React, { ChangeEvent } from "react";
import { TextField } from "@mui/material";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  multiline = false,
  rows,
}) => {
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      required
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={rows}
      className="bg-white border border-gray-300 rounded-md text-text"
      sx={{
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
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
  );
};

export default InputField;
