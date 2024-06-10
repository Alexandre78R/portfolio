import { useContext, useEffect } from "react";
import { termContext } from "../../Terminal";
import { checkRedirect, getCurrentCmdArry } from "../../util";

const CV: React.FC = (): React.ReactNode => {

  const { history, rerender } = useContext(termContext);
  const currentCommand: any[] = getCurrentCmdArry(history);

  useEffect(() => {
    if (rerender && currentCommand[0] === 'cv') {
      window.open("/Alexandre-Renard-CV.pdf", "_blank");
    }
  }, []);

  return (
    <></>
  )
};

export default CV;
