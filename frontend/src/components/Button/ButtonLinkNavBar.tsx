import React from "react";
import { usePathname } from "next/navigation";

type ButtonLinkNavBarProps = {
  children: React.ReactNode;
  sectionRef: React.RefObject<HTMLDivElement>;
  handleScrollToSection: (
    event: React.MouseEvent<HTMLElement>,
    sectionRef: React.RefObject<HTMLDivElement>
  ) => void;
  className?: string;
};

const ButtonLinkNavBar: React.FC<ButtonLinkNavBarProps> = ({
  children,
  sectionRef,
  handleScrollToSection,
  className = "",
}) => {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <button
      onClick={e => handleScrollToSection(e, sectionRef)}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
};

export default ButtonLinkNavBar;