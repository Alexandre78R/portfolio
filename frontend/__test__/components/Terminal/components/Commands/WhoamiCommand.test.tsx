import React from "react";
import { render, screen } from "@testing-library/react";
import Whoami from "@/components/Terminal/components/Commands/Whoami";
import { termContext, Term } from "@/components/Terminal/Terminal";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

jest.mock(
  "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiError",
  () => ({
    __esModule: true as boolean,
    default: ({ message }: { message: string }) => (
      <div data-testid="whoami-error">{message}</div> as React.ReactElement
    ),
  })
);

jest.mock(
  "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiExperience",
  () => ({
    __esModule: true as boolean,
    default: () => <div data-testid="whoami-experience" /> as React.ReactElement,
  })
);

jest.mock(
  "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiEducation",
  () => ({
    __esModule: true as boolean,
    default: () => <div data-testid="whoami-education" /> as React.ReactElement,
  })
);

jest.mock(
  "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiSkills",
  () => ({
    __esModule: true as boolean,
    default: () => <div data-testid="whoami-skills" /> as React.ReactElement,
  })
);

jest.mock("@/context/Lang/LangContext", () => ({
  __esModule: true as boolean,
  useLang: jest.fn() as jest.Mock,
}));

// ===================== Test =====================
describe("Whoami Component", () => {
  const translationsMock : Lang = {
    terminalWhoamiNotArg: "Aucun argument fourni" as string,
    terminalWhoamiMaxOneArg: "Maximum un argument" as string,
    terminalWhoamiChoiceNotExiste: "Choix inexistant"as string,
  }  as Lang;

  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({ translations: translationsMock });
  });

  const termMock: Term = {
    arg: [],
    history: [],
    rerender: false,
    index: 0,
  };

  const renderWithContext = (arg: string[]) =>
    render(
      <termContext.Provider value={{ ...termMock, arg }}>
        <Whoami />
      </termContext.Provider>
    );

    
  test("renders WhoamiError when no arguments", () => {
    renderWithContext([] as string[]);
    expect(screen.getByTestId("whoami-error" as string) as HTMLElement).toHaveTextContent(
      translationsMock.terminalWhoamiNotArg as string
    );
  });

  test("renders WhoamiError when more than one argument", () => {
    renderWithContext(["one", "two"] as string[]);
    expect(screen.getByTestId("whoami-error" as string) as HTMLElement).toHaveTextContent(
      translationsMock.terminalWhoamiMaxOneArg as string
    );
  });

  test("renders WhoamiExperience when argument is 'experiences'", () => {
    renderWithContext(["experiences"] as string[]);
    expect(screen.getByTestId("whoami-experience" as string) as HTMLElement).toBeInTheDocument();
  });

  test("renders WhoamiEducation when argument is 'educations'", () => {
    renderWithContext(["educations"] as string[]);
    expect(screen.getByTestId("whoami-education" as string)as HTMLElement).toBeInTheDocument();
  });

  test("renders WhoamiSkills when argument is 'skills'", () => {
    renderWithContext(["skills"] as string[]);
    expect(screen.getByTestId("whoami-skills" as string) as HTMLElement).toBeInTheDocument();
  });

  test("renders WhoamiError when argument is unknown", () => {
    renderWithContext(["unknown"] as string[]);
    expect(screen.getByTestId("whoami-error" as string) as HTMLElement).toHaveTextContent(
      translationsMock.terminalWhoamiChoiceNotExiste as string
    );
  });
});