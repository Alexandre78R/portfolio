import React from "react";
import { render } from "@testing-library/react";
import { Hints } from "../../../../src/components/Terminal/components/Hints";
import "@testing-library/jest-dom";

describe("Hints component", () => {
  it("renders correctly", () => {
    const { container }: { container: HTMLElement } = render(<Hints>Hint</Hints>);

    const span = container.querySelector("span") as HTMLElement;
    expect(span).toBeInTheDocument();

    expect(span).toHaveClass("mr-3.5");
  });
});