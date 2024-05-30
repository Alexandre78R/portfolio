import { useContext, useState } from "react";
import { termContext } from "./Terminal";
import Welcome from "./components/Commands/Welcome";
import { Message } from "./components/TerminalStructure/Message";
import Clear from "./components/Commands/Clear";
import Help from "./components/Commands/Help";
import Socials from "./components/Commands/Socials";
import Echo from "./components/Commands/Echo";

type Props = {
    index: number;
    cmd: string;
  };
  
const Output: React.FC<Props> = ({ index, cmd }) => {
  const { arg } = useContext(termContext);
  const specialCmds = ["projects", "socials", "echo"];
  if (!specialCmds.includes(cmd) && arg.length > 0)
    return <Message data-testid="usage-output">Usage: {cmd}</Message>;

  return (
    <div className="pb-[0.25rem]" data-testid={index === 0 ? "latest-output" : null}>
      {
        {
          help: <Help />,
          welcome: <Welcome />,
          clear: <Clear />,
          socials: <Socials />,
          echo: <Echo />
        }[cmd]
      }
    </div>
  );
};
  
  export default Output;