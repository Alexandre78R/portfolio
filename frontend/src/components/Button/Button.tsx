import Button from "@mui/material/Button";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  disable?: boolean;
  disableHover?: boolean;
};

const ButtonCustom: React.FC<Props> = ({
  onClick,
  text,
  disable,
  disableHover,
}) => {
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
        // pointerEvents: disable ? "none" : "auto",
        outline: "none",
        // color: disable ? "white" : "",
      }}
    >
      {text}
    </Button>
  );
};

export default ButtonCustom;