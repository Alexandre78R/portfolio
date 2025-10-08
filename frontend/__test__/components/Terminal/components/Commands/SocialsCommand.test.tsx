import React from "react";
import { render, screen } from "@testing-library/react";
import Socials from "@/components/Terminal/components/Commands/Socials";
import { termContext } from "@/components/Terminal/Terminal";
import * as util from "@/components/Terminal/util";

// ---------- mocks ----------
jest.mock("@/components/Terminal/util", () => ({
  getCurrentCmdArry: jest.fn(),
  checkRedirect: jest.fn(),
  isArgInvalid: jest.fn(),
  generateTabs: jest.fn(() => "   "),
}));

jest.mock("@/components/Terminal/components/Usage", () => {
  function UsageMock(props: any) { 
    return <div data-testid={`usage-${props.cmd}`} /> as React.ReactElement;
  }
  UsageMock.displayName = "Usage" as string;
  return UsageMock as React.FC<any>;
});

jest.mock("@/components/Terminal/components/Message", () => {
  const MessageMock = ({ children, ...props }: any) => (
    <div {...props}>{children}</div> as React.ReactElement
  );

  MessageMock.displayName = "Message" as string;

  return {
    __esModule: true as boolean,
    Message: MessageMock, // export nommé
  };
});

describe("Socials command", () => {
  const mockGetCurrentCmdArry : jest.Mock = util.getCurrentCmdArry as jest.Mock;
  const mockCheckRedirect : jest.Mock = util.checkRedirect as jest.Mock;
  const mockIsArgInvalid : jest.Mock = util.isArgInvalid as jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = (ctx: any) =>
    render(
      <termContext.Provider value={ctx}>
        <Socials />
      </termContext.Provider>
    );

  // ---------------- TESTS ----------------

  test("renders socials list when no args are provided", () => {
    mockGetCurrentCmdArry.mockReturnValue([] as any[]);
    mockIsArgInvalid.mockReturnValue(false as boolean);

    renderWithContext({
      arg: [] as string[],
      history: [] as string[],
      rerender: false as boolean,
    });

    expect(screen.getByTestId("socials" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("1. GitHub" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("2. linkedin" as string) as HTMLElement).toBeInTheDocument();
    expect(
      screen.getByText("https://github.com/Alexandre78R" as string) as HTMLElement).
      toBeInTheDocument();
    expect(
      screen.getByText(
        "https://www.linkedin.com/in/alexandrerenard/" as string) as HTMLElement
    ).toBeInTheDocument();

    expect(screen.getByTestId("usage-socials" as string) as HTMLElement).toBeInTheDocument();
  });

  test("renders Usage when arguments are invalid", () => {
    mockGetCurrentCmdArry.mockReturnValue(["socials", "go", "3"] as any[]);
    mockIsArgInvalid.mockReturnValue(true as boolean);

    renderWithContext({
      arg: ["socials", "go", "3"] as string[],
      history: [] as string[],
      rerender: false as boolean,
    });

    expect(screen.getByTestId("usage-socials" as string) as HTMLElement).toBeInTheDocument();
  });

  test("does not render socials list when args are present", () => {
    mockGetCurrentCmdArry.mockReturnValue(["socials", "go", "1"] as string[]);
    mockIsArgInvalid.mockReturnValue(false as boolean);

    renderWithContext({
      arg: ["socials", "go", "1"] as string[],
      history: [] as string[],
      rerender: false as boolean,
    });

    expect(screen.queryByTestId("socials" as  string) as HTMLElement).not.toBeInTheDocument();
  });

  test("opens correct url when redirect condition is met", () => {
    const openSpy = jest
      .spyOn(window as Window, "open" as "open")
      .mockImplementation(() => null as unknown as Window);

    mockGetCurrentCmdArry.mockReturnValue(["socials", "go", "1"] as string[]);
    mockCheckRedirect.mockReturnValue(true as boolean);
    mockIsArgInvalid.mockReturnValue(false as boolean);

    renderWithContext({
      arg: ["socials", "1"] as string[],
      history: ["socials 1"] as string[],
      rerender: true as boolean,
    });

    expect(openSpy).toHaveBeenCalledWith(
      "https://github.com/Alexandre78R" as string,
      "_blank" as string
    ) as unknown as void;

    openSpy.mockRestore();
  });

  test("does not redirect when checkRedirect returns false", () => {
    const openSpy = jest
      .spyOn(window as Window, "open" as "open")
      .mockImplementation(() => null as unknown as Window);

    mockGetCurrentCmdArry.mockReturnValue(["socials", "go", "1"] as string[]);
    mockCheckRedirect.mockReturnValue(false as boolean);

    renderWithContext({
      arg: ["socials", "1"] as string[],
      history: ["socials 1"] as string[],
      rerender: true as boolean,
    });

    expect(openSpy as jest.Mock).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });
});