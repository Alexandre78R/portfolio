import React, { ReactElement } from "react";
import { Typography, Box } from "@mui/material";

export interface TitleH3Props {
  title: string;
}

const TitleH3: React.FC<TitleH3Props> = ({ title }): ReactElement => {
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