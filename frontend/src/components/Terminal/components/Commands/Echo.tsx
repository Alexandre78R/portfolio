import { useContext } from "react";
import _ from "lodash";
import { termContext } from "../../Terminal";
import { Message } from "../Message";

const Echo: React.FC = () => {
  const { arg } = useContext(termContext);

  let outputStr = _.join(arg, " ");
  outputStr = _.trim(outputStr, "'"); // remove trailing single quotes ''
  outputStr = _.trim(outputStr, '"'); // remove trailing double quotes ""
  outputStr = _.trim(outputStr, "`"); // remove trailing backtick ``

  return <Message>{outputStr}</Message>;
};

export default Echo;
