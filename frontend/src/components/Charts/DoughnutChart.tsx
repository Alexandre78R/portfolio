import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, data, title }) => {
  const [colors, setColors] = useState<string[]>([]);
  const [labelColor, setLabelColor] = useState<string>('#334155');

  /* ↪️  Récupère dynamiquement les variables CSS au montage (et au changement de thème) */
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setColors(
      style
        .getPropertyValue('--chart-colors')
        .split(',')
        .map((c) => c.trim()),
    );
    setLabelColor(style.getPropertyValue('--chart-label-color').trim());
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      {title && (
        <h3 className="text-lg font-semibold text-center mb-4 text-primary">
          {title}
        </h3>
      )}

      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderWidth: 1,
            },
          ],
        }}
        options={{
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
        }}
      />
    </div>
  );
};

export default DoughnutChart;
