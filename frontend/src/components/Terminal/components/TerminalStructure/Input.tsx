import React from 'react';
import TermInfo from '../../TermInfo';
import HomeTerminal from '../../HomeTerminal';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <>
      <HomeTerminal />
      <input className="flex-grow inputTerminal" {...props} />
    </>
  );
};