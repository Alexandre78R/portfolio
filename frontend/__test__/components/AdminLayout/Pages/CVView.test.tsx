import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CVView from "@/components/AdminLayout/Pages/CV/CVView";
import { useLang } from "@/context/Lang/LangContext";
import { useCvQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/types/graphql", () => ({
  useCvQuery: jest.fn(),
}));

const mockShowAlert = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: mockShowAlert })),
}));

const mockWindowOpen = jest.fn();
Object.defineProperty(window, "open", {
  writable: true,
  value: mockWindowOpen,
});

const mockTranslations: Lang = {
  "sideBarAdmin-cv/view": "Voir le CV",
  buttonCV: "Download CV",
  messageCVLoading: "CV is loading...",
  messageCVNotFetch: "Failed to fetch CV",
  messageCVNotFound: "CV not found",
} as Lang;

describe("CVView Component", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({ translations: mockTranslations });
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: null });
  });

  it("renders the component with translations", (): void => {
    render(<CVView />);

    const titleElement: HTMLElement | null = screen.getByText(
      mockTranslations["sideBarAdmin-cv/view"]
    );
    const buttonElement: HTMLElement | null = screen.getByText(mockTranslations.buttonCV);

    expect(titleElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  it("shows loading alert when data is loading", (): void => {
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: true, error: null });

    render(<CVView />);

    const buttonElement: HTMLElement = screen.getByText(mockTranslations.buttonCV);
    fireEvent.click(buttonElement);

    expect(mockShowAlert).toHaveBeenCalledWith("error", mockTranslations.messageCVLoading);
  });

  it("shows error alert when query fails", (): void => {
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: new Error("fail") });

    render(<CVView />);

    const buttonElement: HTMLElement = screen.getByText(mockTranslations.buttonCV);
    fireEvent.click(buttonElement);

    expect(mockShowAlert).toHaveBeenCalledWith("error", mockTranslations.messageCVNotFetch);
  });

  it("opens the CV when data is present", (): void => {
    const mockData = { cvUrl: "/cv/test.pdf" };
    (useCvQuery as jest.Mock).mockReturnValue({ data: mockData, loading: false, error: null });

    render(<CVView />);

    const buttonElement: HTMLElement = screen.getByText(mockTranslations.buttonCV);
    fireEvent.click(buttonElement);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL || window.location.origin}${mockData.cvUrl}`,
      "_blank"
    );
  });

  it("shows not found alert when cvUrl is missing", async (): Promise<void> => {
    (useCvQuery as jest.Mock).mockReturnValue({ data: {}, loading: false, error: null });

    render(<CVView />);

    const buttonElement: HTMLElement = screen.getByText(mockTranslations.buttonCV);
    fireEvent.click(buttonElement);

    await waitFor(() =>
      expect(mockShowAlert).toHaveBeenCalledWith("error", mockTranslations.messageCVNotFound)
    );
  });
});
