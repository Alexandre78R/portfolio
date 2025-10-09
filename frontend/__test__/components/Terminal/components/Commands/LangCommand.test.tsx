import React from "react";
import { render, screen } from "@testing-library/react";
import Lang from "@/components/Terminal/components/Commands/Lang";
import { termContext } from "@/components/Terminal/Terminal";
import { useLang } from "@/context/Lang/LangContext";
import Usage from "@/components/Terminal/components/Usage";
import * as util from "@/components/Terminal/util";

// Mocks
jest.mock("@/context/Lang/LangContext");
jest.mock("@/components/Terminal/components/Usage");
jest.mock("@/components/Terminal/util");

describe("Lang component", () => {
  const mockSetLang: jest.Mock = jest.fn();
  const mockCheckLangSwitch: jest.Mock = util.checkLangSwitch as jest.Mock;
  const mockGetCurrentCmdArry: jest.Mock = util.getCurrentCmdArry as jest.Mock;
  const mockIsArgInvalid: jest.Mock = util.isArgInvalid as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({
      listLang: ["en", "fr", "de"] as const,
      setLang: mockSetLang as jest.Mock,
    });
    (Usage as jest.Mock).mockImplementation(({ cmd }) => <div data-testid={`usage-${cmd}`} />);
  });

  const renderWithContext = (ctxProps: any): ReturnType<typeof render> => {
    return render(
      <termContext.Provider value={ctxProps}>
        <Lang />
      </termContext.Provider>
    );
  };

  test("renders nothing if arg length <= 2", () => {
    mockGetCurrentCmdArry.mockReturnValue(["lang"] as string[]) as jest.Mock;
    mockCheckLangSwitch.mockReturnValue(false as boolean) as jest.Mock;
    mockIsArgInvalid.mockReturnValue(false as boolean) as jest.Mock;

    renderWithContext({ arg: ["lang"], history: [], rerender: false } as { arg: string[]; history: string[]; rerender: boolean });
    expect(screen.queryByTestId("usage-lang" as string)).not.toBeInTheDocument();
  });

  test("renders Usage if argument is invalid", () => {
    mockGetCurrentCmdArry.mockReturnValue(["lang", "set", "es"] as string[]);
    mockCheckLangSwitch.mockReturnValue(false as boolean) as jest.Mock;
    mockIsArgInvalid.mockReturnValue(true as boolean) as jest.Mock;

    renderWithContext({ arg: ["lang", "set", "es"], history: [], rerender: false } as { arg: string[]; history: string[]; rerender: boolean });
    expect(screen.getByTestId("usage-themes" as string) as HTMLElement).toBeInTheDocument();
  });

  test("does not render languages list when args are valid", () => {
    mockGetCurrentCmdArry.mockReturnValue(["lang", "set", "list"] as string[]);
    mockCheckLangSwitch.mockReturnValue(false as boolean);
    mockIsArgInvalid.mockReturnValue(false as boolean);

    renderWithContext({
      arg: ["lang", "set", "list"] as string[],
      history: ["lang set list"] as string[],
      rerender: true as boolean,
    });

    ["en", "fr", "de"].forEach((lang) => {
      expect(screen.queryByText(lang as string) as HTMLElement).not.toBeInTheDocument();
    });

    expect(screen.queryByTestId("usage-lang" as string) as HTMLElement).not.toBeInTheDocument();
  });

  test("calls setLang if checkLangSwitch returns true and lang differs", () => {
    mockGetCurrentCmdArry.mockReturnValue(["lang", "set", "fr"] as string[]);
    mockCheckLangSwitch.mockReturnValue(true as boolean);
    mockIsArgInvalid.mockReturnValue(false as boolean);

    renderWithContext({ arg: ["lang", "set", "fr"], history: [], rerender: true } as { arg: string[]; history: string[]; rerender: boolean });

    expect(mockSetLang as jest.Mock).toHaveBeenCalledWith("fr" as string);
  });

  test("does not call setLang if checkLangSwitch returns false", () => {
    mockGetCurrentCmdArry.mockReturnValue(["lang", "set", "fr"] as any[]);
    mockCheckLangSwitch.mockReturnValue(false as boolean);
    mockIsArgInvalid.mockReturnValue(false as boolean);

    renderWithContext({ arg: ["lang", "set", "fr"], history: [], rerender: true } as { arg: string[]; history: string[]; rerender: boolean });

    expect(mockSetLang as jest.Mock).not.toHaveBeenCalled();
  });
});