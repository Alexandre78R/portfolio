import { Button } from "@mui/material";

type Props = {
  onClick?: () => void;
  text: string;
  disable?: boolean;
  disableHover?: boolean;
};

const ButtonCustom: React.FC<Props> = ({
  onClick,
  text,
  disable,
  disableHover,
}): React.ReactElement => {
  return (
    <Button
      onClick={onClick}
      className={`text-m text-textButton px-5 py-1 rounded-full ${
        disable ? "bg-black" : "bg-primary"
      } ${disableHover ? "none" : "hover:bg-secondary"} border-none mt-2 ml-1`}
      variant="contained"
      style={{ pointerEvents: disableHover ? "none" : "auto", outline: "none" }}
    >
      {text}
    </Button>
  );
};

export default ButtonCustom;
