import { useContext, useEffect } from "react";
import { termContext, Term } from "../../Terminal";
import { getCurrentCmdArry } from "../../util";

const CV = (): JSX.Element => {
  const { history, rerender } = useContext<Term>(termContext);
  const currentCommand: any[] = getCurrentCmdArry(history);

  useEffect(() => {
    if (rerender && currentCommand[0] === "cv") {
      window.open("/Alexandre-Renard-CV.pdf", "_blank");
    }
  }, []);

  return <></>;
};

export default CV;
