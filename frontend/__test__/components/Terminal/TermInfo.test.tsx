import React from "react";
import { render, screen } from "@testing-library/react";
import TermInfo from "../../../src/components/Terminal/TermInfo";
import "@testing-library/jest-dom";

jest.mock("../../../src/components/Terminal/HomeTerminal", () => ({
  __esModule: true as const,
  default: () => <div data-testid="home-terminal-mock">HomeTerminal</div>,
}));

describe("TermInfo component", () => {
  it("renders correctly and includes HomeTerminal", () => {
    render(<TermInfo />);

    const wrapper: HTMLElement | null = screen.getByText("HomeTerminal").parentElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("inline-block mr-2");

    expect(screen.getByTestId("home-terminal-mock")).toHaveTextContent("HomeTerminal");
  });
});