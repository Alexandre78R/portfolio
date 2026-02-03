import { useContext, useEffect } from "react";
import { Message } from "../Message";
import { termContext, Term } from "../../Terminal";


const Clear = (): JSX.Element => {

  const { arg, clearHistory }: Term = useContext<Term>(termContext);
  
  useEffect(() => {
    if (arg.length < 1) clearHistory?.();
  }, [arg, clearHistory]);

  return arg.length > 0 ? <Message>Usage: clear</Message> : <></>;

};

export default Clear;
