import { Typography, Box } from "@mui/material";
import React from "react";

type Props = {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  children: React.ReactNode;
};

const variantMap: Record<Props["type"], 
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2"> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "body1",
  span: "body2",
};

const fontSizeMap: Record<Props["type"], string> = {
  h1: "2.5rem",     // ~ text-4xl
  h2: "2rem",       // ~ text-3xl
  h3: "1.75rem",    // ~ text-2xl
  h4: "1.5rem",     // ~ text-xl
  h5: "1.25rem",    // ~ text-lg
  h6: "1.125rem",   // ~ text-base
  p: "1rem",        // ~ text-base
  span: "0.875rem", // ~ text-sm
};

const getColorForType = (type: Props["type"]): string => {
  if (type === "p" || type === "span") {
    return "var(--text-color)";
  }
  return "var(--primary-color)";
};

const TextAdmin: React.FC<Props> = ({type, children }): React.ReactElement => {
  return (
    <Box>
      <Typography
        variant={variantMap[type]}
        component={type}
        sx={{
          color: getColorForType(type),
          fontSize: fontSizeMap[type],
          fontWeight: "bold",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default TextAdmin;