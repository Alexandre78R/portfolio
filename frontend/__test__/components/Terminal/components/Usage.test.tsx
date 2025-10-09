import React from "react";
import { render, screen } from "@testing-library/react";
import Usage from "../../../../src/components/Terminal/components/Usage";

const arg: Record<string, { placeholder: string; example: string }> = {
  socials: { placeholder: "social" as string, example: "1" as string },
  themes: { placeholder: "theme-name" as string, example: "ubuntu" as string },
  whoami: { placeholder: "whoami-view" as string, example: "experience" as string },
  lang: { placeholder: "lang-name" as string, example: "fr" as string },
};

describe("Usage component", () => {
  const commands: readonly (keyof typeof arg)[] = ["socials", "themes", "whoami", "lang"] as const;

  const expectedActions: Record<typeof commands[number], string> = {
    socials: "go" as string,
    themes: "set" as string,
    whoami: "" as string,
    lang: "set" as string,
  };

  const expectedExamples: Record<typeof commands[number], string> = {
    socials: "1" as string,
    themes: "ubuntu" as string,
    whoami: "experience" as string,
    lang: "fr" as string,
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
