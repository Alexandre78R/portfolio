import { Typography, Box } from "@mui/material";

type Props = {
  title: string;
};

const Title: React.FC<Props> = ({ title }): React.ReactElement => {
  return (
    <Box m={5}>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          color: "var(--text-color)",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default Title;