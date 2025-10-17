import React, { FC, ReactNode, MouseEventHandler } from "react";
import Button from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";

export interface ButtonCustomProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  text?: ReactNode;
  disable?: boolean; // bouton désactivé
  disableHover?: boolean; // désactive le style hover
  className?: string; // classe supplémentaire optionnelle
  sx?: SxProps<Theme>; // styles supplémentaires optionnels
}

const ButtonCustom: FC<ButtonCustomProps> = ({
  onClick,
  text,
  disable = false,
  disableHover = false,
  className,
  sx,
}): JSX.Element => {
  const buttonStyles: SxProps<Theme> = {
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
    ...sx, // merge avec les styles passés en props
  };

  return (
    <Button
      onClick={onClick}
      variant="contained"
      disabled={disable}
      className={className}
      sx={buttonStyles}
      type="button"
    >
      {text}
    </Button>
  );
};

export default ButtonCustom;