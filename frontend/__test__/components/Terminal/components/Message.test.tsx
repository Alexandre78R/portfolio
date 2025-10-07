import React from "react";
import { render, screen } from "@testing-library/react";
import { Message } from "../../../../src/components/Terminal/components/Message";
import "@testing-library/jest-dom";

describe("Message component", () => {
  it("renders children correctly", () => {
    render(
      <Message>
        <span data-testid="child">Hello World</span>
      </Message>
    );

    const child: HTMLElement = screen.getByTestId("child" as string);
    expect(child as HTMLElement).toBeInTheDocument();
    expect(child as HTMLElement).toHaveTextContent("Hello World" as string);
  });

  it("applies the correct CSS class", () => {
    render(<Message>Test</Message> as React.ReactElement);

    const div: HTMLElement = screen.getByText("Test" as string);
    expect(div as HTMLElement).toHaveClass("mb-[0.25rem]" as string);
  });
});