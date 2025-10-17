import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ChartTypeRegistry,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme, ThemeContextObject } from "@/context/Theme/ThemeContext";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface HorizontalBarChartProps {
  labels: string[];
  data: number[];
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ labels, data }): JSX.Element => {
  const [primaryColor, setPrimaryColor] = useState<string>("#6366f1");
  const [labelColor, setLabelColor] = useState<string>("#1f2937");

  const { theme }: ThemeContextObject = useTheme();
  const { translations }: { translations: Lang } = useLang();

  useEffect((): void => {
    const style: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    const cssPrimary: string = style.getPropertyValue("--primary-color").trim();
    const cssTextColor: string = style.getPropertyValue("--text-color").trim();

    if (cssPrimary) setPrimaryColor(cssPrimary);
    if (cssTextColor) setLabelColor(cssTextColor);
  }, [theme, translations]);

  const chartData: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: translations.messagePageDashBoardMessageStatsChart ?? "Nombre d'utilisations",
        data,
        backgroundColor: primaryColor,
        borderRadius: 4,
        barThickness: 12,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      delay: (ctx): number => {
        const index: number = ctx.dataIndex ?? 0;
        const datasetIndex: number = ctx.datasetIndex ?? 0;
        return index * 150 + datasetIndex * 50;
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#000000cc",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0, color: labelColor, font: { size: 12 } },
        grid: { color: "#e5e7eb33" },
      },
      y: {
        ticks: {
          color: labelColor,
          font: { size: 14 },
          callback: function (value: string | number) {
            const label: string = this.getLabelForValue(Number(value)) ?? "";
            return label.length > 20 ? label.slice(0, 20) + "…" : label;
          },
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto"
      style={{ height: Math.max(300, labels.length * 40) }}
    >
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default HorizontalBarChart;