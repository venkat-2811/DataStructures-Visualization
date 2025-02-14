import React from 'react';
import { Chart as ChartJS, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { useData } from '../context/DataContext';

ChartJS.register(
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

interface AdvancedVisualizationsProps {
  data: {
    headers: string[];
    rows: any[][];
  };
  type: string;
}

const AdvancedVisualizations: React.FC<AdvancedVisualizationsProps> = ({ data, type }) => {
  const { headers, rows } = data;

  const processHistogramData = () => {
    const values = rows.flatMap(row => 
      row.slice(1).map(v => parseFloat(v)).filter(v => !isNaN(v))
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = 10;
    const binSize = (max - min) / binCount;
    
    const bins = Array(binCount).fill(0);
    values.forEach(value => {
      const binIndex = Math.floor((value - min) / binSize);
      bins[Math.min(binIndex, binCount - 1)]++;
    });

    return {
      labels: Array.from({ length: binCount }, (_, i) => 
        `${(min + i * binSize).toFixed(1)} - ${(min + (i + 1) * binSize).toFixed(1)}`
      ),
      datasets: [{
        label: 'Frequency',
        data: bins,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    };
  };

  const chartConfig = {
    type: 'bar' as const,
    data: processHistogramData(),
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  };

  return (
    <div className="h-96 w-full">
      <Chart {...chartConfig} />
    </div>
  );
};

export default AdvancedVisualizations;