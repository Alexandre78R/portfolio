import React from "react";
import { render, screen, RenderResult } from "@testing-library/react";
import { CmdNotFound } from "../../../../src/components/Terminal/components/CmdNotFound";
import "@testing-library/jest-dom";

// ---------- Mock Message ----------
jest.mock("../../../../src/components/Terminal/components/Message", () => ({
  Message: ({ children }: { children: React.ReactNode }) =>
    <div data-testid="message">{children}</div> as React.ReactElement,
}));

// ---------- Tests ----------
describe("CmdNotFound component", () => {
  const renderComponent = (cmdH: string): RenderResult =>
    render(<CmdNotFound cmdH={cmdH} /> as React.ReactElement);

  it("renders the correct message with the command", (): void => {
    const cmdH: string = "foobar";
    const renderResult: RenderResult = renderComponent(cmdH);

    const messageWrapper: HTMLElement = screen.getByTestId("message");
    expect(messageWrapper).toBeInTheDocument();
    expect(messageWrapper).toHaveTextContent(`Command not found: ${cmdH}`);
  });
});