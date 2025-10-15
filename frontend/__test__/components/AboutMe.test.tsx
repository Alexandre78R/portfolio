import React, { ReactElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AboutMe from "@/components/AboutMe/AboutMe";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn() as jest.Mock<{
    translations: Lang;
  }>,
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

describe("AboutMe component", () => {
  const translations: Lang = {
    titleAboutMe: "About Me",
    descriptionAboutMe1: "Description 1",
    descriptionAboutMe2: "Description 2",
    descriptionAboutMe3: "Description 3",
    buttonCV: "Download CV",
  } as Lang;

  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({ translations });

    jest.spyOn(window as Window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders title and descriptions", (): void => {
    render(<AboutMe /> as ReactElement);

    const titleElement: HTMLElement = screen.getByText(translations.titleAboutMe);
    const desc1: HTMLElement = screen.getByText(translations.descriptionAboutMe1);
    const desc2: HTMLElement = screen.getByText(translations.descriptionAboutMe2);
    const desc3: HTMLElement = screen.getByText(translations.descriptionAboutMe3);

    expect(titleElement).toBeInTheDocument();
    expect(desc1).toBeInTheDocument();
    expect(desc2).toBeInTheDocument();
    expect(desc3).toBeInTheDocument();
  });

  it("renders CV button", (): void => {
    render(<AboutMe /> as ReactElement);

    const cvButton: HTMLButtonElement = screen.getByRole("button", {
      name: translations.buttonCV,
    }) as HTMLButtonElement;

    expect(cvButton).toBeInTheDocument();
  });

  it("opens CV PDF in new tab when button is clicked", (): void => {
    render(<AboutMe /> as ReactElement);

    const cvButton: HTMLButtonElement = screen.getByRole("button", {
      name: translations.buttonCV,
    }) as HTMLButtonElement;

    fireEvent.click(cvButton);

    expect(window.open).toHaveBeenCalledWith("/Alexandre-Renard-CV.pdf", "_blank");
  });
});