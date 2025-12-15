import React from "react";
import { render, RenderResult } from '@test-utils';
import { Hints } from "../../../../src/components/Terminal/components/Hints";
import "@testing-library/jest-dom";

describe("Hints component", () => {
  it("renders correctly", (): void => {
    const { container }: RenderResult = render(<Hints>Hint</Hints>);

    const span: HTMLSpanElement | null = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass("mr-3.5");
  });
});
