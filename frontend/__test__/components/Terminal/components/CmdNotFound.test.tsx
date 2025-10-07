import React from "react";
import { render, screen } from "@testing-library/react";
import { CmdNotFound } from "../../../../src/components/Terminal/components/CmdNotFound";
import "@testing-library/jest-dom";

jest.mock("../../../../src/components/Terminal/components/Message", () => ({
  Message: ({ children }: any) => <div data-testid="message">{children}</div>,
}));

describe("CmdNotFound component", () => {
  it("renders the correct message with the command", () => {
    const cmdH: string = "foobar";
    render(<CmdNotFound cmdH={cmdH} />);

    const messageWrapper: HTMLElement = screen.getByTestId("message");
    expect(messageWrapper as HTMLElement).toBeInTheDocument();

    expect(messageWrapper as HTMLElement).toHaveTextContent(`Command not found: ${cmdH}`);
  });
});