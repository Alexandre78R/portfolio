import { Provider } from "react-redux";
import { PropsWithChildren } from "react";
import { store } from "./store";

const ReduxProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
