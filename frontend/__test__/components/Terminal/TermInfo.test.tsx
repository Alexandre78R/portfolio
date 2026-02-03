import { type ReactElement } from "react";
import { render, screen } from '@test-utils';
import TermInfo from "../../../src/components/Terminal/TermInfo";
import "@testing-library/jest-dom";

jest.mock("../../../src/components/Terminal/HomeTerminal", () => ({
  __esModule: true as const,
  default: () => <div data-testid="home-terminal-mock">HomeTerminal</div>,
}));

describe("TermInfo component", () => {
  it("renders correctly and includes HomeTerminal", () => {
    render(<TermInfo /> as React.ReactElement);

    const wrapper: HTMLElement | null = screen.getByText("HomeTerminal").parentElement;
    expect(wrapper as HTMLElement).toBeInTheDocument();
    expect(wrapper as HTMLElement).toHaveClass("inline-block mr-2" as string);

    expect(screen.getByTestId("home-terminal-mock" as string) as HTMLElement).toHaveTextContent("HomeTerminal" as string);
  });
});
