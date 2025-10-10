import React from "react";
import { render, screen, RenderResult } from "@testing-library/react";
import WhoamiError from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiError";

// 🔹 Mock strictement typé
jest.mock("@/components/Terminal/components/Usage", () => {
  const MockUsage = (props: { cmd: string }): JSX.Element => (
    <div data-testid="usage-mock">{props.cmd}</div>
  );
  MockUsage.displayName = "MockUsage";
  return MockUsage;
});

describe("WhoamiError Component", () => {
  it("renders the error message and Usage component", (): void => {
    const errorMessage: string = "Commande inconnue";

    const renderResult: RenderResult = render(<WhoamiError message={errorMessage} />);

    const errorElement: HTMLElement | null = screen.queryByText(errorMessage);
    expect(errorElement).not.toBeNull();
    if (errorElement) expect(errorElement).toBeInTheDocument();

    const usageElement: HTMLElement = screen.getByTestId("usage-mock");
    expect(usageElement).toBeInTheDocument();
    expect(usageElement).toHaveTextContent("whoami");
  });
});