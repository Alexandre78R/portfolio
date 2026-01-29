import { type ReactElement } from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import AboutMe from "@/components/AboutMe/AboutMe";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import { useCvQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import * as redux from "@/store/hook";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import aboutMeReducer from "@/store/slices/aboutMeSlice";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/types/graphql", () => ({
  useCvQuery: jest.fn(),
}));

jest.mock("@/store/hook", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock("@/store/hook", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

const showAlertMock: jest.Mock<(type: "success" | "error", message: string) => void> = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: showAlertMock })),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true as const,
  default: ({ text, onClick }: { text: string; onClick: () => void }): ReactElement => (
    <button onClick={onClick}>{text}</button>
  ),
}));

jest.mock("@/components/Title/TitleH3", () => ({
  __esModule: true as const,
  default: ({ title }: { title: string }): ReactElement => <h3>{title}</h3>,
}));

describe("AboutMe component", (): void => {
  const translations: Lang = {
    titleAboutMe: "<h3 class='text-title font-bold text-2xl mb-4'>About Me</h3>",
    descriptionAboutMe: "<p class='text-text mt-4'>Description 1</p><p class='text-text mt-4'>Description 2</p><p class='text-text mt-4'>Description 3</p>",
    buttonCV: "Download CV",
    messageCVLoading: "Loading CV...",
    messageCVNotFetch: "Error fetching CV",
    messageCVNotFound: "CV not found",
  } as Lang;

  const mockAboutMe = {
    id: 1,
    titleEN: "<h3 class='text-title font-bold text-2xl mb-4'>About Me EN</h3>",
    titleFR: "<h3 class='text-title font-bold text-2xl mb-4'>À propos de moi</h3>",
    descriptionEN: "Description EN",
    descriptionFR: "Description FR",
  };

  const mockWindowOpen: jest.SpyInstance = jest.spyOn(window, "open").mockImplementation(() => null);

  beforeEach((): void => {
    showAlertMock.mockClear();
    mockWindowOpen.mockClear();
    (useLang as jest.Mock).mockReturnValue({ translations, lang: "en" });
    (CustomToast as jest.Mock).mockReturnValue({ showAlert: showAlertMock });
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: null });
    (redux.useAppSelector as jest.Mock).mockReturnValue(mockAboutMe);
  });

  afterAll((): void => {
    jest.restoreAllMocks();
  });

  it("renders title and descriptions", (): void => {
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: null });
    render(<AboutMe />);

    expect(screen.getByText(/About Me EN/)).toBeInTheDocument();
    expect(screen.getByText(/Description EN/)).toBeInTheDocument();
  });

  it("renders the CV download button", (): void => {
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: null });
    render(<AboutMe />);

    const cvButton: HTMLButtonElement = screen.getByRole("button", { name: translations.buttonCV }) as HTMLButtonElement;
    expect(cvButton).toBeInTheDocument();
  });

  it("shows loading alert if button is clicked while loading", (): void => {
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: true, error: null });

    render(<AboutMe />);
    const cvButton: HTMLButtonElement = screen.getByRole("button", { name: translations.buttonCV }) as HTMLButtonElement;
    fireEvent.click(cvButton);

    expect(showAlertMock).toHaveBeenCalledWith("error", translations.messageCVLoading);
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("shows error alert if GraphQL query failed", (): void => {
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: new Error("fail") });

    render(<AboutMe />);
    const cvButton: HTMLButtonElement = screen.getByRole("button", { name: translations.buttonCV }) as HTMLButtonElement;
    fireEvent.click(cvButton);

    expect(showAlertMock).toHaveBeenCalledWith("error", translations.messageCVNotFetch);
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("opens CV in new tab if data.cvUrl exists", (): void => {
    const cvUrl: string = "/api/uploads/cv/Alexandre-Renard-CV.pdf";
    (useCvQuery as jest.Mock).mockReturnValue({ data: { cvUrl }, loading: false, error: null });

    render(<AboutMe />);
    const cvButton: HTMLButtonElement = screen.getByRole("button", { name: translations.buttonCV }) as HTMLButtonElement;
    fireEvent.click(cvButton);

    const expectedUrl: string = `${process.env.NEXT_PUBLIC_API_URL || window.location.origin}${cvUrl}`;
    expect(mockWindowOpen).toHaveBeenCalledWith(expectedUrl, "_blank");
    expect(showAlertMock).not.toHaveBeenCalled();
  });

  it("shows CV not found alert if cvUrl is null", (): void => {
    (useCvQuery as jest.Mock).mockReturnValue({ data: { cvUrl: null }, loading: false, error: null });

    render(<AboutMe />);
    const cvButton: HTMLButtonElement = screen.getByRole("button", { name: translations.buttonCV }) as HTMLButtonElement;
    fireEvent.click(cvButton);

    expect(showAlertMock).toHaveBeenCalledWith("success", translations.messageCVNotFound);
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });
});
