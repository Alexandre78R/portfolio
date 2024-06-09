import { commands } from "../../Terminal";
import { generateTabs } from "../../util";
import { useLang } from "@/context/Lang/LangContext";
import { Message } from "../Message";

const Help: React.FC = () => {

  const { translations } = useLang();
  return (
    <Message data-testid="help">
      {commands.map(({ cmd, descEN, descFR, tab }) => (
        <div key={cmd}>
          <span className="text-primary">{cmd}</span>
          <span className="tab">{generateTabs(tab)}</span>
            <span className="text-text200 block md:inline-block lg:inline-block">
                - {translations.file === "en" ? descEN : descFR}
            </span>
        </div>
      ))}
      <div className="text-sm mt-4 hidden md:block lg:block">
        <ul>
          <li>
            <p>{translations.terminalHelpTabAction} =&gt; {translations.terminalHelpTabDesc}</p>
          </li>
          <li>
            <p>{translations.terminalHelpArrowUpAction} =&gt; {translations.terminalHelpArrowUpTabDesc}</p>
          </li>
          <li>
            <p>{translations.terminalHelpArrowDownAction} =&gt; {translations.terminalHelpArrowDownTabDesc}</p>
          </li>
          <li>
            <p>{translations.terminalHelpCtrlAction} =&gt; {translations.terminalHelpCtrlTabDesc}</p>
          </li>
        </ul>
      </div>
    </Message>
    );
};
  
  export default Help;