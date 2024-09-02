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
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";
import { API_URL } from "@/config";
import { setContext } from "@apollo/client/link/context"; // Correct import

const App = ({ Component, pageProps }: AppProps): React.ReactElement => {

  console.log(API_URL)

  const token = process.env.NEXT_PUBLIC_API_TOKEN;

  const httpLink = new HttpLink({
    uri: `${API_URL}`,
  });
  
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "x-api-key": token ? `${token}` : "",
      }
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
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

