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

describe("Clear component", () => {
  test("calls clearHistory if arg is empty", () => {
    const clearHistoryMock: jest.Mock = jest.fn();
    renderWithContext({ arg: [], clearHistory: clearHistoryMock } as any);

    expect(clearHistoryMock).toHaveBeenCalledTimes(1);

    expect(screen.queryByText("Usage: clear")).toBeNull();
  });

  test("renders usage message if arg is not empty", () => {
    const clearHistoryMock: jest.Mock = jest.fn();
    renderWithContext({ arg: ["something"], clearHistory: clearHistoryMock } as any);

    expect(screen.getByText("Usage: clear")).toBeInTheDocument();

    expect(clearHistoryMock).not.toHaveBeenCalled();
  });
});