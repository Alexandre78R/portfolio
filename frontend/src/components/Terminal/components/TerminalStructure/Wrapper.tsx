import React, { ReactNode, } from 'react';

type WrapperProps = {
    children: ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    console.log(children)
  return (
    // <div className="flex items-center justify-center h-1/2 w-[100vh] p-5 text-primary">
    // h-[calc(100vh-xpx)]
    //  h-x
    // <div className="p-5 pt-3 flex  items-center justify-center w-[100%] overflow-y-auto text-primary">
    <div className='flex flex-col-reverse w-[100%] md:w-[70%] lg:w-[70%] h-[450px] overflow-y-auto text-text' >
      {children}
    </div>
  );
};