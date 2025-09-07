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
  h1: "2rem",       // ~ text-4xl // réduit depuis 2.5rem
  h2: "1.75rem",    // ~ text-3xl // réduit depuis 2rem
  h3: "1.5rem",     // ~ text-2xl // réduit depuis 1.75rem
  h4: "1.25rem",    // ~ text-xl // réduit depuis 1.5rem
  h5: "1.125rem",   // ~ text-lg // réduit depuis 1.25rem
  h6: "1rem",       // ~ text-base // réduit depuis 1.125rem
  p: "0.875rem",    // ~ text-base // réduit depuis 1rem
  span: "0.75rem",  // ~ text-sm // réduit depuis 0.875rem
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