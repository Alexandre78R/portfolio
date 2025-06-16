import { TextField, TextFieldProps } from "@mui/material";

const TextFieldCustom = (props : TextFieldProps) : React.ReactElement => {
  return (
    <TextField
      {...props}
      fullWidth
      InputLabelProps={{
        style: { color: "var(--primary-color)" },
        ...props.InputLabelProps,
      }}
      InputProps={{
        style: {
          color: "var(--text-color)",
          background: "var(--body-color)",
          ...props.InputProps?.style,
        },
        ...props.InputProps,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "var(--primary-color)" },
          "&:hover fieldset": { borderColor: "var(--secondary-color)" },
          "&.Mui-focused fieldset": { borderColor: "var(--primary-color)" },
        },
        ...props.sx,
      }}
    />
  );
}

export default TextFieldCustom;