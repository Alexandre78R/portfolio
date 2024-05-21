import { useContext, useEffect } from "react";
import { Message } from "../TerminalStructure/Message";
import { termContext } from "../../Terminal";

const Clear: React.FC = () => {
  const { arg, clearHistory } = useContext(termContext);
  useEffect(() => {
    if (arg.length < 1) clearHistory?.();
  }, []);
  return arg.length > 0 ? <Message>Usage: clear</Message> : <></>;
};

export default Clear;
