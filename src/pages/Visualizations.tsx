import React, { useState, useMemo, useRef } from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Alert,
  Button,
  ButtonGroup
} from '@mui/material';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import { useData } from '../context/DataContext';
import AdvancedVisualizations from '../components/AdvancedVisualizations';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Visualizations: React.FC = () => {
  const [chartType, setChartType] = useState('line');
  const { currentData } = useData();
  const chartRef = useRef<any>(null);

  const downloadChart = (format: 'png' | 'jpeg') => {
    if (!chartRef.current) return;

    try {
      let chartInstance = chartRef.current;
      
      // Access the underlying Chart.js instance
      if (chartInstance.current) {
        chartInstance = chartInstance.current;
      }

      // Get base64 image
      const imageData = chartInstance.toBase64Image(format);

      // Create download link
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.${format}`;
      link.href = imageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading chart:', error);
      alert('Failed to download chart. Please try again.');
    }
  };

  const chartData = useMemo(() => {
    if (!currentData) return null;

    const { headers, rows } = currentData;
    
    const labels = rows.map(row => row[0]);
    const datasets = headers.slice(1).map((header, index) => ({
      label: header,
      data: rows.map(row => parseFloat(row[index + 1]) || 0),
      borderColor: `hsl(${index * 45}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 45}, 70%, 50%, 0.5)`,
    }));

    return {
      labels,
      datasets,
    };
  }, [currentData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Data Visualization',
      },
    },
    animation: false // Disable animations for better export quality
  };

  if (!currentData) {
    return (
      <Alert severity="info" className="mb-4">
        Please upload or input data in the Data Input section first.
      </Alert>
    );
  }

  const renderChart = () => {
    if (!chartData) return null;

    let ChartComponent;
    switch (chartType) {
      case 'line':
        ChartComponent = Line;
        break;
      case 'bar':
        ChartComponent = Bar;
        break;
      case 'pie':
        ChartComponent = Pie;
        break;
      case 'scatter':
        ChartComponent = Scatter;
        break;
      default:
        return null;
    }

    return (
      <div className="space-y-4">
        <ChartComponent
          ref={chartRef}
          data={chartData}
          options={options}
        />
        <div className="flex justify-center mt-4">
          <ButtonGroup variant="contained" size="small">
            <Button
              onClick={() => downloadChart('png')}
              startIcon={<Download size={16} />}
            >
              Download PNG
            </Button>
            <Button
              onClick={() => downloadChart('jpeg')}
              startIcon={<Download size={16} />}
            >
              Download JPEG
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Typography variant="h4" component="h1" className="mb-6">
        Visualizations
      </Typography>

      <Paper className="p-6">
        <FormControl fullWidth className="mb-6">
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value)}
          >
            <MenuItem value="line">Line Chart</MenuItem>
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="pie">Pie Chart</MenuItem>
            <MenuItem value="scatter">Scatter Plot</MenuItem>
            <MenuItem value="histogram">Histogram</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {chartType === 'histogram' ? (
                  <AdvancedVisualizations data={currentData} type={chartType} />
                ) : (
                  renderChart()
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Visualizations;