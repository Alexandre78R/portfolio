import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider: React.FC = () => {
  return <ToastContainer data-testid="toast-container" />;
};

export default ToastProvider;
