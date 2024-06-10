import React, { ReactNode } from 'react';

type FormProps = {
  children: ReactNode;
  onSubmit: (e: any) => void;
}

export const Form: React.FC<FormProps> = ({ children, onSubmit }): React.ReactElement => {
  return (
    <form className="md:flex" onSubmit={(e) => onSubmit(e)}>
      {children}
    </form>
  );
};