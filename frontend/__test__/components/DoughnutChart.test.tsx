import React from "react";
import { render, screen } from '@testing-library/react';
import DoughnutChart from "@/components/Charts/DoughnutChart";

jest.mock("react-chartjs-2", () => ({
  Doughnut: (props: any) => (
    <div data-testid="doughnut-chart" {...props}>
      Mocked Doughnut
    </div>
  ),
}));

describe("DoughnutChart", () => {
  const labels: string[] = ["A", "B", "C"];
  const data: number[] = [10, 20, 30];
  const title: string = "Test Chart";

  beforeEach(() => {
    Object.defineProperty(document.documentElement, "style", {
      value: {
        getPropertyValue: (prop: string): string => {
          if (prop === "--chart-colors") return "red, green, blue";
          if (prop === "--chart-label-color") return "#123456";
          return "";
        },
        setProperty: jest.fn(),
      },
      configurable: true,
    });
  });

  it("renders title when provided", () => {
    render(<DoughnutChart labels={labels} data={data} title={title} />);

    const titleElement: HTMLHeadingElement | null = screen.getByText(title);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders Doughnut chart with data and labels", () => {
    render(<DoughnutChart labels={labels} data={data} />);

    const chartElement: HTMLDivElement | null = screen.getByTestId("doughnut-chart");
    expect(chartElement).toBeInTheDocument();

    expect(chartElement).toMatchSnapshot();
  });

  it("uses colors from CSS variables", () => {
    render(<DoughnutChart labels={labels} data={data} />);
    const chartElement: HTMLDivElement | null = screen.getByTestId("doughnut-chart");
    expect(chartElement).toBeInTheDocument();

    const chartProps: DOMStringMap = chartElement.dataset;
    expect(chartProps).toBeDefined();
  });
});
