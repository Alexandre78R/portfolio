import React, { ReactNode } from 'react';

interface FormProps {
  children: ReactNode;
  onSubmit: (e: any) => void;
}

export const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return (
    <form className="md:flex" onSubmit={(e) => onSubmit(e)}>
      {children}
    </form>
  );
};