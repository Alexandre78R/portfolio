import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export interface ModalCustomProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
  className?: string;
}

const ModalCustom: React.FC<ModalCustomProps> = ({
  open,
  onClose,
  children,
  width = "400px", // Par défaut, largeur fixe pour desktop
  className = "",
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className={`flex flex-col justify-center items-center gap-2 bg-body rounded shadow-lg p-6 ${className}`}
        sx={{
          width: {
            xs: "90%", // Petit écran : 90% de la largeur
            sm: "70%", // Petit/moyen écran : 70%
            md: width, // Desktop : valeur par défaut
          },
          maxWidth: "600px", // Limite la largeur maximale
          border: `2px solid var(--body-color)`,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflowY: "auto", // Scroll si contenu trop grand
          maxHeight: "90vh", // Limite la hauteur à l'écran
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default ModalCustom;