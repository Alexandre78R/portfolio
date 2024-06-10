import React, { ReactNode } from 'react';

type HintsProps = {
  children: ReactNode;
}

export const Hints: React.FC<HintsProps> = (): React.ReactElement => {
  return (
    <span className="mr-3.5"/>
  );
};