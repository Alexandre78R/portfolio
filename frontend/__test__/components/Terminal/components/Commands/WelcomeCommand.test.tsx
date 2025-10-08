import React, { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import Welcome from "@/components/Terminal/components/Commands/Welcome";
import { termContext } from "@/components/Terminal/Terminal";
import { useLang } from "@/context/Lang/LangContext";
import { Term } from "@/components/Terminal/Terminal";

jest.mock("@/context/Lang/LangContext");

const translationsMock : { terminalWelcomeMessage : string, terminalWelcomeMessageHelp : string  } = {
  terminalWelcomeMessage: "Bienvenue sur le terminal !",
  terminalWelcomeMessageHelp: "Tapez",
};

const mockTermContextValue : Term = {
  arg: [],
  history: [],
  rerender: false,
  index: 0,
};

describe("Welcome Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({ 
      translations: translationsMock as typeof translationsMock
    });
  });

  const renderWithContext = (ui: ReactNode) => {
    return render(
      <termContext.Provider value={mockTermContextValue}>
        {ui}
      </termContext.Provider>
    );
  };

  test("renders without crashing", () => {
    renderWithContext(<Welcome /> as React.ReactElement);

    expect(screen.getByText(translationsMock.terminalWelcomeMessage) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("help") as HTMLElement).toBeInTheDocument();
  });

  test("renders ASCII art", () => {
    renderWithContext(<Welcome /> as React.ReactElement);
    expect(screen.getAllByText(/\(/ as RegExp) as HTMLElement[]).toHaveLength(2);
  });
});