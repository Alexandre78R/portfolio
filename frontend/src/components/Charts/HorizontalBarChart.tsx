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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface HorizontalBarChartProps {
  labels: string[];
  data: number[];
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ labels, data }) => {
  const [primaryColor, setPrimaryColor] = useState<string>('#6366f1');
  const [labelColor, setLabelColor] = useState<string>('#1f2937');
  
  const { theme } = useTheme();

  useEffect(() => {
    const cssPrimary = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim();
    const cssLabelColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-color')
      .trim();

    if (cssPrimary) setPrimaryColor(cssPrimary);
    if (cssLabelColor) setLabelColor(cssLabelColor);
  }, [theme]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Nombre d’utilisations',
              data,
              backgroundColor: primaryColor,
              borderRadius: 2,
              barThickness: 10,
              borderWidth: 1,
            },
          ],
        }}
        options={{
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
            y: {
              ticks: {
                color: labelColor,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default HorizontalBarChart;