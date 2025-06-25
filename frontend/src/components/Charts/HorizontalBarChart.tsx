// import { useState, useEffect } from 'react';
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import { useTheme } from "@/context/Theme/ThemeContext";

// // ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// interface HorizontalBarChartProps {
//   labels: string[];
//   data: number[];
// }

// const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ labels, data }) => {
//   const [primaryColor, setPrimaryColor] = useState<string>('#6366f1');
//   const [labelColor, setLabelColor] = useState<string>('#1f2937');

//   const { theme } = useTheme(); 

//   useEffect(() => {
//     const style = getComputedStyle(document.documentElement);

//     const cssPrimary = style.getPropertyValue('--primary-color').trim();
//     const cssTextColor = style.getPropertyValue('--text-color').trim();

//     if (cssPrimary) setPrimaryColor(cssPrimary);
//     if (cssTextColor) setLabelColor(cssTextColor);
//   }, [theme]);

//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <Bar
//         data={{
//           labels,
//           datasets: [
//             {
//               label: 'Nombre d’utilisations',
//               data,
//               backgroundColor: primaryColor,
//               borderRadius: 4,
//               barThickness: 12,
//               borderWidth: 1,
//             },
//           ],
//         }}
//         options={{
//           indexAxis: 'y', // horizontal
//           responsive: true,
//           plugins: {
//             legend: { display: false },
//             tooltip: {
//               backgroundColor: '#000000cc',
//               titleColor: '#ffffff',
//               bodyColor: '#ffffff',
//             },
//           },
//           scales: {
//             x: {
//               beginAtZero: true,
//               ticks: {
//                 precision: 0,
//                 color: labelColor,
//                 font: {
//                   size: 12,
//                 },
//               },
//               grid: {
//                 color: '#e5e7eb33', // optional: très léger
//               },
//             },
//             y: {
//               ticks: {
//                 color: labelColor,
//                 font: {
//                   size: 14,
//                 },
//               },
//               grid: {
//                 display: false,
//               },
//             },
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default HorizontalBarChart;