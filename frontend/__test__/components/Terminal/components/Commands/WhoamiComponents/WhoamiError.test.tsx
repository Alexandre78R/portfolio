import React from "react";
import { render, screen } from "@testing-library/react";
import WhoamiError from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiError";

jest.mock(
  "@/components/Terminal/components/Usage",
  () => {
    const MockUsage = (props: any) => <div data-testid="usage-mock">{props.cmd}</div>;
    MockUsage.displayName = "MockUsage" as string;
    return MockUsage;
  }
);

describe("WhoamiError Component", () => {
  it("should render the error message and Usage component", () => {
    const errorMessage: string = "Commande inconnue";

    render(<WhoamiError message={errorMessage} /> as React.ReactElement);

    expect(screen.getByText(errorMessage as string) as HTMLElement).toBeInTheDocument();

    const usage: HTMLElement = screen.getByTestId("usage-mock" as string) as HTMLElement;
    expect(usage as HTMLElement).toBeInTheDocument() as void;
    expect(usage as HTMLElement).toHaveTextContent("whoami") as void;
  });
});