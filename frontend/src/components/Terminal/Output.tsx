import React, { useContext, useState, useMemo } from "react";
import { termContext } from "./Terminal";
import Welcome from "./components/Commands/Welcome";
import { Message } from "./components/Message";
import Clear from "./components/Commands/Clear";
import Help from "./components/Commands/Help";
import Socials from "./components/Commands/Socials";
import Echo from "./components/Commands/Echo";
import Whoami from "./components/Commands/Whoami";
import Themes from "./components/Commands/Themes";
import About from "./components/Commands/About";
import Lang from "./components/Commands/Lang";
import CV from "./components/Commands/CV";
import Projects from "./components/Commands/ProjectsCommand";

type Props = {
    index: number;
    cmd: string;
};

const Output: React.FC<Props> = ({ index, cmd }): React.ReactElement => {
  const { arg } = useContext(termContext);
  const specialCmds: string[] = ["projects", "socials", "echo", "themes", "whoami", "lang"];

  const commandOutput = useMemo(() => {
    if (!specialCmds.includes(cmd) && arg.length > 0) {
      return <Message data-testid="usage-output">Usage: {cmd}</Message>;
    }
    // if (!commandEnter) return null;

    return {
      help: <Help />,
      about : <About />,
      welcome: <Welcome />,
      clear: <Clear />,
      socials: <Socials />,
      echo: <Echo />,
      whoami: <Whoami />,
      themes: <Themes />,
      lang: <Lang />,
      cv : <CV/>,
      projects : <Projects />,
    }[cmd] || null;
  }, [cmd, arg]);

  return (
    <div className="pb-[0.25rem]" data-testid={index === 0 ? "latest-output" : null}>
      {commandOutput}
    </div>
  );
};

export default React.memo(Output);