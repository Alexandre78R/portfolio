import { useContext, useEffect } from "react";
import { Message } from "../Message";
import { termContext } from "../../Terminal";
import {
  getCurrentCmdArry,
  checkRedirect,
  isArgInvalid,
  generateTabs,
} from "../../util";
import Usage from "../Usage";

type Socials = {
  id: number;
  title: string;
  url: string;
  tab: number;
};

const socials: Socials[] = [
  {
    id: 1,
    title: "GitHub",
    url: "https://github.com/Alexandre78R",
    tab: 3,
  },
  {
    id: 2,
    title: "linkedin",
    url: "https://www.linkedin.com/in/alexandrerenard/",
    tab: 3,
  },
];

const Socials: React.FC = (): React.ReactNode => {
  const { arg, history, rerender } = useContext(termContext);
  const currentCommand: any[] = getCurrentCmdArry(history);

  useEffect(() => {
    if (checkRedirect(rerender, currentCommand, "socials")) {
      socials.forEach(({ id, url }) => {
        id === parseInt(arg[1]) && window.open(url, "_blank");
        // id === parseInt(arg[1]) && console.log("ttoto");
      });
    }
  }, [arg, rerender, currentCommand]);

  const checkArg = () =>
    isArgInvalid(arg, "go", ["1", "2"]) ? <Usage cmd="socials" /> : null;

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
