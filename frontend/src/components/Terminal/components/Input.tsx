/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import TermInfo from '../TermInfo';
import HomeTerminal from '../HomeTerminal';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// export const Input: React.FC<InputProps> = (props, ref) => {
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <>
      <HomeTerminal />
      <input className="flex-grow inputTerminal" ref={ref} {...props} />
    </>
  );
});