import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AboutMe from "@/components/AboutMe/AboutMe";
import { useLang } from "@/context/Lang/LangContext";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn() as jest.Mock,
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true as const,
  default: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

jest.mock("@/components/Title/TitleH3", () => ({
  __esModule: true as const,
  default: ({ title }: { title: string }) => <h3>{title}</h3>,
}));


describe("AboutMe component", () => {
  const translations: Record<string, string> = {
    titleAboutMe: "About Me" as const,
    descriptionAboutMe1: "Description 1" as const,
    descriptionAboutMe2: "Description 2" as const,
    descriptionAboutMe3: "Description 3" as const,
    buttonCV: "Download CV" as const,
  };

  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({ translations });

    jest.spyOn(window as Window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders title and descriptions", () => {
    render(<AboutMe /> as React.ReactElement);

    expect(screen.getByText("About Me" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Description 1" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Description 2" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Description 3" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders CV button", () => {
    render(<AboutMe /> as React.ReactElement);

    expect(
      screen.getByRole("button" as keyof HTMLElementTagNameMap, { name: "Download CV" as string } as Partial<HTMLElement>)
    ).toBeInTheDocument();
  });

  it("opens CV PDF in new tab when button is clicked", () => {
    render(<AboutMe /> as React.ReactElement);

    fireEvent.click(
      screen.getByRole("button" as keyof HTMLElementTagNameMap, { name: "Download CV" as string } as Partial<HTMLElement>)
    );

    expect(window.open).toHaveBeenCalledWith(
      "/Alexandre-Renard-CV.pdf" as string,
      "_blank" as string
    );
  });
});