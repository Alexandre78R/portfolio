import React from "react";
import { render, screen, RenderResult } from "@testing-library/react";
import Lang from "@/components/Terminal/components/Commands/Lang";
import { termContext, Term } from "@/components/Terminal/Terminal";
import { useLang } from "@/context/Lang/LangContext";
import Usage from "@/components/Terminal/components/Usage";
import * as util from "@/components/Terminal/util";

// Mocks
jest.mock("@/context/Lang/LangContext");
jest.mock("@/components/Terminal/components/Usage");
jest.mock("@/components/Terminal/util");

describe("Lang component", () => {
  const mockSetLang: jest.Mock<void, [string]> = jest.fn();
  const mockCheckLangSwitch: jest.Mock<boolean, [boolean, string[], readonly string[]]> = util.checkLangSwitch as jest.Mock;
  const mockGetCurrentCmdArry: jest.Mock<string[], [string[]]> = util.getCurrentCmdArry as jest.Mock;
  const mockIsArgInvalid: jest.Mock<boolean, [string[], string, readonly string[]]> = util.isArgInvalid as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (useLang as jest.Mock).mockReturnValue({
      listLang: ["en", "fr", "de"] as const,
      setLang: mockSetLang,
    });

    (Usage as jest.Mock).mockImplementation(({ cmd }: { cmd: string }) => (
      <div data-testid={`usage-${cmd}`} />
    ));
  });

  const renderWithContext = (ctxProps: Term): RenderResult => {
    return render(
      <termContext.Provider value={ctxProps}>
        <Lang />
      </termContext.Provider>
    );
  };

  it("renders nothing if arg length <= 2 and not invalid", (): void => {
    mockGetCurrentCmdArry.mockReturnValue(["lang"]);
    mockCheckLangSwitch.mockReturnValue(false);
    mockIsArgInvalid.mockReturnValue(false);

    renderWithContext({ arg: ["lang"], history: [], rerender: false, index: 0 });

    const usageElement: HTMLElement | null = screen.queryByTestId("usage-themes");
    expect(usageElement).not.toBeInTheDocument();
  });

  it("renders Usage if argument is invalid", (): void => {
    mockGetCurrentCmdArry.mockReturnValue(["lang", "set", "es"]);
    mockCheckLangSwitch.mockReturnValue(false);
    mockIsArgInvalid.mockReturnValue(true);

    renderWithContext({ arg: ["lang", "set", "es"], history: [], rerender: false, index: 0 });

    const usageElement: HTMLElement = screen.getByTestId("usage-themes");
    expect(usageElement).toBeInTheDocument();
  });

  it("does not render languages list when args are valid", (): void => {
    mockGetCurrentCmdArry.mockReturnValue(["lang", "set", "list"]);
    mockCheckLangSwitch.mockReturnValue(false);
    mockIsArgInvalid.mockReturnValue(false);

    renderWithContext({
      arg: ["lang", "set", "list"],
      history: ["lang set list"],
      rerender: true,
      index: 0,
    });

    ["en", "fr", "de"].forEach((lang: string) => {
      const langElement: HTMLElement | null = screen.queryByText(lang);
      expect(langElement).not.toBeInTheDocument();
    });

    const usageElement: HTMLElement | null = screen.queryByTestId("usage-themes");
    expect(usageElement).not.toBeInTheDocument();
  });

  it("calls setLang if checkLangSwitch returns true and lang differs", (): void => {
    mockGetCurrentCmdArry.mockReturnValue(["lang", "set", "fr"]);
    mockCheckLangSwitch.mockReturnValue(true);
    mockIsArgInvalid.mockReturnValue(false);

    renderWithContext({ arg: ["lang", "set", "fr"], history: [], rerender: true, index: 0 });

    expect(mockSetLang).toHaveBeenCalledWith("fr");
  });

  it("does not call setLang if checkLangSwitch returns false", (): void => {
    mockGetCurrentCmdArry.mockReturnValue(["lang", "set", "fr"]);
    mockCheckLangSwitch.mockReturnValue(false);
    mockIsArgInvalid.mockReturnValue(false);

    renderWithContext({ arg: ["lang", "set", "fr"], history: [], rerender: true, index: 0 });

    expect(mockSetLang).not.toHaveBeenCalled();
  });
});