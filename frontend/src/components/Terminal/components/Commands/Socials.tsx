import { useContext, useEffect } from "react";
import { Message } from "../Message";
import { termContext, Term } from "../../Terminal";
import {
  getCurrentCmdArry,
  checkRedirect,
  isArgInvalid,
  generateTabs,
} from "../../util";
import Usage from "../Usage";
import { useAppSelector } from "../../../../store/hook";

export type Socials = {
  id: number;
  title: string;
  url: string;
  tab: number;
};

const Socials = (): React.ReactNode => {
  const socials = useAppSelector((state) => state.socials.dataSocials);
  const { arg, history, rerender } = useContext<Term>(termContext);
  const currentCommand: any[] = getCurrentCmdArry(history);

  useEffect(() => {
    if (checkRedirect(rerender, currentCommand, "socials")) {
      socials.forEach(({ id, url }) => {
        id === parseInt(arg[1]) && window.open(url, "_blank");
      });
    }
  }, [arg, rerender, currentCommand]);

  const checkArg = (): React.ReactElement | null => {
    const validIds = socials.map((social) => social.id.toString());
    return isArgInvalid(arg, "go", validIds) ? <Usage cmd="socials" /> : null;
  };

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <Message data-testid="socials">
      {socials.map(({ id, title, url, tab }) => (
        <div key={title}>
          <span className="text-primary">{`${id}. ${title}`}</span>
          <span className="tab">{generateTabs(tab)}</span>
          <span className="text-text200 block md:inline-block lg:inline-block">
            {url}
          </span>
        </div>
      ))}
      <Usage cmd="socials" />
    </Message>
  );
};

export default Socials;
