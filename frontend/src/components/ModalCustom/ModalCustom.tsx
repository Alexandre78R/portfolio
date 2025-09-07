import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface ModalCustomProps {
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
  width = 400,
  className = "",
}) => {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className={`flex flex-row justify-center items-center gap-2 bg-body rounded shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 ${className}`}
        sx={{
          width,
          border: `2px solid var(--body-color)`,
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default ModalCustom;