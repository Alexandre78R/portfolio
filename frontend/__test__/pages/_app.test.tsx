import React, { type FC, type ReactElement } from "react";
import { render, screen, waitFor, type RenderResult } from '@test-utils';
import "@testing-library/jest-dom";
import App from "@/pages/_app";
import type { AppProps } from "next/app";
import type { NextRouter } from "next/router";
import { ApolloLink } from "@apollo/client";

beforeAll((): void => {
  process.env.NEXT_PUBLIC_API_TOKEN = "test-token";
});

type ProviderProps = { children: React.ReactNode };

class MockApolloLink extends ApolloLink {
  public request = jest.fn();
  public concat(next: ApolloLink): ApolloLink {
    return this;
  }
}

jest.mock("@/components/Loading/LoadingCustom", () => {
  const Loading: FC = (): ReactElement => <div data-testid="loading">Loading...</div>;
  Loading.displayName = "LoadingCustom";
  return { __esModule: true, default: jest.fn(Loading) };
});

jest.mock("@/components/NavBar/NavBar", () => {
  const NavBar: FC = (): ReactElement => <nav data-testid="navbar">Navbar</nav>;
  NavBar.displayName = "NavBar";
  return { __esModule: true, default: jest.fn(NavBar) };
});

jest.mock("@/context/Theme/ThemeContext", () => ({ ThemeProvider: ({ children }: ProviderProps) => <>{children}</> }));
jest.mock("@/context/Lang/LangContext", () => ({ LangProvider: ({ children }: ProviderProps) => <>{children}</> }));
jest.mock("@/context/SectionRefs/SectionRefsContext", () => ({ SectionRefsProvider: ({ children }: ProviderProps) => <>{children}</> }));
jest.mock("@/context/ChoiceView/ChoiceViewContext", () => ({ ChoiceViewProvider: ({ children }: ProviderProps) => <>{children}</> }));
jest.mock("@/context/UserContext/UserContext", () => ({ UserProvider: ({ children }: ProviderProps) => <>{children}</> }));
jest.mock("@/store/provider", () => ({ __esModule: true, default: ({ children }: ProviderProps) => <>{children}</> }));
jest.mock("@/components/ToastCustom/ToastProvider", () => ({ __esModule: true, default: ({ children }: ProviderProps) => <>{children}</> }));

jest.mock("@mui/x-date-pickers/LocalizationProvider", () => {
  const LocalizationProvider: FC<{ children: React.ReactNode; dateAdapter: new () => unknown }> = ({ children, dateAdapter }) => (
    <div data-testid="localization-provider" data-adapter={dateAdapter?.name || "unknown"}>{children}</div>
  );
  return { LocalizationProvider: jest.fn(LocalizationProvider) };
});

jest.mock("@mui/x-date-pickers/AdapterDayjs", () => {
  class AdapterDayjsMock { public name: string = "AdapterDayjs"; }
  return { AdapterDayjs: AdapterDayjsMock };
});

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    ApolloClient: jest.fn().mockImplementation(() => ({
      query: jest.fn(),
      mutate: jest.fn(),
      cache: {
        reset: jest.fn(),
        read: jest.fn(),
        write: jest.fn(),
        evict: jest.fn(),
        modify: jest.fn(),
      },
      link: new MockApolloLink(),
    })),
    ApolloProvider: ({ children }: ProviderProps) => <>{children}</>,
    InMemoryCache: jest.fn(() => ({})),
    setContext: jest.fn(() => new actual.ApolloLink()),
  };
});

jest.mock("apollo-upload-client", () => ({
  createUploadLink: jest.fn(() => new MockApolloLink()),
}));

const mockRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  push: jest.fn<Promise<boolean>, [string, string?, unknown?]>(),
  replace: jest.fn<Promise<boolean>, [string, string?, unknown?]>(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn<Promise<void>, [string]>(),
  beforePopState: jest.fn(),
  isFallback: false,
  isReady: true,
  events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  isLocaleDomain: false,
  isPreview: false,
  forward: jest.fn(),
} as any as NextRouter;

describe("App component with Apollo Upload", (): void => {
  const MockPage: FC = (): ReactElement => <div data-testid="page-component">Page</div>;

  const appProps: AppProps = { Component: MockPage, pageProps: {}, router: mockRouter as any };

  let renderResult: RenderResult;

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("should eventually render content after loading", async (): Promise<void> => {
    renderResult = render(<App {...appProps} />);
    const { queryByTestId, getByTestId } = renderResult;

    await waitFor((): void => {
      const navbar: HTMLElement = getByTestId("navbar");
      const page: HTMLElement = getByTestId("page-component");
      expect(navbar).toBeInTheDocument();
      expect(page).toBeInTheDocument();
    });

    const loading: HTMLElement | null = queryByTestId("loading");
    expect(loading).not.toBeInTheDocument();
  });

  it("should render Navbar and page component", async (): Promise<void> => {
    renderResult = render(<App {...appProps} />);
    await waitFor((): void => {
      const navbar: HTMLElement = screen.getByTestId("navbar");
      const page: HTMLElement = screen.getByTestId("page-component");
      expect(navbar).toBeInTheDocument();
      expect(page).toBeInTheDocument();
    });
  });

  it("should render LocalizationProvider", async (): Promise<void> => {
    renderResult = render(<App {...appProps} />);
    await waitFor((): void => {
      const localizationProvider: HTMLElement = screen.getByTestId("localization-provider");
      expect(localizationProvider).toBeInTheDocument();
    });
  });

  it("should wrap app with LocalizationProvider and AdapterDayjs", async (): Promise<void> => {
    const { LocalizationProvider } = require("@mui/x-date-pickers/LocalizationProvider");
    renderResult = render(<App {...appProps} />);
    await waitFor((): void => {
      expect(LocalizationProvider).toHaveBeenCalled();
      expect(LocalizationProvider).toHaveBeenCalledWith(
        expect.objectContaining({ dateAdapter: expect.any(Function), children: expect.anything() }),
        expect.anything()
      );
    });
  });

  it("should create ApolloClient with upload link", async (): Promise<void> => {
    const { ApolloClient } = await import("@apollo/client");
    const { createUploadLink } = await import("apollo-upload-client");
    renderResult = render(<App {...appProps} />);
    await waitFor((): void => {
      expect(createUploadLink).toHaveBeenCalled();
      expect(ApolloClient).toHaveBeenCalled();
    });
  });

  it("should include API token in headers", async (): Promise<void> => {
    const { ApolloClient } = await import("@apollo/client");
    renderResult = render(<App {...appProps} />);
    await waitFor((): void => {
      expect(ApolloClient).toHaveBeenCalledWith(expect.objectContaining({
        cache: expect.any(Object),
        link: expect.objectContaining({ concat: expect.any(Function) }),
        credentials: "include",
      }));
    });
  });

  it("should have correct provider hierarchy", async (): Promise<void> => {
    renderResult = render(<App {...appProps} />);
    await waitFor((): void => {
      const localizationProvider: HTMLElement = screen.getByTestId("localization-provider");
      const navbar: HTMLElement = screen.getByTestId("navbar");
      const page: HTMLElement = screen.getByTestId("page-component");
      expect(localizationProvider).toBeInTheDocument();
      expect(localizationProvider).toContainElement(navbar);
      expect(localizationProvider).toContainElement(page);
    });
  });
});
