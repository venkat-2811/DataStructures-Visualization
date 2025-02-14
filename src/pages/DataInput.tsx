import React, { useState, useCallback } from 'react';
import { Typography, Paper, Card, CardContent, Tabs, Tab, Button, TextField, Alert } from '@mui/material';
import { Upload, FileSpreadsheet, Database, Shuffle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const DataInput: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [manualData, setManualData] = useState<string[][]>([['Column 1', 'Column 2'], ['', '']]);
  const { setCurrentData, setDataSource } = useData();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        Papa.parse(file, {
          complete: (results) => {
            const headers = results.data[0] as string[];
            const rows = results.data.slice(1) as any[][];
            setCurrentData({ headers, rows });
            setDataSource('file-upload');
            setError(null);
          },
          error: (error) => {
            setError(error.message);
          },
        });
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            if (Array.isArray(json)) {
              const headers = Object.keys(json[0]);
              const rows = json.map(item => headers.map(header => item[header]));
              setCurrentData({ headers, rows });
              setDataSource('file-upload');
              setError(null);
            }
          } catch (err) {
            setError('Invalid JSON format');
          }
        };
        reader.readAsText(file);
      } else {
        setError('Unsupported file format. Please upload CSV or JSON files.');
      }
    }
  }, [setCurrentData, setDataSource]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
  });

  const generateRandomData = () => {
    const headers = ['ID', 'Name', 'Value', 'Category'];
    const categories = ['A', 'B', 'C', 'D'];
    const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie'];
    
    const rows = Array.from({ length: 10 }, (_, i) => [
      (i + 1).toString(),
      names[Math.floor(Math.random() * names.length)],
      Math.floor(Math.random() * 1000).toString(),
      categories[Math.floor(Math.random() * categories.length)],
    ]);

    setCurrentData({ headers, rows });
    setDataSource('random');
  };

  const addRow = () => {
    setManualData([...manualData, Array(manualData[0].length).fill('')]);
  };

  const addColumn = () => {
    const newColumnIndex = manualData[0].length + 1;
    setManualData(manualData.map(row => [...row, row === manualData[0] ? `Column ${newColumnIndex}` : '']));
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...manualData];
    newData[rowIndex][colIndex] = value;
    setManualData(newData);
  };

  const saveManualData = () => {
    const headers = manualData[0];
    const rows = manualData.slice(1);
    setCurrentData({ headers, rows });
    setDataSource('manual');
  };

  const navigateToVisualization = () => {
    navigate('/visualizations');
  };

  return (
    <div className="space-y-6">
      <Typography variant="h4" component="h1" className="mb-6">
        Data Input
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} className="mb-4">
        <Tab icon={<Upload className="mr-2" />} label="File Upload" />
        <Tab icon={<FileSpreadsheet className="mr-2" />} label="Manual Entry" />
        <Tab icon={<Shuffle className="mr-2" />} label="Random Data" />
      </Tabs>

      {activeTab === 0 && (
        <Paper
          {...getRootProps()}
          className={`p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'
          } border-2 border-dashed rounded-lg`}
        >
          <input {...getInputProps()} />
          <Database className="mx-auto mb-4 text-gray-400" size={48} />
          <Typography variant="h6" className="mb-2">
            {isDragActive ? 'Drop your files here' : 'Drag & drop files here'}
          </Typography>
          <Typography color="textSecondary">
            Support for CSV and JSON files
          </Typography>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper className="p-6">
          <div className="mb-4 space-x-4">
            <Button variant="outlined" onClick={addRow}>Add Row</Button>
            <Button variant="outlined" onClick={addColumn}>Add Column</Button>
            <Button variant="contained" onClick={saveManualData}>Save Data</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <tbody>
                {manualData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="p-2">
                        <TextField
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          size="small"
                          className="w-full"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper className="p-6">
          <Button
            variant="contained"
            onClick={generateRandomData}
            startIcon={<Shuffle />}
            className="mb-4"
          >
            Generate Random Dataset
          </Button>
        </Paper>
      )}

      {error && (
        <Alert severity="error" className="mt-4">
          {error}
        </Alert>
      )}

      {/* Data Preview */}
      {useData().currentData && (
        <Card className="mt-6">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6">
                Data Preview
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={navigateToVisualization}
              >
                Visualize Data
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {useData().currentData.headers.map((header, index) => (
                      <th key={index} className="p-2 text-left border-b">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {useData().currentData.rows.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell: any, cellIndex: number) => (
                        <td key={cellIndex} className="p-2 border-b">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {useData().currentData.rows.length > 5 && (
              <Typography className="mt-4 text-gray-500">
                Showing 5 of {useData().currentData.rows.length} rows
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataInput;