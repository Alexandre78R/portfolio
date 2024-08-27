import "../styles/globals.css";
import "../styles/output.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../context/Theme/ThemeContext";
import { LangProvider } from "@/context/Lang/LangContext";
import Navbar from "@/components/NavBar/NavBar";
import { SectionRefsProvider } from "@/context/SectionRefs/SectionRefsContext";
import { ChoiceViewProvider } from "@/context/ChoiceView/ChoiceViewContext";
import ReduxProvider from '../store/provider';
import ToastProvider from "@/components/ToastCustom/ToastProvider";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { API_URL } from "@/config";

const App = ({ Component, pageProps }: AppProps): React.ReactElement => {

  const client = new ApolloClient({
    uri: `${API_URL}`,
    cache: new InMemoryCache(),
    credentials: "include",
  });

  return (
    <ApolloProvider client={client}>
      <ReduxProvider>
        <SectionRefsProvider>
          <ThemeProvider>
            <LangProvider>
              <ChoiceViewProvider>
                <Navbar />
                <ToastProvider />
                <Component {...pageProps} />
              </ChoiceViewProvider>
            </LangProvider>
          </ThemeProvider>
        </SectionRefsProvider>
      </ReduxProvider>
    </ApolloProvider>
  );
}
export default App;

