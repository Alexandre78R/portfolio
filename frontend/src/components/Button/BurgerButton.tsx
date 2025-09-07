import React from "react";

type BurgerButtonProps = {
  open: boolean;
  toggleMenu: () => void;
  className?: string;
};

const BurgerButton: React.FC<BurgerButtonProps> = ({ open, toggleMenu, className }) => (
  <button
    className={`text-text focus:outline-none relative z-50 ${className ?? ""}`}
    onClick={toggleMenu}
    aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
    type="button"
  >
    {open ? (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);

export default BurgerButton;