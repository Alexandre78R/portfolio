import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "@/pages/_app";
import type { AppProps } from "next/app";
import type { Router } from "next/router";

beforeAll((): void => {
  process.env.NEXT_PUBLIC_API_TOKEN = "test-token";
});

jest.mock("@/components/Loading/LoadingCustom", () => {
  const Loading = (): React.ReactElement => (
    <div data-testid="loading">Loading...</div>
  );
  Loading.displayName = "LoadingCustom";
  return { __esModule: true, default: jest.fn(Loading) };
});

jest.mock("@/components/NavBar/NavBar", () => {
  const NavBar = (): React.ReactElement => <nav data-testid="navbar">Navbar</nav>;
  NavBar.displayName = "NavBar";
  return { __esModule: true, default: jest.fn(NavBar) };
});

type ProviderProps = { children: React.ReactNode };

jest.mock("@/context/Theme/ThemeContext", () => ({
  ThemeProvider: ({ children }: ProviderProps) => <>{children}</>,
}));

jest.mock("@/context/Lang/LangContext", () => ({
  LangProvider: ({ children }: ProviderProps) => <>{children}</>,
}));

jest.mock("@/context/SectionRefs/SectionRefsContext", () => ({
  SectionRefsProvider: ({ children }: ProviderProps) => <>{children}</>,
}));

jest.mock("@/context/ChoiceView/ChoiceViewContext", () => ({
  ChoiceViewProvider: ({ children }: ProviderProps) => <>{children}</>,
}));

jest.mock("@/context/UserContext/UserContext", () => ({
  UserProvider: ({ children }: ProviderProps) => <>{children}</>,
}));

jest.mock("@/store/provider", () => {
  const ReduxProvider = ({ children }: ProviderProps) => <>{children}</>;
  ReduxProvider.displayName = "StoreProvider";
  return { __esModule: true, default: ReduxProvider };
});

jest.mock("@/components/ToastCustom/ToastProvider", () => {
  const ToastProvider = ({ children }: ProviderProps) => <>{children}</>;
  ToastProvider.displayName = "ToastProvider";
  return { __esModule: true, default: ToastProvider };
});

import { ApolloClient, ApolloProvider, InMemoryCache, ApolloLink } from "@apollo/client";

type ApolloClientInstance = {
  query: jest.Mock;
  mutate: jest.Mock;
  cache: { reset: jest.Mock };
};

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    ApolloClient: jest.fn<ApolloClientInstance, any[]>(() => ({
      query: jest.fn(),
      mutate: jest.fn(),
      cache: { reset: jest.fn() },
    })),
    ApolloProvider: ({ children }: ProviderProps) => <>{children}</>,
    InMemoryCache: jest.fn(() => ({})),
    ApolloLink: jest.fn(),
    setContext: jest.fn(() => new actual.ApolloLink()),
  };
});

class MockApolloLink {
  request = jest.fn();
  concat = jest.fn(() => this);
}

jest.mock("apollo-upload-client", () => ({
  createUploadLink: jest.fn(() => new MockApolloLink()),
}));


const mockRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  isFallback: false,
  isReady: true,
  events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  isLocaleDomain: false,
  isPreview: false,
  forward: jest.fn(),
} as unknown as Router;

describe("App component with Apollo Upload", () => {
  const MockPage = (): React.ReactElement => <div data-testid="page-component">Page</div>;

  const appProps: AppProps = {
    Component: MockPage,
    pageProps: {},
    router: mockRouter,
  };

  it("should eventually render content after loading", async () => {
    const { queryByTestId, getByTestId } = render(<App {...appProps} />);

    await waitFor(() => {
      expect(getByTestId("navbar")).toBeInTheDocument();
      expect(getByTestId("page-component")).toBeInTheDocument();
    });

    expect(queryByTestId("loading")).not.toBeInTheDocument();
  });

  it("should render Navbar and page component", async () => {
    render(<App {...appProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("page-component")).toBeInTheDocument();
    });
  });

  it("should create ApolloClient with upload link", async () => {
    const { ApolloClient } = await import("@apollo/client");
    const { createUploadLink } = await import("apollo-upload-client");

    render(<App {...appProps} />);

    await waitFor(() => {
      expect(createUploadLink).toHaveBeenCalled();
      expect(ApolloClient).toHaveBeenCalled();
    });
  });

  it("should include API token in headers", async () => {
    const { ApolloClient } = await import("@apollo/client");

    render(<App {...appProps} />);
    await waitFor(() => {
      expect(ApolloClient).toHaveBeenCalledWith(
        expect.objectContaining({
          cache: expect.any(Object),
          link: expect.objectContaining({
            concat: expect.any(Function),
          }),
          credentials: "include",
        })
      );
    });
  });
});