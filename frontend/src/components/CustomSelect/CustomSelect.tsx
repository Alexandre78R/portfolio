import React from "react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface CustomSelectProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: { value: string; label: string }[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <FormControl fullWidth required>
      <InputLabel
        id={`${id}-label`}
        sx={{
          color: "var(--primary-color)",
          fontWeight: "bold",
          backgroundColor: "white",
          px: 0.5,
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        sx={{
          backgroundColor: "white",
          color: "var(--primary-color)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary-color)",
            borderWidth: "0.2rem",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary-color)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary-color)",
            borderWidth: "0.2rem",
          },
          "& .MuiSvgIcon-root": {
            color: "var(--primary-color)",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "white",
              color: "var(--primary-color)",
              border: "1px solid var(--primary-color)",
            },
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            sx={{
              backgroundColor: "white",
              color: "var(--primary-color)",
              "&.Mui-selected": {
                backgroundColor: "var(--primary-color)",
                color: "white",
              },
              "&.Mui-selected:hover, &.Mui-selected.Mui-focusVisible": {
                backgroundColor: "var(--primary-color)",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "var(--primary-color)",
                color: "white",
              },
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;