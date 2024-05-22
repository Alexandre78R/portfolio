import React, { ReactNode } from 'react';

interface HintsProps {
  children: ReactNode;
}

export const Hints: React.FC<HintsProps> = () => {
  return (
    <span className="mr-3.5"/>
  );
};