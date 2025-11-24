import React, { ReactElement, useCallback } from "react";
import {
  TextField,
  MenuItem,
  TextFieldProps,
  Chip,
} from "@mui/material";

export interface SelectOption<T extends string | number> {
  readonly label: string;
  readonly value: T;
}

export interface InputMultiSelectProps<T extends string | number> {
  readonly id: string;
  readonly label: string;
  readonly name?: string;
  readonly value: readonly T[];
  readonly options: readonly SelectOption<T>[];
  readonly onChange: (values: T[]) => void;
  readonly required?: boolean;
  readonly className?: string;
  readonly sx?: TextFieldProps["sx"];
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

/**
 * Composant InputMultiSelect avec sélection multiple
 * Affiche les sélections sous forme de Chips avec possibilité de suppression
 * 
 * @template T - Type des valeurs (string ou number)
 * @param props - Les props du composant
 * @returns ReactElement du composant
 * 
 * @example
 * ```tsx
 * const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
 * 
 * <InputMultiSelect<number>
 *   id="skills"
 *   label="Skills"
 *   value={selectedSkills}
 *   options={skillOptions}
 *   onChange={setSelectedSkills}
 * />
 * ```
 */
const InputMultiSelect = <T extends string | number>(
  {
    id,
    label,
    name,
    value,
    options,
    onChange,
    required = true,
    className,
    sx,
    placeholder,
    disabled = false,
  }: InputMultiSelectProps<T>
): ReactElement => {
  /**
   * Gère le changement de sélection
   * @param event - Événement de changement du TextField
   * @returns void
   */
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      try {
        const selectedValue: unknown = event.target.value;

        if (typeof selectedValue !== "string" && typeof selectedValue !== "number") {
          throw new Error("Invalid value type in select change event");
        }

        const newValue: T[] = Array.isArray(selectedValue)
          ? (selectedValue as T[])
          : ([selectedValue] as T[]);

        onChange(newValue);
      } catch (error) {
        console.error("Error in InputMultiSelect handleChange:", error);
      }
    },
    [onChange]
  );

  /**
   * Gère la suppression d'une valeur sélectionnée via Chip
   * @param valueToDelete - La valeur à supprimer
   * @returns void
   */
  const handleDelete = useCallback(
    (valueToDelete: T): void => {
      try {
        const updatedValues: T[] = value.filter(
          (v: T): boolean => v !== valueToDelete
        );
        onChange(updatedValues);
      } catch (error) {
        console.error("Error in InputMultiSelect handleDelete:", error);
      }
    },
    [value, onChange]
  );

  /**
   * Trouve le label d'une valeur dans les options
   * @param selectedValue - La valeur à rechercher
   * @returns Le label correspondant ou la valeur convertie en string
   */
  const getLabel = useCallback(
    (selectedValue: T): string => {
      try {
        const selectedOption: SelectOption<T> | undefined = options.find(
          (opt: SelectOption<T>): boolean => opt.value === selectedValue
        );
        return selectedOption?.label ?? String(selectedValue);
      } catch (error) {
        console.error("Error in InputMultiSelect getLabel:", error);
        return String(selectedValue);
      }
    },
    [options]
  );

  return (
    <div className={`w-full ${className ?? ""}`}>
      <TextField
        id={id}
        select
        SelectProps={{
          multiple: true,
        }}
        label={label}
        variant="outlined"
        fullWidth
        required={required}
        disabled={disabled}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
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
          "& .MuiFormLabel-root.Mui-focused": {
            color: "var(--primary-color)",
            fontWeight: "bold",
            backgroundColor: "white",
          },
          "& .MuiSelect-multiple": {
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          },
          ...sx,
        }}
      >
        {options.map((opt: SelectOption<T>): ReactElement => (
          <MenuItem key={String(opt.value)} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((selectedValue: T): ReactElement => (
            <Chip
              key={String(selectedValue)}
              label={getLabel(selectedValue)}
              onDelete={(): void => handleDelete(selectedValue)}
              color="primary"
              variant="outlined"
              data-testid={`chip-${selectedValue}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

InputMultiSelect.displayName = "InputMultiSelect";

export default InputMultiSelect;