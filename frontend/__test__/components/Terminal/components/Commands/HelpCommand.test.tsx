import React from "react";
import { render, screen } from "@testing-library/react";
import Help from "@/components/Terminal/components/Commands/Help";
import { commands } from "@/components/Terminal/Terminal";
import { generateTabs } from "@/components/Terminal/util";
import Lang from "@/lang/typeLang";
import { Command } from "@/components/Terminal/Terminal";

// Mock module Terminal
jest.mock("@/components/Terminal/Terminal", () => ({
  commands: [
    { cmd: "echo", descEN: "Echo text", descFR: "Affiche texte", tab: 2 },
    { cmd: "clear", descEN: "Clear screen", descFR: "Efface écran", tab: 3 },
  ] as Command,
}));

// Mock module util
jest.mock("@/components/Terminal/util", () => ({
  generateTabs: jest.fn((n: number) => " ".repeat(n)) as typeof generateTabs,
}));

// Mock  context Lang
jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      file: "en" as string,
      terminalHelpTabAction: "Tab" as string,
      terminalHelpTabDesc: "autocomplete" as string,
      terminalHelpArrowUpAction: "↑" as string,
      terminalHelpArrowUpTabDesc: "previous command" as string,
      terminalHelpArrowDownAction: "↓" as string,
      terminalHelpArrowDownTabDesc: "next command" as string,
      terminalHelpCtrlAction: "Ctrl+C" as string,
      terminalHelpCtrlTabDesc: "cancel" as string,
    }as Lang,
  } as  const)),
}as const));

describe("Help command component", () => {
  test("renders without crashing and container exists", () => {
    const { container }: { container: HTMLElement } = render(<Help />);
    const helpContainer: HTMLElement = container.firstChild as HTMLElement;
    expect(helpContainer as HTMLElement).toBeInTheDocument();
  });

  test("renders all commands with cmd and description in English", () => {
    const { container }: { container: HTMLElement } = render(<Help />);
    commands.forEach(({ cmd, descEN, tab }) => {
      expect(container.textContent as string).toContain(cmd as string);
      expect(container.textContent as string).toContain(descEN as string);
      expect(generateTabs as jest.Mock).toHaveBeenCalledWith(tab as number);
    });
  });

  test("renders commands in French if file='fr'", () => {
    // @ts-ignore
    require("@/context/Lang/LangContext").useLang.mockReturnValue({
      translations: {
        file: "fr" as string,
        terminalHelpTabAction: "Tab" as string,
        terminalHelpTabDesc: "autocomplete" as string,
        terminalHelpArrowUpAction: "↑" as string,
        terminalHelpArrowUpTabDesc: "previous command" as string,
        terminalHelpArrowDownAction: "↓" as string,
        terminalHelpArrowDownTabDesc: "next command" as string,
        terminalHelpCtrlAction: "Ctrl+C" as string,
        terminalHelpCtrlTabDesc: "cancel" as string,
      } as Lang,
    } as any);

    const { container }: { container: HTMLElement } = render(<Help />);
    commands.forEach(({ descFR, tab }) => {
      expect(container.textContent as string).toContain(descFR as string);
      expect(generateTabs as jest.Mock).toHaveBeenCalledWith(tab as number);
    });
  });

  test("renders additional terminal help instructions", () => {
    const { container }: { container: HTMLElement } = render(<Help />);
    expect(container.textContent as string).toContain("Tab" as string);
    expect(container.textContent as string).toContain("autocomplete" as string);
    expect(container.textContent as string).toContain("↑" as string);
    expect(container.textContent as string).toContain("previous command" as string);
    expect(container.textContent as string).toContain("↓" as string);
    expect(container.textContent as string).toContain("next command" as string);
    expect(container.textContent as string).toContain("Ctrl+C" as string);
    expect(container.textContent as string).toContain("cancel" as string);
  });
});