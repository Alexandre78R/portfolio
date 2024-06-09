import React, { ReactNode } from 'react';

interface MessageDivProps {
  children: ReactNode;
}

export const Message: React.FC<MessageDivProps> = ({ children }) => {
  return (
    <div className="mb-[0.25rem]">
      {children}
    </div>
  );
};