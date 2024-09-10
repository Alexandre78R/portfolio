import { useLang } from "@/context/Lang/LangContext";
import { useContext, useEffect, useState } from "react";
import { termContext } from "../../Terminal";
import { Message } from "../Message";

const Welcome: React.FC = (): React.ReactElement => {
  const { arg } = useContext(termContext);
  const { translations } = useLang();

  return (
    <div className="flex flex-wrap-reverse">
      <div className="w-full md:w-1/2">
        <pre className="mt-2 mb-6 block md:block lg:hidden xl:hidden">
          {`
  (     
    (      )\\ )  
    )\\    (()/(  
  ((((_)(   /(_)) 
  )\\ _ )\\ (_))   
  (_)_\\(_)| _ \\  
   / _ \\ _|   /  
  /_/ \\_(_|_|_\\  
                  `}
        </pre>
        <pre className="mt-2 mb-6 hidden md:hidden lg:block xl:block">
          {`        
(                                  
  (      (                          (                 )\\ )                         (     
  )\\     )\\   (     )    )          )\\ )  (      (   (()/(   (            )  (     )\\ )  
((((_)(  ((_) ))\\ ( /( ( /(   (     (()/(  )(    ))\\   /(_)) ))\\  (     ( /(  )(   (()/(  
)\\ _ )\\  _  /((_))\\()))(_))  )\\ )   ((_))(()\\  /((_) (_))  /((_) )\\ )  )(_))(()\\   ((_)) 
(_)_\\(_)| |(_)) ((_)\\((_)_  _(_/(   _| |  ((_)(_))   | _ \\(_))  _(_/( ((_)_  ((_)  _| |  
 / _ \\  | |/ -_)\\ \\ // _' || ' \\))/ _' | | '_|/ -_)  |   // -_)| ' _\\))/ _' || '_|/ _' |  
/_/ _\\_\\ |_|\\___|/_\\_\\__,_||_||_| \\__,_| |_|  \\___|  |_|_\\___||_||_| \\__,_||_|  \\__,_|   
          `}
        </pre>
        <Message>{translations.terminalWelcomeMessage}</Message>
        <div className="mt-4 mb-4">
          {translations.terminalWelcomeMessageHelp} `
          <span className="text-primary">help</span>`.
        </div>
      </div>
    </div>
  );
};

export default Welcome;
