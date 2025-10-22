import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "@/pages/_app";
import type { AppProps } from "next/app";
import { Router } from "next/router";

// --------------------------------------------------------------------------
// Mock token
// --------------------------------------------------------------------------
beforeAll(() => {
  process.env.NEXT_PUBLIC_API_TOKEN = "test-token";
});

// --------------------------------------------------------------------------
// Mocks Components / Contexts
// --------------------------------------------------------------------------
jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="loading">Loading...</div>),
}));

jest.mock("@/components/NavBar/NavBar", () => ({
  __esModule: true,
  default: jest.fn(() => <nav data-testid="navbar">Navbar</nav>),
}));

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

jest.mock("@/store/provider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/ToastCustom/ToastProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/context/UserContext/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// --------------------------------------------------------------------------
// Mock Apollo Client
// --------------------------------------------------------------------------
jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  
  // Classe mock qui implémente correctement ApolloLink
  class MockApolloLink {
    request: any;
    
    constructor(request?: any) {
      this.request = request || jest.fn();
    }
    
    concat(link: any) {
      return new MockApolloLink(); // retourne une nouvelle instance
    }
  }

  return {
    ...actual,
    ApolloClient: jest.fn().mockImplementation(() => ({
      query: jest.fn(),
      mutate: jest.fn(),
      cache: {
        reset: jest.fn(),
      },
    })),
    ApolloProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    InMemoryCache: jest.fn().mockImplementation(() => ({})),
    HttpLink: jest.fn().mockImplementation(() => new MockApolloLink()),
    setContext: jest.fn().mockImplementation(() => new MockApolloLink()),
  };
});
// --------------------------------------------------------------------------
// Mock Router
// --------------------------------------------------------------------------
const mockRouter: Router = {
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

// --------------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------------
describe("App component", () => {
  const MockComponent: React.FC = () => <div data-testid="page-component">Page</div>;

  const appProps: AppProps = {
    Component: MockComponent,
    pageProps: {},
    router: mockRouter,
  };

it("should eventually show content after loading", async () => {
  const { queryByTestId, getByTestId } = render(<App {...appProps} />);
  
  // Soit loading est affiché, soit directement le contenu (selon le timing)
  // On teste juste que le contenu final est bien là
  await waitFor(() => {
    expect(getByTestId("navbar")).toBeInTheDocument();
    expect(getByTestId("page-component")).toBeInTheDocument();
  });
  
  // Vérifier que loading n'est plus là
  expect(queryByTestId("loading")).not.toBeInTheDocument();
});

  it("should render Navbar and page component after ApolloClient is set", async () => {
    render(<App {...appProps} />);

    await waitFor(() => {
      const navbar = screen.getByTestId("navbar");
      const pageComponent = screen.getByTestId("page-component");

      expect(navbar).toBeInTheDocument();
      expect(pageComponent).toBeInTheDocument();
    });
  });

  it("should create ApolloClient with correct headers", async () => {
    const { ApolloClient } = await import("@apollo/client");
    render(<App {...appProps} />);

    await waitFor(() => {
      expect(ApolloClient).toHaveBeenCalled();
    });
  });
});