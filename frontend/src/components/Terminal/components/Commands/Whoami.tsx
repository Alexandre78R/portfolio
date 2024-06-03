import { useContext } from "react";
import _ from "lodash";
import { termContext } from "../../Terminal";
import { Message } from "../TerminalStructure/Message";

const Whoami: React.FC = () => {
  const { arg } = useContext(termContext);

  let message = "";

  if (arg.length === 0) {
    message = "Merci d'indiquer un choix entre : experience|education|skills ";
    return <Message>{message}</Message>;
  }

  if (arg.length !== 1 && arg.length !== 0) {
    message = "Merci de choisir 1 seul argument maximun entre : experience|education|skills";
    return <Message>{message}</Message>;
  }

  switch (arg[0].toLowerCase()) {
    case "experience":
        message = 'experience'
        break;
    case "education":
        message = 'education'
        break;
    case "skills":
        message = 'skills'
        break;
    default:
        message = "ce choix n'existe pas !"
        break;
  }

  return <Message>{message}</Message>;
};

export default Whoami;