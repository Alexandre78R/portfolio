import React, { ReactNode } from 'react';
import { Message } from './Message';

interface CmdNotFoundProps {
  cmdH: string;
}

export const CmdNotFound: React.FC<CmdNotFoundProps> = ({ cmdH }) => {
  return (
    <Message>
      Command not found: {cmdH}
    </Message>
  );
};