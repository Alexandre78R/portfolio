import React, { ReactNode } from "react";

type WrapperProps = {
  children: ReactNode;
  ref?: any;
};

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  ref,
}): React.ReactElement => {
  return (
    <div
      ref={ref}
      className="flex flex-col-reverse w-[100%] md:w-[70%] lg:w-[70%] h-[460px] overflow-y-auto text-text"
    >
      {children}
    </div>
  );
};
