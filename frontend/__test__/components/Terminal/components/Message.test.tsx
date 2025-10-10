import React from "react";
import { render, screen } from "@testing-library/react";
import { Message } from "../../../../src/components/Terminal/components/Message";
import "@testing-library/jest-dom";

describe("Message component", () => {
  it("renders children correctly", (): void => {
    render(
      <Message>
        <span data-testid="child">Hello World</span>
      </Message>
    );

    const child: HTMLElement = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Hello World");
  });

  it("applies the correct CSS class", (): void => {
    render(<Message>Test</Message>);

    const div: HTMLElement = screen.getByText("Test");
    expect(div).toHaveClass("mb-[0.25rem]");
  });
});