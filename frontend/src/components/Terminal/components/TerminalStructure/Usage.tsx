import { Message } from "./Message";

type Props = {
  cmd: "socials" | "themes" ;
};

const arg = {
  socials: { placeholder: "social-no", example: "1" },
  themes: { placeholder: "theme-name", example: "ubuntu" },
};

const Usage: React.FC<Props> = ({ cmd }) => {

  const action = "go";

  return (
    <Message data-testid={`${cmd}-invalid-arg`}>
      Usage: {cmd} {action} &#60;{arg[cmd]?.placeholder}&#62; <br />
      Ex: {cmd} {action} {arg[cmd].example}
    </Message>
  );

};

export default Usage;
