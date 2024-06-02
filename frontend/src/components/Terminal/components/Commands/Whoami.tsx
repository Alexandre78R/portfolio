import { useContext } from "react";
import _ from "lodash";
import { termContext } from "../../Terminal";
import { Message } from "../TerminalStructure/Message";
import Usage from "../TerminalStructure/Usage";

const Whoami: React.FC = () => {
  const { arg } = useContext(termContext);

  let message = "";

  if (arg.length === 0) {
    message = "Merci d'indiquer un choix entre : experience | education | skills";
    return (
      <>
        <Message>{message}</Message>
        <Usage cmd="whoami"/>
      </>
    );
  }

  if (arg.length !== 1 && arg.length !== 0) {
    message = "Merci de choisir 1 seul argument maximun entre : experience | education | skills";
    return <Message>{message}</Message>;
  }


  switch (arg[0].toLowerCase()) {
    case "experience":
      message = 'experience'
      return <Message>{message}</Message>;
    case "education":
      message = 'education'
      return <Message>{message}</Message>;
    case "skills":
      message = 'skills'
      return <Message>{message}</Message>;
    default:
      message = "ce choix n'existe pas !"
      return <Message>{message}</Message>;
  }

};

export default Whoami;