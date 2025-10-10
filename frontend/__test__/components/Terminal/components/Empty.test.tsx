import React from "react";
import { render, screen, RenderResult } from "@testing-library/react";
import { Empty } from "../../../../src/components/Terminal/components/Empty";
import "@testing-library/jest-dom";

describe("Empty component", () => {
  const renderComponent = (): RenderResult => render(<Empty /> as React.ReactElement);

  it("renders correctly", (): void => {
    const { container }: RenderResult = renderComponent();

    const div: HTMLElement | null = container.firstChild as HTMLElement | null;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass("mb-1");
  });
});