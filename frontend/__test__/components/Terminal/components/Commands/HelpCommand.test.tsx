import React from "react";
import { render, screen } from "@testing-library/react";
import Help from "@/components/Terminal/components/Commands/Help";

import { commands } from "@/components/Terminal/Terminal";
import { generateTabs } from "@/components/Terminal/util";

// Mock module Terminal
jest.mock("@/components/Terminal/Terminal", () => ({
  commands: [
    { cmd: "echo", descEN: "Echo text", descFR: "Affiche texte", tab: 2 },
    { cmd: "clear", descEN: "Clear screen", descFR: "Efface écran", tab: 3 },
  ] as any[],
} as const));

// Mock module util
jest.mock("@/components/Terminal/util", () => ({
  generateTabs: jest.fn((n: number) => " ".repeat(n)) as typeof generateTabs,
}));

// Mock  context Lang
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
    }as const,
  } as any)),
}as const));

describe("Help component", () => {
  test("renders without crashing and container exists", () => {
    const { container }: { container: HTMLElement } = render(<Help />);
    const helpContainer: HTMLElement = container.firstChild as HTMLElement;
    expect(helpContainer).toBeInTheDocument();
  });

  test("renders all commands with cmd and description in English", () => {
    const { container }: { container: HTMLElement } = render(<Help />);
    commands.forEach(({ cmd, descEN, tab }) => {
      expect(container.textContent).toContain(cmd);
      expect(container.textContent).toContain(descEN);
      expect(generateTabs).toHaveBeenCalledWith(tab);
    });
  });

  test("renders commands in French if file='fr'", () => {
    // @ts-ignore
    require("@/context/Lang/LangContext").useLang.mockReturnValue({
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
      },
    });

    const { container } = render(<Help />);
    commands.forEach(({ descFR, tab }) => {
      expect(container.textContent).toContain(descFR);
      expect(generateTabs).toHaveBeenCalledWith(tab);
    });
  });

  test("renders additional terminal help instructions", () => {
    const { container } = render(<Help />);
    expect(container.textContent).toContain("Tab");
    expect(container.textContent).toContain("autocomplete");
    expect(container.textContent).toContain("↑");
    expect(container.textContent).toContain("previous command");
    expect(container.textContent).toContain("↓");
    expect(container.textContent).toContain("next command");
    expect(container.textContent).toContain("Ctrl+C");
    expect(container.textContent).toContain("cancel");
  });
});