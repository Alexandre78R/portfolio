import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { LangProvider, useLang } from "@/context/Lang/LangContext";
import fr from "@/lang/fr";
import en from "@/lang/en";
import { TestComponentProps, LocalStorageMock } from "./context.types";

const TestComponent: React.FC<TestComponentProps> = (): React.ReactElement => {
  const { lang, translations, listLang, setLang }: { lang: string; translations: Record<string, string>; listLang: string[]; setLang: (lang: string) => void; } = useLang();

  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="title">
        {"titleAboutMe" in translations ? translations.titleAboutMe : ""}
      </span>
      <span data-testid="listLang">{listLang.join(",")}</span>

      <button
        type="button"
        data-testid="change-lang"
        onClick={() => setLang("en")}
      >
        Change
      </button>
    </div>
  );
};

const localStorageMock: Record<string, string> = {};

beforeEach((): void => {
  const mock: LocalStorageMock = {
    getItem: jest.fn((key: string) => localStorageMock[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete localStorageMock[key];
    }),
    clear: jest.fn(() => {
      Object.keys(localStorageMock).forEach((key) => delete localStorageMock[key]);
    }),
  };

  Object.defineProperty(window, "localStorage", {
    value: mock,
    writable: true,
  });
});

afterEach((): void => {
  jest.clearAllMocks();
});

describe("LangContext", () => {
  it("provides default values", (): void => {
    render(
      <LangProvider>
        <TestComponent />
      </LangProvider>
    );

    expect(screen.getByTestId("lang")).toHaveTextContent("fr");
    expect(screen.getByTestId("title")).toHaveTextContent(fr.titleAboutMe);
    expect(screen.getByTestId("listLang")).toHaveTextContent("fr,en");
  });

  it("updates language when setLang is called", async (): Promise<void> => {
    render(
      <LangProvider>
        <TestComponent />
      </LangProvider>
    );

    act(() => {
      screen.getByTestId("change-lang").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("lang")).toHaveTextContent("en");
    });

    expect(screen.getByTestId("title")).toHaveTextContent(en.titleAboutMe);
    expect(window.localStorage.setItem).toHaveBeenCalledWith("lang", "en");
  });

  it("initializes language from localStorage", async (): Promise<void> => {
    window.localStorage.setItem("lang", "en");

    render(
      <LangProvider>
        <TestComponent />
      </LangProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("lang")).toHaveTextContent("en");
    });

    expect(screen.getByTestId("title")).toHaveTextContent(en.titleAboutMe);
  });
});