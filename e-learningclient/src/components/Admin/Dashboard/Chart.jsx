import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend
);

export const LineChart = ({ views = [] }) => {
  const labels = getLastYearMonths();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0a0a1e',
        titleFont: { family: "'Syne', sans-serif", size: 13, weight: '700' },
        bodyFont: { family: "'DM Sans', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'DM Sans', sans-serif", size: 11 },
          color: '#9ca3af',
          maxRotation: 0,
        },
        border: { display: false },
      },
      y: {
        grid: { color: '#f3f4f6', drawBorder: false },
        ticks: {
          font: { family: "'DM Sans', sans-serif", size: 11 },
          color: '#9ca3af',
        },
        border: { display: false, dash: [4, 4] },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#7c5cfc',
        borderColor: 'white',
        borderWidth: 2,
      },
      line: {
        tension: 0.4,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Views',
        data: views,
        borderColor: '#7c5cfc',
        backgroundColor: 'rgba(124,92,252,0.08)',
        borderWidth: 2.5,
        fill: true,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export const DoughnutChart = ({ users = [] }) => {
  const options = {
    responsive: true,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0a0a1e',
        titleFont: { family: "'Syne', sans-serif", size: 13, weight: '700' },
        bodyFont: { family: "'DM Sans', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 10,
      },
    },
  };

  const data = {
    labels: ['Subscribed', 'Not Subscribed'],
    datasets: [
      {
        label: 'Users',
        data: users,
        borderColor: ['#7c5cfc', '#ff5f3a'],
        backgroundColor: ['rgba(124,92,252,0.8)', 'rgba(255,95,58,0.8)'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  return <Doughnut data={data} options={options} />;
};

function getLastYearMonths() {
  const labels = [];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const currentMonth = new Date().getMonth();

  for (let i = currentMonth; i >= 0; i--) {
    labels.unshift(months[i]);
    if (i === 0) break;
  }
  for (let i = 11; i > currentMonth; i--) {
    if (i === currentMonth) break;
    labels.unshift(months[i]);
  }

  return labels;
}