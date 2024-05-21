import { useContext } from "react";
import { termContext } from "./Terminal";
import Welcome from "./components/Commands/Welcome";
import { Message } from "./components/TerminalStructure/Message";
import Clear from "./components/Commands/Clear";
import Help from "./components/Commands/Help";

type Props = {
    index: number;
    cmd: string;
  };
  
const Output: React.FC<Props> = ({ index, cmd }) => {
  const { arg } = useContext(termContext);
  const specialCmds = ["projects", "socials"];
  
  if (!specialCmds.includes(cmd) && arg.length > 0)
    return <Message data-testid="usage-output">Usage: {cmd}</Message>;

  return (
    <div className="pb-[0.25rem]" data-testid={index === 0 ? "latest-output" : null}>
      {
        {
          help: <Help />,
          welcome: <Welcome />,
          clear: <Clear />
        }[cmd]
      }
    </div>
  );
};
  
  export default Output;