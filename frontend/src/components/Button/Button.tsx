import { Button } from '@mui/material';

type Props = {
  onClick: () => void,
  text: string
};

const ButtonCustom: React.FC<Props> = ({ onClick, text}) => {
  return (
    <Button onClick={onClick} className="text-m text-text px-5 py-1 rounded-full bg-primary hover:bg-secondary border-none mt-2 ml-1" variant="contained">{text}</Button>
  );
};

export default ButtonCustom;