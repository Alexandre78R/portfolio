import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import store from './store';

type Props = {
  children: ReactNode;
}

const ReduxProvider = ({ children }: Props): React.ReactElement => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;