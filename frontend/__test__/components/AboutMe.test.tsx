import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AboutMe from "@/components/AboutMe/AboutMe";
import { useLang } from "@/context/Lang/LangContext";

/* =========================
   MOCKS
========================= */

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

jest.mock("@/components/Title/TitleH3", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h3>{title}</h3>,
}));

/* =========================
   TESTS
========================= */

describe("AboutMe component", () => {
  const translations = {
    titleAboutMe: "About Me",
    descriptionAboutMe1: "Description 1",
    descriptionAboutMe2: "Description 2",
    descriptionAboutMe3: "Description 3",
    buttonCV: "Download CV",
  };

  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({ translations });

    jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders title and descriptions", () => {
    render(<AboutMe />);

    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
    expect(screen.getByText("Description 3")).toBeInTheDocument();
  });

  it("renders CV button", () => {
    render(<AboutMe />);

    expect(
      screen.getByRole("button", { name: "Download CV" })
    ).toBeInTheDocument();
  });

  it("opens CV PDF in new tab when button is clicked", () => {
    render(<AboutMe />);

    fireEvent.click(
      screen.getByRole("button", { name: "Download CV" })
    );

    expect(window.open).toHaveBeenCalledWith(
      "/Alexandre-Renard-CV.pdf",
      "_blank"
    );
  });
});