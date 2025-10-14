import React, { ReactElement } from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LangProvider, useLang, LangContextType } from "@/context/Lang/LangContext";
import fr from "@/lang/fr";
import en from "@/lang/en";

const TestComponent: React.FC<unknown> = (): ReactElement => {
  const { lang, translations, listLang, setLang }: LangContextType = useLang();

  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="title">{translations.titleAboutMe}</span>
      <span data-testid="listLang">{listLang.join(",")}</span>

      <button
        type="button"
        data-testid="change-lang"
        onClick={(): void => setLang("en")}
      >
        Change
      </button>
    </div>
  );
};

const localStorageMock: Record<string, string> = {};

beforeEach((): void => {
  const mock: Storage = {
    getItem: jest.fn((key: string): string | null => localStorageMock[key] ?? null),
    setItem: jest.fn((key: string, value: string): void => {
      localStorageMock[key] = value;
    }),
    removeItem: jest.fn((key: string): void => {
      delete localStorageMock[key];
    }),
    clear: jest.fn((): void => {
      Object.keys(localStorageMock).forEach((key) => delete localStorageMock[key]);
    }),
    length: 0,
    key: jest.fn(),
  };

  Object.defineProperty(window, "localStorage", {
    value: mock,
    writable: true,
  });
});

afterEach((): void => {
  jest.clearAllMocks();
});

describe("LangContext", (): void => {
  it("provides default values", (): void => {
    render(
      <LangProvider>
        <TestComponent />
      </LangProvider>
    );

    const langSpan: HTMLElement = screen.getByTestId("lang") as HTMLElement;
    const titleSpan: HTMLElement = screen.getByTestId("title") as HTMLElement;
    const listLangSpan: HTMLElement = screen.getByTestId("listLang") as HTMLElement;

    expect(langSpan).toHaveTextContent("fr");
    expect(titleSpan).toHaveTextContent(fr.titleAboutMe);
    expect(listLangSpan).toHaveTextContent("fr,en");
  });

  it("updates language when setLang is called", async (): Promise<void> => {
    render(
      <LangProvider>
        <TestComponent />
      </LangProvider>
    );

    const changeButton: HTMLButtonElement = screen.getByTestId("change-lang") as HTMLButtonElement;

    act((): void => {
      changeButton.click();
    });

    await waitFor((): void => {
      const langSpan: HTMLElement = screen.getByTestId("lang") as HTMLElement;
      expect(langSpan).toHaveTextContent("en");
    });

    const titleSpan: HTMLElement = screen.getByTestId("title") as HTMLElement;
    expect(titleSpan).toHaveTextContent(en.titleAboutMe);
    expect(window.localStorage.setItem).toHaveBeenCalledWith("lang", "en");
  });

  it("initializes language from localStorage", async (): Promise<void> => {
    window.localStorage.setItem("lang", "en");

    render(
      <LangProvider>
        <TestComponent />
      </LangProvider>
    );

    await waitFor((): void => {
      const langSpan: HTMLElement = screen.getByTestId("lang") as HTMLElement;
      expect(langSpan).toHaveTextContent("en");
    });

    const titleSpan: HTMLElement = screen.getByTestId("title") as HTMLElement;
    expect(titleSpan).toHaveTextContent(en.titleAboutMe);
  });
});