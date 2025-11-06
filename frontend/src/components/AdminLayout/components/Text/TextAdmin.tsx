import { Typography, Box } from "@mui/material";
import React from "react";

export type TextAdminType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

export interface TextAdminProps {
  type: TextAdminType;
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<TextAdminType, "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2"> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "body1",
  span: "body2",
} as const;

const fontSizeMap: Record<TextAdminType, string> = {
  h1: "2rem",
  h2: "1.75rem",
  h3: "1.5rem",
  h4: "1.25rem",
  h5: "1.125rem",
  h6: "1rem",
  p: "0.875rem",
  span: "0.75rem",
} as const;

const getColorForType = (type: TextAdminType): string =>
  type === "p" || type === "span" ? "var(--text-color)" : "var(--primary-color)";

const TextAdmin: React.FC<TextAdminProps> = ({ type, children, className }): JSX.Element => (
  <Box className={className}>
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

export default TextAdmin;