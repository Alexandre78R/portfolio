import React from "react";
import Button from "@mui/material/Button";


export interface ButtonCustomProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  // text: string;
  text?: React.ReactNode;
  disable?: boolean; 
  disableHover?: boolean;
}

const ButtonCustom: React.FC<ButtonCustomProps> = ({
  onClick,
  text,
  disable = false,
  disableHover = false,
}): JSX.Element => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      disabled={disable}
      sx={{
        fontSize: "12px",
        px: 5,
        py: 1,
        borderRadius: "999px",
        mt: 2,
        ml: 1,
        border: "none",
        bgcolor: disable ? "red" : "var(--primary-color)",
        "&:hover": disableHover
          ? {}
          : {
              bgcolor: "var(--secondary-color)",
            },
        outline: "none",
      }}
    >
      {text}
    </Button>
  );
};

export default ButtonCustom;