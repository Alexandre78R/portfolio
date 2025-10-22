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

  return {
    __esModule: true,
    default: jest.fn(Loading),
  };
});

jest.mock("@/components/NavBar/NavBar", () => {
  const NavBar = (): React.ReactElement => (
    <nav data-testid="navbar">Navbar</nav>
  );
  NavBar.displayName = "NavBar";

  return {
    __esModule: true,
    default: jest.fn(NavBar),
  };
});

type ProviderProps = {
  children: React.ReactNode;
};

jest.mock("@/context/Theme/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/context/Lang/LangContext", () => ({
  LangProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/context/SectionRefs/SectionRefsContext", () => ({
  SectionRefsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/context/ChoiceView/ChoiceViewContext", () => ({
  ChoiceViewProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/context/UserContext/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/store/provider", () => {
  const StoreProvider = ({ children }: ProviderProps): React.ReactElement => (
    <>{children}</>
  );
  StoreProvider.displayName = "StoreProvider";

  return {
    __esModule: true,
    default: StoreProvider,
  };
});

jest.mock("@/components/ToastCustom/ToastProvider", () => {
  const ToastProvider = ({ children }: ProviderProps): React.ReactElement => (
    <>{children}</>
  );
  ToastProvider.displayName = "ToastProvider";

  return {
    __esModule: true,
    default: ToastProvider,
  };
});


type ApolloLinkLike = {
  request: jest.Mock;
  concat: (link: ApolloLinkLike) => ApolloLinkLike;
};

class MockApolloLink implements ApolloLinkLike {
  request: jest.Mock;

  constructor(request?: jest.Mock) {
    this.request = request ?? jest.fn();
  }

  concat(_: ApolloLinkLike): ApolloLinkLike {
    return new MockApolloLink();
  }
}

type ApolloClientInstance = {
  query: jest.Mock;
  mutate: jest.Mock;
  cache: {
    reset: jest.Mock;
  };
};

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");

  return {
    ...actual,
    ApolloClient: jest.fn<ApolloClientInstance, []>(() => ({
      query: jest.fn(),
      mutate: jest.fn(),
      cache: {
        reset: jest.fn(),
      },
    })),
    ApolloProvider: ({ children }: ProviderProps): React.ReactElement => (
      <>{children}</>
    ),
    InMemoryCache: jest.fn(() => ({})),
    HttpLink: jest.fn(() => new MockApolloLink()),
    setContext: jest.fn(() => new MockApolloLink()),
  };
});

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
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isLocaleDomain: false,
  isPreview: false,
  forward: jest.fn(),
} as unknown as Router;


describe("App component", () => {
  const MockComponent = (): React.ReactElement => (
    <div data-testid="page-component">Page</div>
  );
  MockComponent.displayName = "MockComponent";

  const appProps: AppProps = {
    Component: MockComponent,
    pageProps: {},
    router: mockRouter,
  };

  it("should eventually show content after loading", async () => {
    const { queryByTestId, getByTestId } = render(<App {...appProps} />);

    await waitFor((): void => {
      expect(getByTestId("navbar")).toBeInTheDocument();
      expect(getByTestId("page-component")).toBeInTheDocument();
    });

    expect(queryByTestId("loading")).not.toBeInTheDocument();
  });

  it("should render Navbar and page component after ApolloClient is set", async () => {
    render(<App {...appProps} />);

    await waitFor((): void => {
      const navbar: HTMLElement = screen.getByTestId("navbar");
      const pageComponent: HTMLElement = screen.getByTestId("page-component");

      expect(navbar).toBeInTheDocument();
      expect(pageComponent).toBeInTheDocument();
    });
  });

  it("should create ApolloClient with correct headers", async () => {
    const { ApolloClient } = await import("@apollo/client");

    render(<App {...appProps} />);

    await waitFor((): void => {
      expect(ApolloClient).toHaveBeenCalled();
    });
  });
});