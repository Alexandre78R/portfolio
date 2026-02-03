import React, { ChangeEvent, ReactNode, useState } from "react";
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/fr';

type Locale = "fr" | "en";
type MonthMapType = Record<string, string>;

interface BaseDatePickerProps {
  id: string;
  label: string | ReactNode;
  value: string;
  multiline?: boolean;
  rows?: number;
  name?: string;
  required?: boolean;
  className?: string;
  sx?: TextFieldProps["sx"];
  placeholder?: string;
}

interface DatePickerProps extends BaseDatePickerProps {
  picker: "date";
  locale?: Locale;
  type?: never;
  onChange: (value: string) => void | Promise<void>;
}

interface TextFieldInputProps extends BaseDatePickerProps {
  picker?: never;
  locale?: never;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export type InputFieldProps = DatePickerProps | TextFieldInputProps;

const MONTH_MAP: Readonly<MonthMapType> = {
  'Janvier': 'January',
  'Février': 'February',
  'Mars': 'March',
  'Avril': 'April',
  'Mai': 'May',
  'Juin': 'June',
  'Juillet': 'July',
  'Août': 'August',
  'Septembre': 'September',
  'Octobre': 'October',
  'Novembre': 'November',
  'Décembre': 'December'
} as const;

const parseDate: (value: string) => Dayjs | null = (value: string): Dayjs | null => {
  if (!value) return null;

  let parseValue: string = value;
  
  Object.entries(MONTH_MAP).forEach(([fr, en]: [string, string]) => {
    if (value.includes(fr)) {
      parseValue = value.replace(fr, en);
    }
  });

  const dateValue: Dayjs = dayjs(parseValue, "MMMM YYYY");
  
  return dateValue.isValid() ? dateValue : null;
};

const formatDate: (date: Dayjs, locale: Locale) => string = (date: Dayjs, locale: Locale): string => {
  const formatted: string = date.locale(locale).format("MMMM YYYY");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    id,
    label,
    value,
    multiline = false,
    rows,
    name,
    required = true,
    className = "",
    sx,
    placeholder,
  } = props;

  if (props.picker === "date") {
    const { locale = "en", onChange } = props;
    const dateValue: Dayjs | null = parseDate(value);

    const handleDateChange: (newValue: Dayjs | null) => void = (newValue: Dayjs | null): void => {
      if (newValue?.isValid()) {
        const formatted: string = formatDate(newValue, locale);
        onChange(formatted);
      } else {
        console.log("Date invalide ou nulle");
      }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <DatePicker
          label={label}
          value={dateValue}
          views={['year', 'month']}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              id,
              required,
              fullWidth: true,
              name,
              className: `bg-secondary border border-gray-300 rounded-md text-text-300 ${className}`,
              sx: {
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  color: "var(--text300-color)",
                  "& input": {
                    color: "var(--text300-color)",
                  },
                  "& textarea": {
                    color: "var(--text300-color)",
                  },
                },
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
      </LocalizationProvider>
    );
  }

  const { type = "text", onChange } = props;

  const isPasswordType: boolean = type === "password";
  const [showPassword, setShowPassword]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const inputType: string = isPasswordType && showPassword ? "text" : type;

  const handleTextFieldChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange(e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>);
  };

  return (
    <TextField
      id={id}
      label={label}
      type={inputType}
      variant="outlined"
      fullWidth
      required={required}
      value={value}
      onChange={handleTextFieldChange}
      multiline={multiline}
      rows={multiline && rows ? rows : undefined}
      name={name}
      InputProps={
        isPasswordType
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
      className={`bg-white border border-gray-300 rounded-md text-primary ${className}`}
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: "white",
          color: "var(--text300-color)",
          "& input": {
            color: "var(--text300-color)",
          },
          "& textarea": {
            color: "var(--text300-color)",
          },
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--text300-color)",
          borderWidth: "0.2rem",
        },
        "& .MuiFormLabel-root": {
          color: "var(--text300-color)",
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