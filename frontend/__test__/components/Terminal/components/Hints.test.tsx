import React from "react";
import { render } from "@testing-library/react";
import { Hints } from "../../../../src/components/Terminal/components/Hints";
import "@testing-library/jest-dom";

describe("Hints component", () => {
  it("renders correctly", () => {
    const { container }: { container: HTMLElement } = render(<Hints>Hint</Hints>);

    const span: HTMLElement | null = container.querySelector("span" as string);
    expect(span as HTMLElement).toBeInTheDocument();

    expect(span as HTMLElement).toHaveClass("mr-3.5" as string);
  });
});