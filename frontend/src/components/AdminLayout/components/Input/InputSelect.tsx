import React, { ReactElement, ChangeEvent } from "react";
import { TextFieldProps } from "@mui/material";

export interface SelectOption<T extends string | number> {
  readonly label: string;
  readonly value: T;
}

export interface InputSelectProps<T extends string | number> {
  readonly id: string;
  readonly label: string;
  readonly name: string;
  readonly value: T;
  readonly options: readonly SelectOption<T>[];
  readonly onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  readonly required?: boolean;
  readonly className?: string;
  readonly disabled?: boolean;
}

function InputSelect<T extends string | number>({
  id,
  label,
  name,
  value,
  options,
  onChange,
  required = false,
  className = "",
  disabled = false,
}: InputSelectProps<T>): ReactElement {
  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-bold text-primary mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-text-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value={0} disabled>
          Select an option...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

InputSelect.displayName = "InputSelect";

export default InputSelect;
