import React, { ReactNode } from 'react';

interface MessageDivProps {
  children: ReactNode;
}

export const Message: React.FC<MessageDivProps> = ({ children }): React.ReactElement => {
  return (
    <div className="mb-[0.25rem]">
      {children}
    </div>
  );
};