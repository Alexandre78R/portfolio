import { useContext } from "react";
import _ from "lodash";
import { termContext, Term } from "../../Terminal";
import { Message } from "../Message";

const Echo = (): JSX.Element => {
  const { arg }: Term = useContext<Term>(termContext);

  let outputStr: string = _.join(arg, " ");
  outputStr = _.trim(outputStr, "'"); // remove trailing single quotes ''
  outputStr = _.trim(outputStr, '"'); // remove trailing double quotes ""
  outputStr = _.trim(outputStr, "`"); // remove trailing backtick ``

  return <Message>{outputStr}</Message>;
};

export default Echo;
