import React, { ChangeEvent, ReactNode } from "react";
import { TextField, TextFieldProps } from "@mui/material";

export interface InputFieldProps {
  id: string;
  label: string | ReactNode;
  type?: string; // type limité aux types HTML valides
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number; // facultatif, utilisé seulement si multiline
  name?: string;
  required?: boolean; // ajouté pour plus de flexibilité
  className?: string; // optionnel pour override Tailwind classes
  sx?: TextFieldProps["sx"]; // permet d'étendre les styles MUI
  placeholder?: string; 
  
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  multiline = false,
  rows,
  name,
  required = true,
  className,
  sx,
  placeholder,
}) => {
  const rowsProp = multiline && rows ? rows : undefined;

  return (
    <TextField
      id={id}
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      required={required}
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={rowsProp}
      name={name}
      className={`bg-white border border-gray-300 rounded-md text-text ${className ?? ""}`}
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
        ...sx,
      }}
      placeholder={placeholder}
    />
  );
};

export default InputField;