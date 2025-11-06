import React, { ChangeEvent, ReactNode } from "react";
import TextAdmin, { TextAdminType } from "../../components/Text/TextAdmin";

export interface InputBooleanProps {
  id: string;
  label: string | ReactNode;
  labelType?: TextAdminType;
  value: boolean | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  className?: string;           // wrapper global
  optionClassName?: string;     // personnaliser les boutons
  selectedClassName?: string;   // style du bouton sélectionné
}

const InputBoolean: React.FC<InputBooleanProps> = ({
  id,
  label,
  labelType = "h3",
  value,
  onChange,
  name,
  required = true,
  className,
  optionClassName,
  selectedClassName,
}) => {
  const handleClick = (val: boolean) => {
    const fakeEvent = {
      target: {
        name,
        value: val.toString(),
      },
    } as unknown as ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  };

  return (
    <div className={`w-full flex flex-col ${className ?? ""}`}>
      <TextAdmin type={labelType} className="mb-2 text-primary font-bold">
        {label}
      </TextAdmin>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handleClick(true)}
          className={`px-4 py-2 rounded-md border transition-colors ${
            value === true
              ? "bg-primary text-white border-primary"
              : "bg-white text-primary border-gray-300 hover:bg-gray-100"
          } ${optionClassName ?? ""} ${value === true ? selectedClassName ?? "" : ""}`}
        >
          Yes
        </button>

        <button
          type="button"
          onClick={() => handleClick(false)}
          className={`px-4 py-2 rounded-md border transition-colors ${
            value === false
              ? "bg-primary text-white border-primary"
              : "bg-white text-primary border-gray-300 hover:bg-gray-100"
          } ${optionClassName ?? ""} ${value === false ? selectedClassName ?? "" : ""}`}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default InputBoolean;