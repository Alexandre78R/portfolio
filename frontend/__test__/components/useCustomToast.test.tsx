import { renderHook, act } from '@test-utils';
import { toast, ToastOptions } from "react-toastify";
import useCustomToast, { AlertType, Alert } from "@/components/ToastCustom/CustomToast";
import React from "react";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("useCustomToast Hook", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("exposes showAlert function and ToastContainer", (): void => {
    const { result } = renderHook(() => useCustomToast());

    expect(typeof result.current.showAlert).toBe("function");
    expect(result.current.ToastContainer).toBeDefined();
  });

  it("adds an alert and calls toast.success correctly", (): void => {
    const { result } = renderHook(() => useCustomToast());

    act(() => {
      result.current.showAlert("success", "Success message");
    });

    act(() => {});

    const expectedOptions: Partial<ToastOptions> = {
      position: "top-right",
      autoClose: 3500,
    };

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      "Success message",
      expect.objectContaining(expectedOptions)
    );
  });

  it("adds multiple alerts and calls correct toast types", (): void => {
    const { result } = renderHook(() => useCustomToast());

    const alerts: Alert[] = [
      { type: "success", message: "Success" },
      { type: "info", message: "Info" },
      { type: "warn", message: "Warning" },
      { type: "error", message: "Error" },
    ];

    act(() => {
      alerts.forEach(({ type, message }) => {
        result.current.showAlert(type, message);
      });
    });

    act(() => {});

    const expectedOptions: Partial<ToastOptions> = { position: "top-right" };

    expect(toast.success).toHaveBeenCalledWith("Success", expect.objectContaining(expectedOptions));
    expect(toast.info).toHaveBeenCalledWith("Info", expect.objectContaining(expectedOptions));
    expect(toast.warn).toHaveBeenCalledWith("Warning", expect.objectContaining(expectedOptions));
    expect(toast.error).toHaveBeenCalledWith("Error", expect.objectContaining(expectedOptions));
  });

  it("calls toast.error if alert type does not exist", (): void => {
    const { result } = renderHook(() => useCustomToast());

    act(() => {
      result.current.showAlert("invalid" as AlertType, "Invalid type message");
    });

    act(() => {});

    const expectedOptions: Partial<ToastOptions> = { position: "top-right" };

    expect(toast.error).toHaveBeenCalledWith(
      'ERROR: Alert type "invalid" does not exist!',
      expect.objectContaining(expectedOptions)
    );
  });
});
