import React from "react";
import { render, screen, RenderResult } from '@test-utils';
import Clear from "@/components/Terminal/components/Commands/Clear";
import { termContext, Term } from "@/components/Terminal/Terminal";

const renderWithContext = (contextValue: Term): RenderResult =>
  render(
    <termContext.Provider value={contextValue}>
      <Clear />
    </termContext.Provider>
  );

describe("Clear command component", () => {
  it("calls clearHistory if arg is empty", (): void => {
    const clearHistoryMock: jest.Mock = jest.fn();

    renderWithContext({ arg: [], history: [], rerender: false, index: 0, clearHistory: clearHistoryMock });

    expect(clearHistoryMock).toHaveBeenCalledTimes(1);

    const usageMessage: HTMLElement | null = screen.queryByText("Usage: clear");
    expect(usageMessage).toBeNull();
  });

  it("renders usage message if arg is not empty", (): void => {
    const clearHistoryMock: jest.Mock = jest.fn();

    renderWithContext({ arg: ["something"], history: [], rerender: false, index: 0, clearHistory: clearHistoryMock });

    const usageMessage: HTMLElement = screen.getByText("Usage: clear");
    expect(usageMessage).toBeInTheDocument();

    expect(clearHistoryMock).not.toHaveBeenCalled();
  });
});
