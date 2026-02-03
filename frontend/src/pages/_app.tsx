import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import type { NormalizedCacheObject } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
// const { createUploadLink } = require("apollo-upload-client");
// import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
// import { createUploadLink } from "apollo-upload-client";

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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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

    // const httpLink: HttpLink = new HttpLink({
    //   uri: API_URL,
    //   credentials: "include",
    // });

    // const uploadLink: ApolloLink = createUploadLink({
    //   uri: API_URL,
    //   credentials: "include",
    //   headers: () => ({
    //     "Apollo-Require-Preflight": "true",
    //   }),
    //   fetch: (uri: RequestInfo | URL, options?: RequestInit) => {
    //     return fetch(uri, options).then(async (response) => {
    //       if (!response.ok) {
    //         // const text = await response.text();
    //       }
    //       return response;
    //     });
    //   },
    // }) as unknown as ApolloLink;

    const uploadLink: ApolloLink = createUploadLink({
      uri: API_URL,
      credentials: "include",
      headers: {
        "Apollo-Require-Preflight": "true",
      },
      fetch: (uri: RequestInfo | URL, options?: RequestInit) => {
        return fetch(uri, options).then(async (response) => {
          if (!response.ok) {
            // const text = await response.text();
          }
          return response;
        });
      },
    }) as unknown as ApolloLink;
    // const uploadLink = UploadHttpLink({
    //   uri: API_URL,
    //   credentials: "include",
    // });

    const authLink: ApolloLink = setContext(
      (
        _operation: GraphQLRequest,
        previousContext: DefaultContext
      ): DefaultContext => {
        // Récupérer le token JWT depuis localStorage à chaque requête
        const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        const headers: Record<string, string> = {
          ...(previousContext.headers as Record<string, string> | undefined),
          "x-api-key": token ?? "",
        };

        // Ajouter le token JWT dans les headers si présent
        if (jwtToken) {
          headers['authorization'] = `Bearer ${jwtToken}`;
        }

        return { headers };
      }
    );

    const apolloClient: ApolloClient<NormalizedCacheObject> =
      new ApolloClient({
        // link: authLink.concat(httpLink),
        link: authLink.concat(uploadLink as ApolloLink),
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
      </LocalizationProvider>
    </ApolloProvider>
  );
};

export default App;