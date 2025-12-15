import React from "react";
import { render, screen, RenderResult } from '@test-utils';
import Whoami from "@/components/Terminal/components/Commands/Whoami";
import { termContext, Term } from "@/components/Terminal/Terminal";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

jest.mock(
  "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiError",
  () => ({
    __esModule: true as boolean,
    default: ({ message }: { message: string }) =>
      <div data-testid="whoami-error">{message}</div> as React.ReactElement,
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

describe("Whoami Component", () => {
  const translationsMock: Lang = {
    terminalWhoamiNotArg: "Aucun argument fourni",
    terminalWhoamiMaxOneArg: "Maximum un argument",
    terminalWhoamiChoiceNotExiste: "Choix inexistant",
  } as Lang;

  const termMock: Term = {
    arg: [],
    history: [],
    rerender: false,
    index: 0,
  };

  const renderWithContext = (args: string[]): RenderResult =>
    render(
      <termContext.Provider value={{ ...termMock, arg: args }}>
        <Whoami />
      </termContext.Provider>
    );

  beforeEach((): void => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({ translations: translationsMock });
  });

  it("renders WhoamiError when no arguments", (): void => {
    renderWithContext([]);
    const errorElement: HTMLElement = screen.getByTestId("whoami-error");
    expect(errorElement).toHaveTextContent(translationsMock.terminalWhoamiNotArg);
  });

  it("renders WhoamiError when more than one argument", (): void => {
    renderWithContext(["one", "two"]);
    const errorElement: HTMLElement = screen.getByTestId("whoami-error");
    expect(errorElement).toHaveTextContent(translationsMock.terminalWhoamiMaxOneArg);
  });

  it("renders WhoamiExperience when argument is 'experiences'", (): void => {
    renderWithContext(["experiences"]);
    const expElement: HTMLElement = screen.getByTestId("whoami-experience");
    expect(expElement).toBeInTheDocument();
  });

  it("renders WhoamiEducation when argument is 'educations'", (): void => {
    renderWithContext(["educations"]);
    const eduElement: HTMLElement = screen.getByTestId("whoami-education");
    expect(eduElement).toBeInTheDocument();
  });

  it("renders WhoamiSkills when argument is 'skills'", (): void => {
    renderWithContext(["skills"]);
    const skillsElement: HTMLElement = screen.getByTestId("whoami-skills");
    expect(skillsElement).toBeInTheDocument();
  });

  it("renders WhoamiError when argument is unknown", (): void => {
    renderWithContext(["unknown"]);
    const errorElement: HTMLElement = screen.getByTestId("whoami-error");
    expect(errorElement).toHaveTextContent(translationsMock.terminalWhoamiChoiceNotExiste);
  });
});
