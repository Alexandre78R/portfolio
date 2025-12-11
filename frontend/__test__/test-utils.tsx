import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/context/Theme/ThemeContext";
import { useRouter } from "next/router";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { InMemoryCache } from "@apollo/client";
import { useGetThemesListQuery } from "@/types/graphql";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/types/graphql", () => ({
  ...jest.requireActual("@/types/graphql"),
  useGetThemesListQuery: jest.fn(),
}));

const createTestCache = () => {
  return new InMemoryCache({
    typePolicies: {},
  });
};

const AllProviders = ({ children, mocks = [] }: PropsWithChildren & { mocks?: MockedResponse[] }) => {
  (useRouter as jest.Mock).mockReturnValue({
    basePath: "",
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
    push: jest.fn().mockResolvedValue(true),
    replace: jest.fn().mockResolvedValue(true),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
  });

  (useGetThemesListQuery as jest.Mock).mockReturnValue({
    data: {
      getThemesList: {
        themes: [],
        code: 200,
        message: "Success",
      },
    },
    loading: false,
    error: null,
  });

  return (
    <MockedProvider mocks={mocks} cache={createTestCache()}>
      <ThemeProvider>{children}</ThemeProvider>
    </MockedProvider>
  );
};

interface CustomRenderOptions {
  mocks?: MockedResponse[];
  [key: string]: any;
}

const customRender = (ui: React.ReactElement, options: CustomRenderOptions = {}) => {
  const { mocks = [], ...renderOptions } = options;
  return render(ui, {
    wrapper: (props: PropsWithChildren) => (
      <AllProviders mocks={mocks} {...props} />
    ),
    ...renderOptions,
  });
};

export * from "@testing-library/react";
export { customRender as render };