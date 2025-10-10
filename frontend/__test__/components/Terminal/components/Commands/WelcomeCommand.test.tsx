import React, { ReactNode } from "react";
import { render, screen, RenderResult } from "@testing-library/react";
import Welcome from "@/components/Terminal/components/Commands/Welcome";
import { termContext, Term } from "@/components/Terminal/Terminal";
import { useLang } from "@/context/Lang/LangContext";

// ---------- Mocks ----------
jest.mock("@/context/Lang/LangContext");

const translationsMock: { terminalWelcomeMessage: string; terminalWelcomeMessageHelp: string } = {
  terminalWelcomeMessage: "Bienvenue sur le terminal !",
  terminalWelcomeMessageHelp: "Tapez",
};

const mockTermContextValue: Term = {
  arg: [],
  history: [],
  rerender: false,
  index: 0,
};

// ---------- Helpers ----------
const renderWithContext = (ui: React.ReactNode, contextValue: Term = mockTermContextValue): RenderResult => {
  return render(
    <termContext.Provider value={contextValue}>
      {ui}
    </termContext.Provider>
  );
};

// ---------- Tests ----------
describe("Welcome Component", () => {
  beforeEach((): void => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({
      translations: translationsMock,
    });
  });

  it("renders without crashing", (): void => {
    renderWithContext(<Welcome />);

    const welcomeMessage: HTMLElement = screen.getByText(translationsMock.terminalWelcomeMessage);
    const helpText: HTMLElement = screen.getByText("help");

    expect(welcomeMessage).toBeInTheDocument();
    expect(helpText).toBeInTheDocument();
  });

  it("renders ASCII art", (): void => {
    renderWithContext(<Welcome />);

    const asciiElements: HTMLElement[] = screen.getAllByText(/\(/);
    expect(asciiElements).toHaveLength(2);
  });
});