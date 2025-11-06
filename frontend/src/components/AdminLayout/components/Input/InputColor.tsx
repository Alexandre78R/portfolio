import React, { ChangeEvent, ReactNode } from "react";
import { TextField, TextFieldProps } from "@mui/material";

export interface InputColorProps {
  id: string;
  label: string | ReactNode;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  className?: string;
  sx?: TextFieldProps["sx"];
}

const InputColor: React.FC<InputColorProps> = ({
  id,
  label,
  value,
  onChange,
  name,
  required = true,
  className,
  sx,
}) => {
  return (
    <TextField
      id={id}
      label={label}
      type="color"
      variant="outlined"
      fullWidth
      required={required}
      value={value}
      onChange={onChange}
      name={name}
      className={`border border-gray-300 rounded-md ${className ?? ""}`}
      InputLabelProps={{
        shrink: true, // label toujours visible pour input type color
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "3rem", // pour que le input color soit visible
          padding: "0.2rem 0.5rem",
        },
        "& .MuiFormLabel-root": {
          fontWeight: "bold",
          color: "var(--primary-color)",
        },
        ...sx,
      }}
    />
  );
};

export default InputColor;