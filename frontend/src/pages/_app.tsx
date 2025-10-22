import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import type { NormalizedCacheObject } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import "../styles/globals.css";
import "../styles/output.css";

import { ThemeProvider } from "@/context/Theme/ThemeContext";
import { LangProvider } from "@/context/Lang/LangContext";
import { SectionRefsProvider } from "@/context/SectionRefs/SectionRefsContext";
import { ChoiceViewProvider } from "@/context/ChoiceView/ChoiceViewContext";
import { UserProvider } from "@/context/UserContext/UserContext";

import Navbar from "@/components/NavBar/NavBar";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import ToastProvider from "@/components/ToastCustom/ToastProvider";

import ReduxProvider from "@/store/provider";
import { API_URL } from "@/config";
import type {
  GraphQLRequest,
  DefaultContext,
} from "@apollo/client/core";

export type ApolloClientState = ApolloClient<NormalizedCacheObject> | null;

const App = ({ Component, pageProps }: AppProps): React.ReactElement => {
  const [client, setClient] = useState<ApolloClientState>(null);

  useEffect((): void => {
    const token: string | undefined = process.env.NEXT_PUBLIC_API_TOKEN;

    if (!API_URL) {
      console.error("API_URL is not defined");
      return;
    }

    if (!token) {
      console.error("NEXT_PUBLIC_API_TOKEN is not defined");
    }

    const httpLink: HttpLink = new HttpLink({
      uri: API_URL,
      credentials: "include",
    });

    const authLink: ApolloLink = setContext(
      (
        _operation: GraphQLRequest,
        previousContext: DefaultContext
      ): DefaultContext => {
        const headers: Record<string, string> = {
          ...(previousContext.headers as Record<string, string> | undefined),
          "x-api-key": token ?? "",
        };

        return { headers };
      }
    );

    const apolloClient: ApolloClient<NormalizedCacheObject> =
      new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
        credentials: "include",
      });

    setClient(apolloClient);
  }, []);

  if (!client) {
    return <LoadingCustom />;
  }

  return (
    <ApolloProvider client={client}>
      <ReduxProvider>
        <UserProvider>
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
        </UserProvider>
      </ReduxProvider>
    </ApolloProvider>
  );
};

export default App;