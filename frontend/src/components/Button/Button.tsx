import { Button } from '@mui/material';

type Props = {
  onClick: () => void,
  text: string,
  disable?: boolean,
};

const ButtonCustom: React.FC<Props> = ({ onClick, text, disable }) => {
  return (
    <Button onClick={onClick} className={`text-m text-text px-5 py-1 rounded-full ${disable? "bg-black" : "bg-primary"} hover:bg-secondary border-none mt-2 ml-1`} variant="contained">{text}</Button>
  );
};

export default ButtonCustom;