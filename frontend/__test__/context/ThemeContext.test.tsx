import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, useTheme } from "@/context/Theme/ThemeContext";
import themes from "@/context/Theme/themes";
import { TestComponentProps, LocalStorageMock } from "./context.types";

const TestComponent: React.FC<TestComponentProps> = (): React.ReactElement => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>

      <button
        type="button"
        data-testid="set-light"
        onClick={() => toggleTheme("light")}
      >
        Light
      </button>

      <button
        type="button"
        data-testid="set-dark"
        onClick={() => toggleTheme("dark")}
      >
        Dark
      </button>
    </div>
  );
};

const localStorageStore: Record<string, string> = {};

beforeEach((): void => {
  const localStorageMock: LocalStorageMock = {
    getItem: jest.fn((key: string) => localStorageStore[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      localStorageStore[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete localStorageStore[key];
    }),
    clear: jest.fn(() => {
      Object.keys(localStorageStore).forEach((key) => delete localStorageStore[key]);
    }),
  };

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  document.documentElement.style.cssText = "";
});

afterEach((): void => {
  jest.clearAllMocks();
});



describe("ThemeContext", () => {
  it("provides default theme and writes it to localStorage", async (): Promise<void> => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("updates theme and sets CSS variables when toggleTheme is called", async (): Promise<void> => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByTestId("set-light").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "light");

    const firstColorKey: string | undefined = Object.keys(themes.light.colors).find(
      (key) => key !== "text"
    );

    if (firstColorKey) {
      expect(
        document.documentElement.style.getPropertyValue(
          `--${firstColorKey}-color`
        )
      ).not.toBe("");
    }
  });

  it("initializes theme from localStorage if valid", async (): Promise<void> => {
    window.localStorage.setItem("theme", "light");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
    });
  });

  it("falls back to default theme if localStorage theme is invalid", async (): Promise<void> => {
    window.localStorage.setItem("theme", "invalid-theme");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("throws error when useTheme is used outside ThemeProvider", (): void => {
    const renderOutsideProvider: () => void = (): void => {
      render(<TestComponent />);
    };

    expect(renderOutsideProvider).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
  });
});