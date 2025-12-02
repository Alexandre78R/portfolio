import React from "react";
import { render, screen, RenderResult } from "@testing-library/react";
import Socials from "@/components/Terminal/components/Commands/Socials";
import { termContext, Term } from "@/components/Terminal/Terminal";
import * as util from "@/components/Terminal/util";

jest.mock("@/store/hook", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/components/Terminal/util", () => ({
  getCurrentCmdArry: jest.fn() as jest.Mock,
  checkRedirect: jest.fn() as jest.Mock,
  isArgInvalid: jest.fn() as jest.Mock,
  generateTabs: jest.fn(() => "   ") as jest.Mock,
}));

jest.mock("@/components/Terminal/components/Usage", () => {
  const UsageMock: React.FC<{ cmd: string }> = (props) => (
    <div data-testid={`usage-${props.cmd}`} />
  );
  UsageMock.displayName = "Usage";
  return UsageMock;
});

jest.mock("@/components/Terminal/components/Message", () => {
  const MessageMock: React.FC<React.PropsWithChildren<unknown>> = ({ children, ...props }) => (
    <div {...props}>{children}</div>
  );
  MessageMock.displayName = "Message";
  return { __esModule: true, Message: MessageMock };
});

const mockSocials: Socials[] = [
  {
    id: 1,
    title: "GitHub",
    url: "https://github.com/Alexandre78R",
    tab: 3,
  },
  {
    id: 2,
    title: "linkedin",
    url: "https://www.linkedin.com/in/alexandrerenard/",
    tab: 3,
  },
];

describe("Socials command", () => {
  const mockGetCurrentCmdArry: jest.Mock = util.getCurrentCmdArry as jest.Mock;
  const mockCheckRedirect: jest.Mock = util.checkRedirect as jest.Mock;
  const mockIsArgInvalid: jest.Mock = util.isArgInvalid as jest.Mock;

  beforeEach((): void => {
    jest.clearAllMocks();
    const { useAppSelector } = require("@/store/hook");
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({ socials: { dataSocials: mockSocials } })
    );
  });

  const renderWithContext = (ctx: Term): RenderResult =>
    render(
      <termContext.Provider value={ctx}>
        <Socials />
      </termContext.Provider>
    );

  it("renders socials list when no args are provided", (): void => {
    mockGetCurrentCmdArry.mockReturnValue([] as string[]);
    mockIsArgInvalid.mockReturnValue(false);

    renderWithContext({
      arg: [],
      history: [],
      rerender: false,
      index: 0,
    });

    const socialsContainer: HTMLElement = screen.getByTestId("socials");
    const githubText: HTMLElement = screen.getByText("1. GitHub");
    const linkedinText: HTMLElement = screen.getByText("2. linkedin");
    const githubUrl: HTMLElement = screen.getByText("https://github.com/Alexandre78R");
    const linkedinUrl: HTMLElement = screen.getByText(
      "https://www.linkedin.com/in/alexandrerenard/"
    );
    const usageElement: HTMLElement = screen.getByTestId("usage-socials");

    expect(socialsContainer).toBeInTheDocument();
    expect(githubText).toBeInTheDocument();
    expect(linkedinText).toBeInTheDocument();
    expect(githubUrl).toBeInTheDocument();
    expect(linkedinUrl).toBeInTheDocument();
    expect(usageElement).toBeInTheDocument();
  });

  it("renders Usage when arguments are invalid", (): void => {
    mockGetCurrentCmdArry.mockReturnValue(["socials", "go", "3"]);
    mockIsArgInvalid.mockReturnValue(true);

    renderWithContext({
      arg: ["socials", "go", "3"],
      history: [],
      rerender: false,
      index: 0,
    });

    const usageElement: HTMLElement = screen.getByTestId("usage-socials");
    expect(usageElement).toBeInTheDocument();
  });

  it("does not render socials list when args are present", (): void => {
    mockGetCurrentCmdArry.mockReturnValue(["socials", "go", "1"]);
    mockIsArgInvalid.mockReturnValue(false);

    renderWithContext({
      arg: ["socials", "go", "1"],
      history: [],
      rerender: false,
      index: 0,
    });

    const socialsContainer: HTMLElement | null = screen.queryByTestId("socials");
    expect(socialsContainer).not.toBeInTheDocument();
  });

  it("opens correct url when redirect condition is met", (): void => {
    const openSpy: jest.SpyInstance = jest
      .spyOn(window, "open")
      .mockImplementation(() => null as unknown as Window);

    mockGetCurrentCmdArry.mockReturnValue(["socials", "go", "1"]);
    mockCheckRedirect.mockReturnValue(true);
    mockIsArgInvalid.mockReturnValue(false);

    renderWithContext({
      arg: ["socials", "1"],
      history: ["socials 1"],
      rerender: true,
      index: 0,
    });

    expect(openSpy).toHaveBeenCalledWith(
      "https://github.com/Alexandre78R",
      "_blank"
    );

    openSpy.mockRestore();
  });

  it("does not redirect when checkRedirect returns false", (): void => {
    const openSpy: jest.SpyInstance = jest
      .spyOn(window, "open")
      .mockImplementation(() => null as unknown as Window);

    mockGetCurrentCmdArry.mockReturnValue(["socials", "go", "1"]);
    mockCheckRedirect.mockReturnValue(false);

    renderWithContext({
      arg: ["socials", "1"],
      history: ["socials 1"],
      rerender: true,
      index: 0,
    });

    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });
});