import React, { ReactNode } from "react";
import { Message } from "./Message";

type CmdNotFoundProps = {
  cmdH: string;
};

export const CmdNotFound: React.FC<CmdNotFoundProps> = ({
  cmdH,
}): React.ReactElement => {
  return <Message>Command not found: {cmdH}</Message>;
};
