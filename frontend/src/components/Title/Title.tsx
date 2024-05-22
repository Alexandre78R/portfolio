import { Typography } from '@mui/material';

type Props = {
    title : string
};

const Title: React.FC<Props> = ({ title }) => {
  
  return (
    <Typography variant="h5" component="h5" className="text-text font-bold">
    {title}
    </Typography>

  );
};

export default Title;
