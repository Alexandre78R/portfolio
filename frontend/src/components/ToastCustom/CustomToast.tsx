import { useState, useEffect, useRef, MutableRefObject } from "react";
import { toast, ToastOptions, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Alert {
  type: "success" | "info" | "warn" | "error";
  message: string;
}

const CustomToast = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const showAlertRef: MutableRefObject<
    ((type: Alert["type"], message: string) => void) | null
  > = useRef(null);

  useEffect(() => {
    showAlertRef.current = showAlert;
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      const { type, message } = alerts[0];
      const options = getToastOptions(type);
      if (toast[type]) {
        toast[type](message, options);
      } else {
        toast.error(`ERROR: Alert type "${type}" does not exist!`, options);
      }
      setAlerts((prevAlerts) => prevAlerts.slice(1));
    }
  }, [alerts]);

  const showAlert = (type: Alert["type"], message: string) => {
    setAlerts((prevAlerts) => [...prevAlerts, { type, message }]);
  };

  const getToastOptions = (type: Alert["type"]): ToastOptions => {
    const baseStyles: ToastOptions = {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    const styles: { [key in Alert["type"]]: ToastOptions } = {
      error: {
        ...baseStyles,
        style: {
          backgroundColor: "var(--footer-color)",
          color: "var(--text-color)",
        },
        progressStyle: {
          backgroundColor: "var(--error-color)",
        },
      },
      success: {
        ...baseStyles,
        style: {
          backgroundColor: "var(--footer-color)",
          color: "var(--text-color)",
        },
        progressStyle: {
          backgroundColor: "var(--success-color)",
        },
      },
      info: {
        ...baseStyles,
        style: {
          backgroundColor: "var(--footer-color)",
          color: "var(--text-color)",
        },
        progressStyle: {
          backgroundColor: "var(--info-color)",
        },
      },
      warn: {
        ...baseStyles,
        style: {
          backgroundColor: "var(--footer-color)",
          color: "var(--text-color)",
        },
        progressStyle: {
          backgroundColor: "var(--warn-color)",
        },
      },
    };

    return styles[type];
  };

  return { showAlert, ToastContainer };
};

export default CustomToast;
