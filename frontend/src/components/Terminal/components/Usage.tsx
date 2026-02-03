import React from "react";
import { Message } from "./Message";

// === Types ===
export type Command = "socials" | "themes" | "whoami" | "lang";

export type ArgConfig = {
  placeholder: string;
  example: string;
};

export type Props = {
  cmd: Command;
};

// === Config ===
export const arg: Record<Command, ArgConfig> = {
  socials: { placeholder: "social", example: "1" },
  themes: { placeholder: "theme-name", example: "ubuntu" },
  whoami: { placeholder: "whoami-view", example: "experience" },
  lang: { placeholder: "lang-name", example: "fr" },
};

export const actions: Record<Command, string> = {
  socials: "go",
  themes: "set",
  whoami: "",
  lang: "set",
};

const Usage: React.FC<Props> = ({ cmd }): React.ReactElement => {
  const action = actions[cmd];

  return (
    <Message data-testid={`${cmd}-invalid-arg`}>
      Usage: {cmd} {action} &#60;{arg[cmd].placeholder}&#62; <br />
      Ex: {cmd} {action} {arg[cmd].example}
    </Message>
  );
};

export default Usage;