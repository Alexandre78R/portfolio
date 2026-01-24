import React, { ReactElement } from "react";
import {
  TextField,
  MenuItem,
  TextFieldProps,
} from "@mui/material";

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

export interface SelectFieldProps<T extends string> {
  id: string;
  label: string;
  name?: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  sx?: TextFieldProps["sx"];
}

function SelectField<T extends string>({
  id,
  label,
  name,
  value,
  options,
  onChange,
  required = true,
  className,
  sx,
}: SelectFieldProps<T>): ReactElement {
  return (
    <TextField
      id={id}
      select
      label={label}
      variant="outlined"
      fullWidth
      required={required}
      name={name}
      value={value}
      onChange={onChange}
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
        "& .MuiFormLabel-root.Mui-focused": {
          color: "var(--primary-color)",
          fontWeight: "bold",
          backgroundColor: "white",
        },
        ...sx,
      }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );

}

export default SelectField;
