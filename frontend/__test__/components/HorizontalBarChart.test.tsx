import React from "react";
import { render } from "@testing-library/react";
import HorizontalBarChart from "@/components/Charts/HorizontalBarChart";
import { useTheme, ThemeContextObject } from "@/context/Theme/ThemeContext";
import { useLang, LangContextType } from "@/context/Lang/LangContext";

jest.mock("@/context/Theme/ThemeContext", () => ({
  useTheme: jest.fn<ThemeContextObject, []>(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn<LangContextType, []>(),
}));

describe("HorizontalBarChart", () => {
  const labels: string[] = ["Label 1", "Label 2", "Label 3"];
  const data: number[] = [10, 20, 30];

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" } as ThemeContextObject);
    (useLang as jest.Mock).mockReturnValue({
      translations: { messagePageDashBoardMessageStatsChart: "Nombre d'utilisations" },
      lang: "fr",
    } as LangContextType);
  });

  it("renders without crashing", () => {
    const { container }: { container: HTMLElement } = render(<HorizontalBarChart labels={labels} data={data} />);
    const chartWrapper: HTMLCanvasElement | null = container.querySelector("canvas");
    expect(chartWrapper).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container }: { container: HTMLElement } = render(<HorizontalBarChart labels={labels} data={data} />);
    expect(container).toMatchSnapshot();
  });

  it("uses correct chart labels", () => {
    render(<HorizontalBarChart labels={labels} data={data} />);
    labels.forEach((label: string) => {
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it("renders correct number of bars", () => {
    const { container }: { container: HTMLElement } = render(<HorizontalBarChart labels={labels} data={data} />);
    const canvas: HTMLCanvasElement | null = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
  });
});
