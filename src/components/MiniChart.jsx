import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const MiniChart = ({ data, change7d }) => {
  // Determine chart color based on 7-day change
  // Force the color to match the trend (green for positive, red for negative)
  // This ensures visual consistency with the percentage display
  const isPositive = change7d >= 0;
  const chartColor = isPositive ? 'rgba(46, 204, 113, 1)' : 'rgba(231, 76, 60, 1)';
  const chartBgColor = isPositive ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)';

  const chartData = {
    labels: ['', '', '', '', '', '', ''], // Empty labels for cleaner look
    datasets: [
      {
        data: data,
        fill: true,
        backgroundColor: chartBgColor,
        borderColor: chartColor,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0, // Hide points for cleaner look
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false, // Disable tooltips for mini chart
      },
      legend: {
        display: false, // Hide legend
      },
    },
    scales: {
      x: {
        display: false, // Hide x-axis
      },
      y: {
        display: false, // Hide y-axis
      },
    },
  };

  return (
    <div style={{ width: '100px', height: '40px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MiniChart;
