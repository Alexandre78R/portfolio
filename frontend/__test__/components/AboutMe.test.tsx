import { type ReactElement } from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import AboutMe from "@/components/AboutMe/AboutMe";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import { useCvQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/types/graphql", () => ({
  useCvQuery: jest.fn(),
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
    titleAboutMe: "About Me",
    descriptionAboutMe1: "Description 1",
    descriptionAboutMe2: "Description 2",
    descriptionAboutMe3: "Description 3",
    buttonCV: "Download CV",
    messageCVLoading: "Loading CV...",
    messageCVNotFetch: "Error fetching CV",
    messageCVNotFound: "CV not found",
  } as Lang;

  const mockWindowOpen: jest.SpyInstance = jest.spyOn(window, "open").mockImplementation(() => null);

  beforeEach((): void => {
    (useLang as jest.Mock).mockReturnValue({ translations });
    (CustomToast as jest.Mock).mockReturnValue({ showAlert: showAlertMock });
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: null });
    jest.clearAllMocks();
  });

  afterAll((): void => {
    jest.restoreAllMocks();
  });

  it("renders title and descriptions", (): void => {
    render(<AboutMe />);

    expect(screen.getByText(translations.titleAboutMe)).toBeInTheDocument();
    expect(screen.getByText(translations.descriptionAboutMe1)).toBeInTheDocument();
    expect(screen.getByText(translations.descriptionAboutMe2)).toBeInTheDocument();
    expect(screen.getByText(translations.descriptionAboutMe3)).toBeInTheDocument();
  });

  it("renders the CV download button", (): void => {
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
