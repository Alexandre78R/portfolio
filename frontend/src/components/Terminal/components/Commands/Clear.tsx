import { useContext, useEffect } from "react";
import { Message } from "../Message";
import { termContext } from "../../Terminal";

const Clear: React.FC = (): React.ReactElement => {
  const { arg, clearHistory } = useContext(termContext);
  useEffect(() => {
    if (arg.length < 1) clearHistory?.();
  }, []);
  return arg.length > 0 ? <Message>Usage: clear</Message> : <></>;
};

export default Clear;
