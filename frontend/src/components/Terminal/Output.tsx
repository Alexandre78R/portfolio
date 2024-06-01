import { useContext, useState, useMemo } from "react";
import { termContext } from "./Terminal";
import Welcome from "./components/Commands/Welcome";
import { Message } from "./components/TerminalStructure/Message";
import Clear from "./components/Commands/Clear";
import Help from "./components/Commands/Help";
import Socials from "./components/Commands/Socials";
import Echo from "./components/Commands/Echo";
import Whoami from "./components/Commands/Whoami";
import Themes from "./components/Commands/Themes";

type Props = {
    index: number;
    cmd: string;
};
  
// const Output: React.FC<Props> = ({ index, cmd }) => {
//   const { arg } = useContext(termContext);
//   const specialCmds = ["projects", "socials", "echo", "themes"];
//   if (!specialCmds.includes(cmd) && arg.length > 0)
//     return <Message data-testid="usage-output">Usage: {cmd}</Message>;

//   return (
//     <div className="pb-[0.25rem]" data-testid={index === 0 ? "latest-output" : null}>
//       {
//         {
//           help: <Help />,
//           welcome: <Welcome />,
//           clear: <Clear />,
//           socials: <Socials />,
//           echo: <Echo />,
//           whoami : <Whoami />,
//           themes : <Themes />,
//         }[cmd]
//       }
//     </div>
//   );
// };
  
//   export default Output;

const Output: React.FC<Props> = ({ index, cmd }) => {
  const { arg } = useContext(termContext);
  const specialCmds = ["projects", "socials", "echo", "themes"];

  const commandOutput = useMemo(() => {
    if (!specialCmds.includes(cmd) && arg.length > 0) {
      return <Message data-testid="usage-output">Usage: {cmd}</Message>;
    }

    return {
      help: <Help />,
      welcome: <Welcome />,
      clear: <Clear />,
      socials: <Socials />,
      echo: <Echo />,
      whoami: <Whoami />,
      themes: <Themes />,
    }[cmd] || null;
  }, [cmd, arg]);

  return (
    <div className="pb-[0.25rem]" data-testid={index === 0 ? "latest-output" : null}>
      {commandOutput}
    </div>
  );
};

export default Output;