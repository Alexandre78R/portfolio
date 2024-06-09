import React, { ReactNode } from 'react';

interface HintsProps {
  children: ReactNode;
}

export const Hints: React.FC<HintsProps> = (): React.ReactElement => {
  return (
    <span className="mr-3.5"/>
  );
};