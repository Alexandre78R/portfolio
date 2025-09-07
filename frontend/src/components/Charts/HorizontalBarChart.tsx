import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from "@/context/Theme/ThemeContext";
import { useLang } from '@/context/Lang/LangContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface HorizontalBarChartProps {
  labels: string[];
  data: number[];
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ labels, data }) => {
  const [primaryColor, setPrimaryColor] = useState<string>('#6366f1');
  const [labelColor, setLabelColor] = useState<string>('#1f2937');

  const { theme } = useTheme();
  const { translations } = useLang();

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);

    const cssPrimary = style.getPropertyValue('--primary-color').trim();
    const cssTextColor = style.getPropertyValue('--text-color').trim();

    if (cssPrimary) setPrimaryColor(cssPrimary);
    if (cssTextColor) setLabelColor(cssTextColor);
  }, [theme, translations]);

  return (
    <div className="w-full max-w-4xl mx-auto" style={{ height: Math.max(300, labels.length * 40) }}>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: translations.messagePageDashBoardMessageStatsChart  || "Nombre d'utilisations",
              data,
              backgroundColor: primaryColor,
              borderRadius: 4,
              barThickness: 12,
              borderWidth: 1,
            },
          ],
        }}
        options={{
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            delay: (ctx) => {
              const index = ctx.dataIndex;
              const datasetIndex = ctx.datasetIndex;
              return index * 150 + datasetIndex * 50;
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#000000cc',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: labelColor,
                font: { size: 12 },
              },
              grid: {
                color: '#e5e7eb33',
              },
            },
            y: {
              ticks: {
                color: labelColor,
                font: { size: 14 },
                callback: function(value) {
                  const label = this.getLabelForValue(Number(value));
                  return label.length > 20 ? label.slice(0, 20) + '…' : label;
                },
              },
              grid: { display: false },
            },
          },
        }}
      />
    </div>
  );
};

export default HorizontalBarChart;