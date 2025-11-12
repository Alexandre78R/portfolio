import React, { ChangeEvent, ReactNode } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/fr';

type Locale = "fr" | "en";

type MonthMapType = Record<string, string>;

export interface InputFieldProps {
  id: string;
  label: string | ReactNode;
  type?: string;
  value: string;
  onChange: (value: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
  name?: string;
  required?: boolean;
  className?: string;
  sx?: TextFieldProps["sx"];
  placeholder?: string;
  picker?: "date";
  locale?: Locale;
}

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

const parseDate = (value: string): Dayjs | null => {
  if (!value) return null;

  let parseValue = value;
  
  // Convertir les mois français en anglais
  Object.entries(MONTH_MAP).forEach(([fr, en]: [string, string]) => {
    if (value.includes(fr)) {
      parseValue = value.replace(fr, en);
    }
  });

  const dateValue = dayjs(parseValue, "MMMM YYYY");
  
  return dateValue.isValid() ? dateValue : null;
};

const formatDate = (date: Dayjs, locale: Locale): string => {
  const formatted = date.locale(locale).format("MMMM YYYY");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

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
  className = "",
  sx,
  placeholder,
  picker,
  locale = "en",
}) => {
  if (picker === "date") {
    const dateValue = parseDate(value);

    const handleDateChange = (newValue: Dayjs | null): void => {
      if (newValue?.isValid()) {
        const formatted = formatDate(newValue, locale);
        console.log(`Date formatée (${locale}):`, formatted);
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
              className: `bg-white border border-gray-300 rounded-md text-text ${className}`,
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
      </LocalizationProvider>
    );
  }

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange(e);
  };

  return (
    <TextField
      id={id}
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      required={required}
      value={value}
      onChange={handleTextChange}
      multiline={multiline}
      rows={multiline && rows ? rows : undefined}
      name={name}
      className={`bg-white border border-gray-300 rounded-md text-text ${className}`}
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