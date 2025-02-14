import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DataProvider } from './context/DataContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import DataInput from './pages/DataInput';
import Visualizations from './pages/Visualizations';
import Algorithms from './pages/Algorithms';
import DataStructures from './pages/DataStructures';
import Customization from './pages/Customization';
import Export from './pages/Export';
import type { VisualizationRefs } from './pages/Visualizations';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const visualizationRefs = useRef<VisualizationRefs>(null);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <Router>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 pt-16">
                <div className="container mx-auto px-6 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/data-input" element={<DataInput />} />
                    <Route 
                      path="/visualizations" 
                      element={<Visualizations ref={visualizationRefs} />} 
                    />
                    <Route path="/algorithms" element={<Algorithms />} />
                    <Route path="/data-structures" element={<DataStructures />} />
                    <Route path="/customization" element={<Customization />} />
                    <Route 
                      path="/export" 
                      element={<Export visualizationRefs={visualizationRefs} />} 
                    />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;