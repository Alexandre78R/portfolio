import React, { ChangeEvent, ReactNode } from "react";
import TextAdmin, { TextAdminType } from "../../components/Text/TextAdmin";

export interface InputColorProps {
  id: string;
  label: string | ReactNode;
  labelType?: TextAdminType;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  className?: string; 
}

const InputColor: React.FC<InputColorProps> = ({
  id,
  label,
  labelType = "h3",
  value,
  onChange,
  name,
  required = true,
  className,
}) => {
  return (
    <div className={`flex flex-col w-full ${className ?? ""}`}>
      {/* Label via TextAdmin */}
      <TextAdmin type={labelType} className="mb-2 text-primary">
        {label}
      </TextAdmin>

      {/* Input HTML natif */}
      <input
        id={id}
        name={name}
        type="color"
        value={value}
        required={required}
        onChange={onChange}
        data-testid="color-input"
        className="w-full h-10 rounded border border-gray-300"
      />
    </div>
  );
};

export default InputColor;