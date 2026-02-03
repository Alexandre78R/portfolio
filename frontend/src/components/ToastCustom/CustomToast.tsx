import { useState, useEffect } from "react";
import { toast, ToastOptions, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type AlertType = "success" | "info" | "warn" | "error";

export interface Alert {
  type: AlertType;
  message: string;
}

const useCustomToast = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (type: AlertType, message: string) => {
    setAlerts((prev) => [...prev, { type, message }]);
  };

  const getToastOptions: (type: AlertType) => ToastOptions = (type: AlertType): ToastOptions => {
    const baseStyles: ToastOptions = {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    const styles: Record<AlertType, ToastOptions> = {
      error: {
        ...baseStyles,
        style: {
          backgroundColor: "var(--footer-color)",
          color: "var(--text-color)",
        },
        progressStyle: { backgroundColor: "var(--error-color)" },
      },
      success: {
        ...baseStyles,
        style: {
          backgroundColor: "var(--footer-color)",
          color: "var(--text-color)",
        },
        progressStyle: { backgroundColor: "var(--success-color)" },
      },
      info: {
        ...baseStyles,
        style: {
          backgroundColor: "var(--footer-color)",
          color: "var(--text-color)",
        },
        progressStyle: { backgroundColor: "var(--info-color)" },
      },
      warn: {
        ...baseStyles,
        style: {
          backgroundColor: "var(--footer-color)",
          color: "var(--text-color)",
        },
        progressStyle: { backgroundColor: "var(--warn-color)" },
      },
    };

    return styles[type];
  };

  useEffect(() => {
    if (alerts.length === 0) return;

    const { type, message }: Alert = alerts[0];

    if (toast[type]) toast[type](message, getToastOptions(type));
    else toast.error(`ERROR: Alert type "${type}" does not exist!`, getToastOptions("error"));

    setAlerts((prev) => prev.slice(1));
  }, [alerts]);

  return { showAlert, ToastContainer };
};

export default useCustomToast;