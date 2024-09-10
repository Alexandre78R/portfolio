import { Message } from "../../Message";
import Usage from "../../Usage";

type Props = {
  message: string;
};

const WhoamiError: React.FC<Props> = ({ message }): React.ReactElement => {
  return (
    <>
      <Message>{message}</Message>
      <Usage cmd="whoami" />
    </>
  );
};

export default WhoamiError;
