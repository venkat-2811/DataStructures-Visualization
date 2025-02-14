import React, { useState } from 'react';
import { Typography, Paper, Grid, Card, CardContent, Button, TextField, Slider, Box } from '@mui/material';
import { Theme } from '../types';

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#1f2937',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
};

const Customization: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [fontSize, setFontSize] = useState(16);
  const [spacing, setSpacing] = useState(8);

  const handleColorChange = (key: keyof Theme['colors'], value: string) => {
    setTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [key]: value,
      },
    });
  };

  const handleFontChange = (key: keyof Theme['fonts'], value: string) => {
    setTheme({
      ...theme,
      fonts: {
        ...theme.fonts,
        [key]: value,
      },
    });
  };

  const saveTheme = () => {
    localStorage.setItem('userTheme', JSON.stringify(theme));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    setFontSize(16);
    setSpacing(8);
  };

  return (
    <div className="space-y-6">
      <Typography variant="h4" component="h1" className="mb-6">
        Customization
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Color Palette
            </Typography>
            <div className="space-y-4">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-4">
                  <Typography className="w-24">{key}</Typography>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <TextField
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Typography
            </Typography>
            <div className="space-y-4">
              {Object.entries(theme.fonts).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-4">
                  <Typography className="w-24">{key}</Typography>
                  <TextField
                    value={value}
                    onChange={(e) => handleFontChange(key as keyof Theme['fonts'], e.target.value)}
                    size="small"
                    fullWidth
                  />
                </div>
              ))}
              <div>
                <Typography gutterBottom>Base Font Size</Typography>
                <Slider
                  value={fontSize}
                  onChange={(_, value) => setFontSize(value as number)}
                  min={12}
                  max={24}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </div>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Layout & Spacing Continuing directly from the previous Customization.tsx file:

            </Typography>
            <div className="space-y-4">
              <div>
                <Typography gutterBottom>Base Spacing Unit</Typography>
                <Slider
                  value={spacing}
                  onChange={(_, value) => setSpacing(value as number)}
                  min={4}
                  max={16}
                  step={2}
                  marks
                  valueLabelDisplay="auto"
                />
              </div>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Preview
            </Typography>
            <div 
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                fontSize: `${fontSize}px`,
              }}
            >
              <h2 style={{ 
                fontFamily: theme.fonts.heading,
                color: theme.colors.primary,
                marginBottom: `${spacing * 2}px`
              }}>
                Sample Heading
              </h2>
              <p className="mb-4">
                This is a preview of your custom theme. The text, colors, and spacing
                will update as you make changes to the theme settings.
              </p>
              <div className="space-y-2">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: theme.colors.primary,
                    marginRight: `${spacing}px`,
                  }}
                >
                  Primary Button
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: theme.colors.secondary,
                  }}
                >
                  Secondary Button
                </Button>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>

      <Box className="flex justify-end space-x-4">
        <Button variant="outlined" onClick={resetTheme}>
          Reset to Default
        </Button>
        <Button variant="contained" onClick={saveTheme}>
          Save Theme
        </Button>
      </Box>
    </div>
  );
};

export default Customization;