import { Button } from '@mui/material';

const ButtonCustom: React.FC = ({ onClick, text}) => {
  return (
    <Button onClick={onClick} className="text-m text-text px-5 py-1 rounded-full bg-primary hover:bg-secondary border-none" variant="contained">{text}</Button>
  );
}

export default ButtonCustom;