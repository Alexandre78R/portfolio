import React from "react";
import { render, screen } from "@testing-library/react";
import Clear from "@/components/Terminal/components/Commands/Clear";
import { termContext } from "@/components/Terminal/Terminal";

// Helper pour mocker le context
const renderWithContext: (contextValue: any) => ReturnType<typeof render> = (contextValue: any) => {
  return render(
    <termContext.Provider value={contextValue}>
      <Clear />
    </termContext.Provider>
  );
};

describe("Clear command component", () => {
  test("calls clearHistory if arg is empty", () => {
    const clearHistoryMock: jest.Mock = jest.fn();
    renderWithContext({ arg: [], clearHistory: clearHistoryMock } as { arg: string[]; clearHistory: () => void });

    expect(clearHistoryMock as jest.Mock).toHaveBeenCalledTimes(1 as const);

    expect(screen.queryByText("Usage: clear" as string)).toBeNull();
  });

  test("renders usage message if arg is not empty", () => {
    const clearHistoryMock: jest.Mock = jest.fn();
    renderWithContext({ arg: ["something"], clearHistory: clearHistoryMock } as { arg: string[]; clearHistory: () => void });

    expect(screen.getByText("Usage: clear" as const) as HTMLElement).toBeInTheDocument();

    expect(clearHistoryMock as jest.Mock).not.toHaveBeenCalled();
  });
});