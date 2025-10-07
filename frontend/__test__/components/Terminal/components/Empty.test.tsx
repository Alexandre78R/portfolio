import React from "react";
import { render, screen } from "@testing-library/react";
import { Empty } from "../../../../src/components/Terminal/components/Empty";
import "@testing-library/jest-dom";

describe("Empty component", () => {
  it("renders correctly", () => {
    const { container }: { container: HTMLElement } = render(<Empty />);

    const div: HTMLElement = container.firstChild as HTMLElement;
    expect(div as HTMLElement).toBeInTheDocument();
    expect(div as HTMLElement).toHaveClass("mb-1");
  });
});