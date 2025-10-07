import React from "react";
import { render, screen } from "@testing-library/react";
import HomeTerminal from "../../../src/components/Terminal/HomeTerminal";
import "@testing-library/jest-dom";

describe("HomeTerminal component", () => {
  const originalInnerWidth: number = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: originalInnerWidth });
  });

  it("renders correctly with wide screen", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });

    render(<HomeTerminal /> as React.ReactElement);

    const visitorSpan: HTMLElement = screen.getByText("visitor");
    const domainSpan: HTMLElement = screen.getByText("alexandre-renard.dev");

    expect(visitorSpan as HTMLElement).toBeInTheDocument();
    expect(visitorSpan as HTMLElement).toHaveClass("text-secondary");

    expect(domainSpan as HTMLElement).toBeInTheDocument();
    expect(domainSpan as HTMLElement).toHaveClass("text-primary");
  });

  it("renders correctly with narrow screen", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 300 });

    render(<HomeTerminal /> as React.ReactElement);

    const visitorSpan: HTMLElement = screen.getByText("vis.");
    const domainSpan: HTMLElement = screen.getByText("a-renard.dev");

    expect(visitorSpan as HTMLElement).toBeInTheDocument();
    expect(visitorSpan as HTMLElement).toHaveClass("text-secondary");

    expect(domainSpan as HTMLElement).toBeInTheDocument();
    expect(domainSpan as HTMLElement).toHaveClass("text-primary");
  });

  it("renders all text content in proper order", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });

    const { container }: { container: HTMLElement } = render(<HomeTerminal />);
    expect(container.textContent as string).toBe("visitor@alexandre-renard.dev :~$");
  });
});