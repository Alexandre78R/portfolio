import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import TextAdmin from "../AdminLayout/components/Text/TextAdmin";

export interface AuthFormLayoutProps {
  title: string | ReactNode;
  children: ReactNode;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ title, children }: AuthFormLayoutProps): JSX.Element => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Box className="max-w-md w-ful rounded shadow space-y-6 bg-body">
        <TextAdmin type="h2" className="text-2xl font-bold text-center mb-4 text-primary">
          {title}
        </TextAdmin>
        <div className="mt-8">{children}</div>
      </Box>
    </div>
  );
};

export default AuthFormLayout;
