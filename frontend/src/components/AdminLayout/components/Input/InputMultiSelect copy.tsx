import React, { ReactElement, useCallback, useState, useMemo, useEffect } from "react";
import {
  Autocomplete,
  TextFieldProps,
  Chip,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

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
  readonly onSearch?: (searchTerm: string) => Promise<SelectOption<T>[]>;
  readonly required?: boolean;
  readonly className?: string;
  readonly sx?: TextFieldProps["sx"];
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

const InputMultiSelect = <T extends string | number>(
  {
    id,
    label,
    name,
    value,
    options,
    onChange,
    onSearch,
    required = true,
    className,
    sx,
    placeholder,
    disabled = false,
  }: InputMultiSelectProps<T>
): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = useCallback(
    (
      _event: React.SyntheticEvent,
      newValue: SelectOption<T>[] | null
    ): void => {
      try {
        if (newValue) {
          const selectedValues: T[] = newValue.map((opt) => opt.value);
          onChange(selectedValues);
        } else {
          onChange([]);
        }
      } catch (error) {
        console.error("Error in InputMultiSelect handleChange:", error);
      }
    },
    [onChange]
  );

  const getOptionFromValue = useCallback(
    (selectedValue: T): SelectOption<T> | undefined => {
      return (options as SelectOption<T>[]).find((opt) => opt.value === selectedValue);
    },
    [options]
  );

  const selectedOptions: SelectOption<T>[] = useMemo(() => {
    return value
      .map(getOptionFromValue)
      .filter((opt): opt is SelectOption<T> => opt !== undefined);
  }, [value, getOptionFromValue]);

  const isOptionEqualToValue = useCallback(
    (option: SelectOption<T>, value: SelectOption<T>) => {
      return option.value === value.value;
    },
    []
  );

  const handleFilterOptions = useCallback(
    async (options: SelectOption<T>[], params: { inputValue: string }) => {
      if (onSearch && params.inputValue.trim().length > 0) {
        setLoading(true);
        try {
          const results = await onSearch(params.inputValue);
          return results;
        } catch (error) {
          console.error("Error searching options:", error);
          return [];
        } finally {
          setLoading(false);
        }
      }
      return options;
    },
    [onSearch]
  );

  return (
    <div className={`w-full ${className ?? ""}`}>
      <Autocomplete<SelectOption<T>, true, false, false>
        multiple
        id={id}
        options={options as SelectOption<T>[]}
        getOptionLabel={(option) => option.label}
        value={selectedOptions}
        onChange={handleChange}
        disabled={disabled}
        filterSelectedOptions
        filterOptions={onSearch ? (x) => x : undefined}
        loading={loading}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            variant="outlined"
            fullWidth
            name={name}
            className={`bg-white border border-gray-300 rounded-md text-text`}
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
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Box
                key={key}
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <Chip
                  {...tagProps}
                  label={option.label}
                  icon={<CloseIcon sx={{ fontSize: "1rem" }} />}
                  size="small"
                  sx={{
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    fontWeight: 500,
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                        opacity: 0.8,
                      },
                    },
                  }}
                  data-testid={`chip-${option.value}`}
                />
              </Box>
            );
          })
        }
        noOptionsText="No options available"
      />
    </div>
  );
};

InputMultiSelect.displayName = "InputMultiSelect";

export default InputMultiSelect;
