import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  renderHook,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { ThemeProvider, useTheme, ThemeContextType, ThemeProviderProps, ThemeKey } from "@/context/Theme/ThemeContext";
import defaultThemes from "@/context/Theme/themes";
import { ApolloError, gql } from "@apollo/client";
import { LocalStorageMock } from "./context.types";
import Error from "next/error";

const GET_THEMES_LIST = gql`
  query GetThemesList {
    themeList {
      themes {
        body
        admin
        error
        footer
        grey
        id
        info
        name
        nameEN
        nameFR
        placeholder
        primary
        scrollHandle
        scrollHandleHover
        secondary
        success
        text100
        text200
        text300
        textButton
        textDefault
        visible
        warn
      }
      message
      code
    }
  }
`;

interface TestComponentProps {}

const TestComponent: React.FC<TestComponentProps> = (): React.ReactElement => {
  const { theme, toggleTheme, themes, loading, error }: ThemeContextType = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="loading">{loading ? "loading" : "loaded"}</span>
      <span data-testid="error">{error ? "error" : "no-error"}</span>
      <span data-testid="themes-count">{Object.keys(themes).length}</span>

      <button
        type="button"
        data-testid="set-light"
        onClick={(): void => toggleTheme("light" as ThemeKey)}
      >
        Light
      </button>

      <button
        type="button"
        data-testid="set-dark"
        onClick={(): void => toggleTheme("dark" as ThemeKey)}
      >
        Dark
      </button>

      <button
        type="button"
        data-testid="set-ubuntu"
        onClick={(): void => toggleTheme("ubuntu" as ThemeKey)}
      >
        Ubuntu
      </button>
    </div>
  );
};

const localStorageStore: Record<string, string> = {};

const mockDarkThemeData = {
  __typename: "Theme",
  id: "1",
  name: "dark",
  nameEN: "Dark",
  nameFR: "Sombre",
  visible: true,
  body: "#01031B",
  scrollHandle: "#19252E",
  scrollHandleHover: "#162028",
  primary: "#B45852",
  secondary: "#DFBB5F",
  success: "#1C8036",
  error: "#AA2020",
  warn: "#EBCC2A",
  info: "#3B89FF",
  grey: "#7F7F7F",
  placeholder: "#A0AEC0",
  footer: "#050F1A",
  admin: "#080b2a",
  textDefault: "#F8F8FD",
  text100: "#cbd5e1",
  text200: "#B2BDCC",
  text300: "#64748b",
  textButton: "white",
};

const mockLightThemeData = {
  __typename: "Theme",
  id: "2",
  name: "light",
  nameEN: "Light",
  nameFR: "Claire",
  visible: true,
  body: "#E8E8E8",
  scrollHandle: "#C1C1C1",
  scrollHandleHover: "#AAAAAA",
  primary: "#008787",
  secondary: "#FF9D00",
  success: "#1C8036",
  error: "#AA2020",
  warn: "#EBCC2A",
  info: "#3B89FF",
  grey: "#7F7F7F",
  placeholder: "#A0AEC0",
  footer: "#34393E",
  admin: "#34393E",
  textDefault: "#7BA5A4",
  text100: "#334155",
  text200: "#475569",
  text300: "#64748b",
  textButton: "white",
};

const mockUbuntuThemeData = {
  __typename: "Theme",
  id: "3",
  name: "ubuntu",
  nameEN: "Ubuntu",
  nameFR: "Ubuntu",
  visible: true,
  body: "#2D0922",
  scrollHandle: "#F47845",
  scrollHandleHover: "#E65F31",
  primary: "#80D932",
  secondary: "#dd4813",
  success: "#1C8036",
  error: "#AA2020",
  warn: "#EBCC2A",
  info: "#3B89FF",
  grey: "#7F7F7F",
  placeholder: "#A0AEC0",
  footer: "#180512",
  admin: "#180512",
  textDefault: "#F8F8FD",
  text100: "#FFFFFF",
  text200: "#E1E9CC",
  text300: "#CDCDCD",
  textButton: "white",
};

const mockDarkThemeDataHidden = {
  __typename: "Theme",
  ...mockDarkThemeData,
  visible: false,
};

const mockSuccessResponse: MockedResponse = {
  request: {
    query: GET_THEMES_LIST,
  },
  result: {
    data: {
      themeList: {
        __typename: "ThemeListResponse",
        themes: [mockDarkThemeData, mockLightThemeData, mockUbuntuThemeData],
        message: "Themes retrieved successfully",
        code: 200,
      },
    },
  },
};

const mockErrorResponse: MockedResponse = {
  request: {
    query: GET_THEMES_LIST,
  },
  error: new ApolloError({ errorMessage: "Network error" }),
};

const mockEmptyResponse: MockedResponse = {
  request: {
    query: GET_THEMES_LIST,
  },
  result: {
    data: {
      themeList: {
        __typename: "ThemeListResponse",
        themes: null,
        message: "No themes found",
        code: 200,
      },
    },
  },
};

