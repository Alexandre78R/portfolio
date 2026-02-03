import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ChartDataset,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DoughnutChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, data, title }: DoughnutChartProps): JSX.Element => {

  const [colors, _] : [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [labelColor, setLabelColor]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>('#334155');

  useEffect(() => {
    const style: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    const chartColorsString: string = style.getPropertyValue("--chart-colors").trim();
    const chartColors: string[] = chartColorsString
      ? chartColorsString.split(",").map((c) => c.trim())
      : [];

    const chartLabelColor: string = style.getPropertyValue("--chart-label-color").trim() || "#334155";

    setLabelColor(chartLabelColor.trim() || '#334155');
  }, []);

  const chartData: ChartData<'doughnut', number[], string> = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 1,
      } as ChartDataset<'doughnut', number[]>,
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: '#000000cc',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
      legend: {
        position: 'bottom',
        labels: {
          color: labelColor,
          boxWidth: 16,
          padding: 12,
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {title && (
        <h3 className="text-lg font-semibold text-center mb-4 text-primary">
          {title}
        </h3>
      )}

      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default DoughnutChart;