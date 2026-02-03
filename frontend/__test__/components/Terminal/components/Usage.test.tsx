import React from "react";
import { render, screen } from '@test-utils';
import Usage, { Command, arg as usageArg, actions as usageActions } from "../../../../src/components/Terminal/components/Usage";

describe("Usage component", () => {
  const commands: readonly Command[] = ["socials", "themes", "whoami", "lang"];

  commands.forEach((cmd: Command) => {
    test(`renders correct usage for cmd="${cmd}"`, (): void => {
      render(<Usage cmd={cmd} />);

      const action: string = usageActions[cmd];
      const placeholder: string = usageArg[cmd].placeholder;
      const example: string = usageArg[cmd].example;

      expect(
        screen.getByText((content: string) =>
          content.includes(`Usage: ${cmd}`) &&
          content.includes(`<${placeholder}>`)
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText((content: string) =>
          content.includes(`Ex: ${cmd}`) &&
          content.includes(example)
        )
      ).toBeInTheDocument();

      if (action) {
        expect(
          screen.getByText((content: string) =>
            content.includes(`Ex: ${cmd}`) &&
            content.includes(action)
          )
        ).toBeInTheDocument();
      }
    });
  });
});
