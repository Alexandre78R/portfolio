import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, data, title }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {title && <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>}
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data,
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        }}
      />
    </div>
  );
};

export default DoughnutChart;