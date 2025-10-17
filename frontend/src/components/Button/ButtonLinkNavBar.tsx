import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

export interface ButtonLinkNavBarProps {
  children: ReactNode;
  sectionRef: React.RefObject<HTMLDivElement>;
  handleScrollToSection: (
    event: React.MouseEvent<HTMLButtonElement>,
    sectionRef: React.RefObject<HTMLDivElement>
  ) => void;
  className?: string;
}

const ButtonLinkNavBar: React.FC<ButtonLinkNavBarProps> = ({
  children,
  sectionRef,
  handleScrollToSection,
  className = "",
}): JSX.Element | null => {
  const pathname: string | null = usePathname() ?? null;

  if (pathname !== "/") return null;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    handleScrollToSection(event, sectionRef);
  };

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  );
};

export default ButtonLinkNavBar;