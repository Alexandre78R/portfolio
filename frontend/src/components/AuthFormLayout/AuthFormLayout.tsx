import { ReactNode } from "react";
import { Box } from "@mui/material";

interface AuthFormLayoutProps {
  title: string;
  children: ReactNode;
}

const AuthFormLayout = ({ title, children } : AuthFormLayoutProps) : React.ReactElement => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Box className="max-w-md w-full p-6 rounded shadow space-y-6 bg-body">
        <h2 className="text-2xl font-bold text-center mb-4 text-primary">
          {title}
        </h2>
        <div className="mt-8">
          {children}
        </div>
      </Box>
    </div>
  );
}

export default AuthFormLayout;