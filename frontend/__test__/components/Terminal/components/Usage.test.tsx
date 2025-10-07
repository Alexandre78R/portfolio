import React from "react";
import { render, screen } from "@testing-library/react";
import Usage from "../../../../src/components/Terminal/components/Usage";

const arg: Record<string, { placeholder: string; example: string }> = {
  socials: { placeholder: "social" as const, example: "1" as const },
  themes: { placeholder: "theme-name" as const, example: "ubuntu" as const },
  whoami: { placeholder: "whoami-view" as const, example: "experience" as const },
  lang: { placeholder: "lang-name" as const, example: "fr" as const },
};

describe("Usage component", () => {
  const commands: readonly (keyof typeof arg)[] = ["socials", "themes", "whoami", "lang"] as const;

  const expectedActions: Record<typeof commands[number], string> = {
    socials: "go" as const,
    themes: "set" as const,
    whoami: "" as const,
    lang: "set" as const,
  };

  const expectedExamples: Record<typeof commands[number], string> = {
    socials: "1" as const,
    themes: "ubuntu" as const,
    whoami: "experience" as const,
    lang: "fr" as const,
  };

  commands.forEach((cmd) => {
    test(`renders correct usage for cmd="${cmd}"`, () => {
      render(<Usage cmd={cmd as "socials" | "themes" | "whoami" | "lang"} /> as React.ReactElement);

      const action: string = expectedActions[cmd] as string;
      const example: string = expectedExamples[cmd] as string;

      expect(
        screen.getByText((content) =>
          content.includes(`Usage: ${cmd}` as string) &&
          content.includes(`<${arg[cmd].placeholder}>` as string)
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText((content) =>
          content.includes(`Ex: ${cmd}` as string) && content.includes(example as string)
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText((content) =>
          content.includes(`Ex: ${cmd}` as string) && content.includes(action as string)
        )
      ).toBeInTheDocument();
    });
  });
});