const mockNoVisibleThemesResponse: MockedResponse = {
  request: {
    query: GET_THEMES_LIST,
  },
  result: {
    data: {
      themeList: {
        __typename: "ThemeListResponse",
        themes: [mockDarkThemeDataHidden],
        message: "Themes retrieved successfully",
        code: 200,
      },
    },
  },
};

const mockGetItem = jest.fn((key: string) => localStorageStore[key] ?? null);
const mockSetItem = jest.fn((key: string, value: string) => {
  localStorageStore[key] = value;
});
const mockRemoveItem = jest.fn((key: string) => {
  delete localStorageStore[key];
});
const mockClear = jest.fn(() => {
  Object.keys(localStorageStore).forEach((key) => delete localStorageStore[key]);
});

beforeEach((): void => {
  const localStorageMock: LocalStorageMock = {
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
    clear: mockClear,
  };

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  document.documentElement.style.cssText = "";
});

afterEach((): void => {
  jest.clearAllMocks();
  Object.keys(localStorageStore).forEach((key) => delete localStorageStore[key]);
});

describe("ThemeContext with GraphQL", () => {
  it("should provide default theme and write it to localStorage on successful query", async (): Promise<void> => {
    render(
      <MockedProvider mocks={[mockSuccessResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const themeSpan: HTMLElement = screen.getByTestId("theme") as HTMLElement;
      expect(themeSpan).toHaveTextContent("dark");
    });

    expect(mockSetItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("should update theme and set CSS variables when toggleTheme is called", async (): Promise<void> => {
    render(
      <MockedProvider mocks={[mockSuccessResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("loaded");
    });

    const lightButton: HTMLButtonElement = screen.getByTestId("set-light") as HTMLButtonElement;

    act(() => {
      lightButton.click();
    });

    await waitFor(() => {
      const themeSpan: HTMLElement = screen.getByTestId("theme") as HTMLElement;
      expect(themeSpan).toHaveTextContent("light");
    });

    expect(mockSetItem).toHaveBeenCalledWith("theme", "light");

    const primaryColor: string = document.documentElement.style.getPropertyValue("--primary-color");
    const bodyColor: string = document.documentElement.style.getPropertyValue("--body-color");
    
    expect(primaryColor).not.toBe("");
    expect(bodyColor).not.toBe("");
  });

  it("should initialize theme from localStorage if valid", async (): Promise<void> => {
    mockSetItem("theme", "light");

    render(
      <MockedProvider mocks={[mockSuccessResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const themeSpan: HTMLElement = screen.getByTestId("theme") as HTMLElement;
      expect(themeSpan).toHaveTextContent("light");
    });
  });

  it("should fall back to default theme if localStorage theme is invalid", async (): Promise<void> => {
    mockSetItem("theme", "invalid-theme");

    render(
      <MockedProvider mocks={[mockSuccessResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const themeSpan: HTMLElement = screen.getByTestId("theme") as HTMLElement;
      expect(themeSpan).toHaveTextContent("dark");
    });

    expect(mockSetItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("should use default themes when GraphQL query fails", async (): Promise<void> => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    render(
      <MockedProvider mocks={[mockErrorResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const themesCount: HTMLElement = screen.getByTestId("themes-count");
      const expectedCount: string = Object.keys(defaultThemes).length.toString();
      expect(themesCount).toHaveTextContent(expectedCount);
    });

    await waitFor(() => {
      const themeSpan: HTMLElement = screen.getByTestId("theme") as HTMLElement;
      expect(themeSpan).toHaveTextContent("dark");
    });

    // Vérifier que le message de fallback a été appelé (peut y avoir d'autres warnings d'Apollo)
    const calls = consoleWarnSpy.mock.calls.map(call => call[0]);
    expect(calls).toContain("[ThemeContext] Using fallback themes due to error");
    consoleWarnSpy.mockRestore();
  });

  it("should use default themes when no themes are returned from backend", async (): Promise<void> => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    render(
      <MockedProvider mocks={[mockEmptyResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const themesCount: HTMLElement = screen.getByTestId("themes-count");
      // 0 thème en BDD → charge les thèmes par défaut frontend
      const expectedCount: string = Object.keys(defaultThemes).length.toString();
      expect(themesCount).toHaveTextContent(expectedCount);
    });

    await waitFor(() => {
      const themeSpan: HTMLElement = screen.getByTestId("theme") as HTMLElement;
      expect(themeSpan).toHaveTextContent("dark");
    });

    // Vérifier que le message de fallback a été appelé (peut y avoir d'autres warnings d'Apollo)
    const calls = consoleWarnSpy.mock.calls.map(call => call[0]);
    expect(calls).toContain("[ThemeContext] Using fallback themes - no data");
    consoleWarnSpy.mockRestore();
  });

  it("should use default themes when no visible themes are available", async (): Promise<void> => {
    render(
      <MockedProvider mocks={[mockNoVisibleThemesResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const themesCount: HTMLElement = screen.getByTestId("themes-count");
      // 0 thème visible en BDD → charge les thèmes par défaut frontend
      const expectedCount: string = Object.keys(defaultThemes).length.toString();
      expect(themesCount).toHaveTextContent(expectedCount);
    });

    await waitFor(() => {
      const themeSpan: HTMLElement = screen.getByTestId("theme") as HTMLElement;
      expect(themeSpan).toHaveTextContent("dark");
    });
  });

  it("should handle empty array of themes from backend", async (): Promise<void> => {
    const mockEmptyArrayResponse: MockedResponse = {
      request: {
        query: GET_THEMES_LIST,
      },
      result: {
        data: {
          themeList: {
            __typename: "ThemeListResponse",
            themes: [],
            message: "No themes in database",
            code: 200,
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[mockEmptyArrayResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const themesCount: HTMLElement = screen.getByTestId("themes-count");
      // Tableau vide → 0 thèmes visibles → charge les thèmes par défaut frontend
      const expectedCount: string = Object.keys(defaultThemes).length.toString();
      expect(themesCount).toHaveTextContent(expectedCount);
    });
  });

  it("should load only visible themes from backend", async (): Promise<void> => {
    render(
      <MockedProvider mocks={[mockSuccessResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const themesCount: HTMLElement = screen.getByTestId("themes-count");
      const expectedVisibleThemesCount = "3";
      expect(themesCount).toHaveTextContent(expectedVisibleThemesCount);
    });
  });

  it("should show loading state initially", (): void => {
    render(
      <MockedProvider mocks={[mockSuccessResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    const loadingElement: HTMLElement = screen.getByText(/loading/i);
    expect(loadingElement).toBeInTheDocument();
  });

  it("should not show error when using fallback themes", async (): Promise<void> => {
    render(
      <MockedProvider mocks={[mockErrorResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      const errorSpan: HTMLElement = screen.getByTestId("error");
      expect(errorSpan).toHaveTextContent("no-error");
    });
  });

  it("should handle theme toggle to non-existent theme gracefully", async (): Promise<void> => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      const TestComponentWithInvalidTheme: React.FC = (): React.ReactElement => {
        const { theme, toggleTheme } = useTheme();

        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <span data-testid="loading">loaded</span>
            <button
              type="button"
              data-testid="set-invalid"
              onClick={(): void => toggleTheme("non-existent-theme" as ThemeKey)}
            >
              Invalid Theme
            </button>
          </div>
        );
      };

      render(
        <MockedProvider mocks={[mockSuccessResponse]}>
          <ThemeProvider>
            <TestComponentWithInvalidTheme />
          </ThemeProvider>
        </MockedProvider> as React.ReactElement<ThemeProviderProps>
      );

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("loaded");
      });

      const currentTheme: string | null = screen.getByTestId("theme").textContent;
      const invalidButton: HTMLButtonElement = screen.getByTestId("set-invalid") as HTMLButtonElement;

      act(() => {
        invalidButton.click();
      });

      await waitFor(() => {
        const themeSpan: HTMLElement = screen.getByTestId("theme");
        expect(themeSpan).toHaveTextContent(currentTheme || "");
      });

      const expectedWarnMessage = '[ThemeContext] Theme "non-existent-theme" not found';
      expect(consoleWarnSpy).toHaveBeenCalledWith(expectedWarnMessage);
      consoleWarnSpy.mockRestore();
  });

  it("should apply CSS variables correctly for all theme colors", async (): Promise<void> => {
    render(
      <MockedProvider mocks={[mockSuccessResponse]}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </MockedProvider> as React.ReactElement<ThemeProviderProps>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("loaded");
    });

    const ubuntuButton: HTMLButtonElement = screen.getByTestId("set-ubuntu") as HTMLButtonElement;

    act(() => {
      ubuntuButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("ubuntu");
    });

    const primaryColor: string = document.documentElement.style.getPropertyValue("--primary-color");
    const secondaryColor: string = document.documentElement.style.getPropertyValue("--secondary-color");
    const bodyColor: string = document.documentElement.style.getPropertyValue("--body-color");
    const textColor: string = document.documentElement.style.getPropertyValue("--text-color");
    const text100Color: string = document.documentElement.style.getPropertyValue("--text100-color");
    const textButtonColor: string = document.documentElement.style.getPropertyValue("--textButton-color");

    expect(primaryColor).toBe("#80D932");
    expect(secondaryColor).toBe("#dd4813");
    expect(bodyColor).toBe("#2D0922");
    expect(textColor).toBe("#F8F8FD");
    expect(text100Color).toBe("#FFFFFF");
    expect(textButtonColor).toBe("white");
  });

  it("should throw error when useTheme is used outside ThemeProvider", (): void => {
      const TestComponentOutsideProvider: React.FC = () => {
        useTheme();
        return <div />;
      };

      expect(() => render(<TestComponentOutsideProvider />)).toThrow(
        "useTheme must be used within ThemeProvider"
      );
  });
});
