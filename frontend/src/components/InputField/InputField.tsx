import React, { ChangeEvent, ReactNode } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export interface InputFieldProps {
  id: string;
  label: string | ReactNode;
  type?: string; // type HTML normal
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => void;
  multiline?: boolean;
  rows?: number;
  name?: string;
  required?: boolean;
  className?: string;
  sx?: TextFieldProps["sx"];
  placeholder?: string;
  picker?: "date"; // si date picker
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
  picker,
}) => {
  if (picker === "date") {
    const dateValue: Dayjs | null = value ? dayjs(value) : null;

    return (
      <DatePicker
        label={label}
        value={dateValue}
        onChange={(newValue: Dayjs | null) => {
          // on renvoie en string formatée "MMMM YYYY" par exemple
          if (newValue) onChange(newValue.format("MMMM YYYY"));
        }}
        slotProps={{
          textField: {
            id,
            required,
            fullWidth: true,
            name,
            className: `bg-white border border-gray-300 rounded-md text-text ${className ?? ""}`,
            sx: {
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--primary-color)",
                borderWidth: "0.2rem",
              },
              "& .MuiFormLabel-root": {
                color: "var(--primary-color)",
                fontWeight: "bold",
                backgroundColor: "white",
              },
              ...sx,
            },
            placeholder,
          },
        }}
      />
    );
  }

  // fallback : input classique
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      required={required}
      value={value}
      onChange={onChange as any}
      multiline={multiline}
      rows={multiline && rows ? rows : undefined}
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
        ...sx,
      }}
      placeholder={placeholder}
    />
  );
};

export default InputField;