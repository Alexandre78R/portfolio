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

    render(<HomeTerminal />);

    const visitorSpan: HTMLElement = screen.getByText("visitor");
    const domainSpan: HTMLElement = screen.getByText("alexandre-renard.dev");

    expect(visitorSpan).toBeInTheDocument();
    expect(visitorSpan).toHaveClass("text-secondary");

    expect(domainSpan).toBeInTheDocument();
    expect(domainSpan).toHaveClass("text-primary");
  });

  it("renders correctly with narrow screen", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 300 });

    render(<HomeTerminal />);

    const visitorSpan: HTMLElement = screen.getByText("vis.");
    const domainSpan: HTMLElement = screen.getByText("a-renard.dev");

    expect(visitorSpan).toBeInTheDocument();
    expect(visitorSpan).toHaveClass("text-secondary");

    expect(domainSpan).toBeInTheDocument();
    expect(domainSpan).toHaveClass("text-primary");
  });

  it("renders all text content in proper order", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });

    const { container }: { container: HTMLElement } = render(<HomeTerminal />);
    expect(container.textContent).toBe("visitor@alexandre-renard.dev :~$");
  });
});