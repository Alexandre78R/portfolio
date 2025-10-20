import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import { CircularProgress as MuiCircularProgress, CircularProgressProps } from "@mui/material";

const originalModule: typeof import("@mui/material") = jest.requireActual("@mui/material");

jest.mock("@mui/material", () => ({
  __esModule: true,
  ...jest.requireActual("@mui/material"),
  CircularProgress: jest.fn(
    ({ className, size, thickness, style }: CircularProgressProps) => (
      <div
        data-testid="circular-progress"
        className={className}
        data-size={size}
        data-thickness={thickness}
        style={style as React.CSSProperties}
      />
    )
  ),
}));

describe("LoadingCustom Component", (): void => {
  it("renders without crashing", (): void => {
    const { container }: { container: HTMLElement } = render(<LoadingCustom />);
    const outerDiv: HTMLDivElement | null = container.querySelector("div.flex.justify-center.items-center.h-52");
    expect(outerDiv).toBeInTheDocument();
  });

  it("renders a CircularProgress component", (): void => {
    render(<LoadingCustom />);
    const circularProgressElement: HTMLElement | null = screen.getByTestId("circular-progress");
    expect(circularProgressElement).toBeInTheDocument();
  });

  it("passes correct props to CircularProgress", (): void => {
    render(<LoadingCustom />);
    const circularProgressElement: HTMLElement | null = screen.getByTestId("circular-progress");

    expect(circularProgressElement).toHaveClass("text-primary");
    expect(circularProgressElement).toHaveAttribute("data-size", "60");
    expect(circularProgressElement).toHaveAttribute("data-thickness", "4");

    expect(circularProgressElement?.style.animation).toBe("pulse-spin 12s ease-in-out infinite");
    expect(circularProgressElement?.style.borderRadius).toBe("50%");
  });

  it("container div has correct classes", (): void => {
    const { container }: { container: HTMLElement } = render(<LoadingCustom />);
    const outerDiv: HTMLDivElement | null = container.querySelector("div.flex.justify-center.items-center.h-52");
    expect(outerDiv).toBeInTheDocument();
    expect(outerDiv?.className).toContain("flex");
    expect(outerDiv?.className).toContain("justify-center");
    expect(outerDiv?.className).toContain("items-center");
    expect(outerDiv?.className).toContain("h-52");
  });
});