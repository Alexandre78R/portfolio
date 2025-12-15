import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
} from '@test-utils';
import "@testing-library/jest-dom";

import {
  ChoiceViewProvider,
  useChoiceView,
} from "@/context/ChoiceView/ChoiceViewContext";
import { TestComponentProps, LocalStorageMock } from "./context.types";

const TestComponent: React.FC<TestComponentProps> = (): React.ReactElement => {
  const { selectedView, setSelectedView }: { selectedView: string; setSelectedView: (view: string) => void; } = useChoiceView();

  return (
    <div>
      <span data-testid="selectedView">{selectedView}</span>

      <button
        type="button"
        data-testid="set-text"
        onClick={() => setSelectedView("text")}
      >
        Text
      </button>

      <button
        type="button"
        data-testid="set-terminal"
        onClick={() => setSelectedView("terminal")}
      >
        Terminal
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
});

afterEach((): void => {
  jest.clearAllMocks();
});

describe("ChoiceViewContext", () => {
  it("provides default selectedView", (): void => {
    render(
      <ChoiceViewProvider>
        <TestComponent />
      </ChoiceViewProvider>
    );

    expect(screen.getByTestId("selectedView")).toHaveTextContent("text");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "voiceView",
      "text"
    );
  });

  it("updates selectedView to terminal", async (): Promise<void> => {
    render(
      <ChoiceViewProvider>
        <TestComponent />
      </ChoiceViewProvider>
    );

    act(() => {
      screen.getByTestId("set-terminal").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("selectedView")).toHaveTextContent("terminal");
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "voiceView",
      "terminal"
    );
  });

  it("initializes selectedView from localStorage", async (): Promise<void> => {
    window.localStorage.setItem("voiceView", "terminal");

    render(
      <ChoiceViewProvider>
        <TestComponent />
      </ChoiceViewProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("selectedView")).toHaveTextContent("terminal");
    });
  });

  it("throws error when useChoiceView is used outside provider", (): void => {
    const renderOutsideProvider = (): void => {
      render(<TestComponent />);
    };

    expect(renderOutsideProvider).toThrow(
      "useChoiceView must be used within a ChoiceViewProvider"
    );
  });
});
