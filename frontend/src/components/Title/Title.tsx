import { Typography } from "@mui/material";

type Props = {
  title: string;
};

const Title: React.FC<Props> = ({ title }): React.ReactElement => {
  return (
    <div className="m-5">
      <Typography
        variant="h2"
        component="h2"
        className="text-text text-2xl font-bold"
      >
        {title}
      </Typography>
    </div>
  );
};

export default Title;
