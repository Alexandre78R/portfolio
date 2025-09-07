import { Typography, Box } from "@mui/material";

type Props = {
  title: string;
};

const TitleH3: React.FC<Props> = ({ title }): React.ReactElement => {
  return (
    <Box m={5}>
      <Typography
        variant="h3"
        component="h3"
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

export default TitleH3;