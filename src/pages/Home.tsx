import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Binary, Network, Upload } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload size={48} />,
      title: 'Data Input',
      description: 'Upload CSV/JSON files or manually enter data with real-time validation.',
      path: '/data-input',
    },
    {
      icon: <BarChart2 size={48} />,
      title: 'Visualizations',
      description: 'Create interactive charts and visualizations from your data.',
      path: '/visualizations',
    },
    {
      icon: <Binary size={48} />,
      title: 'Algorithms',
      description: 'Learn and visualize common algorithms with step-by-step animations.',
      path: '/algorithms',
    },
    {
      icon: <Network size={48} />,
      title: 'Data Structures',
      description: 'Explore and understand various data structures through interactive demos.',
      path: '/data-structures',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <Typography variant="h2" component="h1" className="mb-4">
          Interactive Data Structures & Algorithms
        </Typography>
        <Typography variant="h5" color="textSecondary" className="mb-8">
          Visualize, learn, and understand complex concepts through interactive demonstrations
        </Typography>
      </div>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Card 
              className="h-full transition-transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="text-center">
                <div className="mb-4 flex justify-center text-blue-600">
                  {feature.icon}
                </div>
                <Typography variant="h5" component="h2" className="mb-2">
                  {feature.title}
                </Typography>
                <Typography color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div className="mt-16 text-center">
        <Typography variant="h4" component="h2" className="mb-8">
          Ready to get started?
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/data-input')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Begin Your Journey
        </Button>
      </div>
    </div>
  );
};

export default Home;