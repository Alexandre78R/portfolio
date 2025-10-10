import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Help from "@/components/Terminal/components/Commands/Help";
import { commands, Command } from "@/components/Terminal/Terminal";
import { generateTabs } from "@/components/Terminal/util";
import Lang from "@/lang/typeLang";

jest.mock("@/components/Terminal/Terminal", () => ({
  commands: [
    { cmd: "echo", descEN: "Echo text", descFR: "Affiche texte", tab: 2 },
    { cmd: "clear", descEN: "Clear screen", descFR: "Efface écran", tab: 3 },
  ] as Command,
}));

jest.mock("@/components/Terminal/util", () => ({
  generateTabs: jest.fn((n: number) => " ".repeat(n)) as typeof generateTabs,
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      file: "en",
      terminalHelpTabAction: "Tab",
      terminalHelpTabDesc: "autocomplete",
      terminalHelpArrowUpAction: "↑",
      terminalHelpArrowUpTabDesc: "previous command",
      terminalHelpArrowDownAction: "↓",
      terminalHelpArrowDownTabDesc: "next command",
      terminalHelpCtrlAction: "Ctrl+C",
      terminalHelpCtrlTabDesc: "cancel",
    } as Lang,
  })),
}));

describe("Help command component", () => {
  it("renders without crashing and container exists", (): void => {
    const renderResult: RenderResult = render(<Help />);
    const container: HTMLElement = renderResult.container;
    const helpContainer: HTMLElement | null = container.firstChild as HTMLElement;
    expect(helpContainer).toBeInTheDocument();
  });

  it("renders all commands with cmd and description in English", (): void => {
    const renderResult: RenderResult = render(<Help />);
    const container: HTMLElement = renderResult.container;

    commands.forEach(({ cmd, descEN, tab }) => {
      expect(container.textContent).toContain(cmd);
      expect(container.textContent).toContain(descEN);
      expect(generateTabs).toHaveBeenCalledWith(tab);
    });
  });

  it("renders commands in French if file='fr'", (): void => {
    const useLangMock: jest.Mock = require("@/context/Lang/LangContext").useLang;
    useLangMock.mockReturnValue({
      translations: {
        file: "fr",
        terminalHelpTabAction: "Tab",
        terminalHelpTabDesc: "autocomplete",
        terminalHelpArrowUpAction: "↑",
        terminalHelpArrowUpTabDesc: "previous command",
        terminalHelpArrowDownAction: "↓",
        terminalHelpArrowDownTabDesc: "next command",
        terminalHelpCtrlAction: "Ctrl+C",
        terminalHelpCtrlTabDesc: "cancel",
      } as Lang,
    });

    const renderResult: RenderResult = render(<Help />);
    const container: HTMLElement = renderResult.container;

    commands.forEach(({ descFR, tab }) => {
      expect(container.textContent).toContain(descFR);
      expect(generateTabs).toHaveBeenCalledWith(tab);
    });
  });

  it("renders additional terminal help instructions", (): void => {
    const renderResult: RenderResult = render(<Help />);
    const container: HTMLElement = renderResult.container;
    const textContent: string | null = container.textContent;

    expect(textContent).toContain("Tab");
    expect(textContent).toContain("autocomplete");
    expect(textContent).toContain("↑");
    expect(textContent).toContain("previous command");
    expect(textContent).toContain("↓");
    expect(textContent).toContain("next command");
    expect(textContent).toContain("Ctrl+C");
    expect(textContent).toContain("cancel");
  });
});