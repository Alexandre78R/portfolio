import { Message } from "../../TerminalStructure/Message";
import Usage from "../../TerminalStructure/Usage";

type Props = {
    message: string;
}

const WhoamiError: React.FC<Props> = ({ message }) => {
    return (
        <>
            <Message>{message}</Message>
            <Usage cmd="whoami"/>
        </>
    );
};

export default WhoamiError;