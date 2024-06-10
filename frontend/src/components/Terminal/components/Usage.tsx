import { useEffect } from "react";
import { Message } from "./Message";

type Props = {
  cmd: "socials" | "themes" | "whoami" | "lang";
};

const arg = {
  socials: { placeholder: "social", example: "1" },
  themes: { placeholder: "theme-name", example: "ubuntu" },
  whoami: { placeholder: "whoami-view", example: "experience" },
  lang: { placeholder: "lang-name", example: "fr" },
};

const Usage: React.FC<Props> = ({ cmd }): React.ReactElement => {

  let action = ""

  if (cmd === "socials") {
    action = "go";
  }
  
  if (cmd === "themes" || cmd === "lang") {
    action = "set";
  }

  if (cmd === "whoami") {
    action = "";
  }
  
  return (
    <Message data-testid={`${cmd}-invalid-arg`}>
      Usage: {cmd} {action} &#60;{arg[cmd]?.placeholder}&#62; <br />
      Ex: {cmd} {action} {arg[cmd].example}
    </Message>
  );

};

export default Usage;
