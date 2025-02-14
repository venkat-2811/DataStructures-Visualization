import React, { useState } from 'react';
import { Typography, Paper, Grid, Card, CardContent, Button, Select, MenuItem, TextField } from '@mui/material';
import { Download, FileJson, FileSpreadsheet, FileImage, Share2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { saveAs } from 'file-saver';
import type { VisualizationRefs } from './Visualizations';

interface ExportOptions {
  fileName: string;
  format: string;
  includeMetadata: boolean;
  imageFormat?: 'png' | 'jpeg';
}

interface ExportProps {
  visualizationRefs?: React.RefObject<VisualizationRefs>;
}

const Export: React.FC<ExportProps> = ({ visualizationRefs }) => {
  const { currentData } = useData();
  const [options, setOptions] = useState<ExportOptions>({
    fileName: 'data-export',
    format: 'json',
    includeMetadata: true,
    imageFormat: 'png'
  });

  const handleExport = () => {
    if (!currentData) return;

    const metadata = {
      exportDate: new Date().toISOString(),
      rowCount: currentData.rows.length,
      columnCount: currentData.headers.length
    };

    switch (options.format) {
      case 'json':
        const jsonData = currentData.rows.map(row => {
          const obj: Record<string, any> = {};
          currentData.headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

        const jsonExport = options.includeMetadata 
          ? { metadata, data: jsonData }
          : jsonData;

        const jsonBlob = new Blob([JSON.stringify(jsonExport, null, 2)], 
          { type: 'application/json;charset=utf-8' });
        saveAs(jsonBlob, `${options.fileName}.json`);
        break;

      case 'csv':
        const csvRows = [
          currentData.headers.join(','),
          ...currentData.rows.map(row => row.join(','))
        ];
        
        if (options.includeMetadata) {
          csvRows.unshift(
            '# Export Metadata',
            `# Date: ${metadata.exportDate}`,
            `# Rows: ${metadata.rowCount}`,
            `# Columns: ${metadata.columnCount}`,
            ''
          );
        }

        const csvBlob = new Blob([csvRows.join('\n')], 
          { type: 'text/csv;charset=utf-8' });
        saveAs(csvBlob, `${options.fileName}.csv`);
        break;

        case 'image':
          if (!visualizationRefs?.current) {
            console.error('Visualization refs not available');
            return;
          }
        
          console.log('Refs available:', !!visualizationRefs?.current);
          const base64Image = visualizationRefs.current.getChartImage(options.imageFormat || 'png');
          console.log('Image data received:', !!base64Image);
        
          if (!base64Image) {
            console.error('Could not generate chart image');
            return;
          }
        
          // Convert base64 to blob
          const byteString = atob(base64Image.split(',')[1]);
          const mimeString = options.imageFormat === 'png' ? 'image/png' : 'image/jpeg';
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const imageBlob = new Blob([ab], { type: mimeString });
          saveAs(imageBlob, `${options.fileName}.${options.imageFormat}`);
          break;
    }
  };

  const shareData = async () => {
    if (!currentData) return;

    try {
      if (!navigator.share) return;
      await navigator.share({
        title: options.fileName,
        text: 'Exported data from DSA Visualization Tool',
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Typography variant="h4" component="h1" className="mb-6">
        Export Options
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Export Settings
            </Typography>
            
            <div className="space-y-4">
              <TextField
                fullWidth
                label="File Name"
                value={options.fileName}
                onChange={(e) => setOptions({ ...options, fileName: e.target.value })}
              />

              <Select
                fullWidth
                value={options.format}
                onChange={(e) => setOptions({ ...options, format: e.target.value })}
                label="Format"
              >
                <MenuItem value="json">
                  <div className="flex items-center">
                    <FileJson className="mr-2" size={20} />
                    JSON
                  </div>
                </MenuItem>
                <MenuItem value="csv">
                  <div className="flex items-center">
                    <FileSpreadsheet className="mr-2" size={20} />
                    CSV
                  </div>
                </MenuItem>
                <MenuItem value="image">
                  <div className="flex items-center">
                    <FileImage className="mr-2" size={20} />
                    Chart Image
                  </div>
                </MenuItem>
              </Select>

              {options.format === 'image' && (
                <Select
                  fullWidth
                  value={options.imageFormat}
                  onChange={(e) => setOptions({ ...options, imageFormat: e.target.value as 'png' | 'jpeg' })}
                  label="Image Format"
                >
                  <MenuItem value="png">PNG</MenuItem>
                  <MenuItem value="jpeg">JPEG</MenuItem>
                </Select>
              )}

              {(options.format === 'json' || options.format === 'csv') && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.includeMetadata}
                    onChange={(e) => setOptions({ ...options, includeMetadata: e.target.checked })}
                    id="metadata"
                  />
                  <label htmlFor="metadata">Include Metadata</label>
                </div>
              )}
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Actions
            </Typography>

            <div className="space-y-4">
              <Button
                variant="contained"
                fullWidth
                startIcon={<Download />}
                onClick={handleExport}
                disabled={!currentData || (options.format === 'image' && !visualizationRefs?.current)}
              >
                Export {options.format === 'image' ? 'Chart' : 'Data'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Share2 />}
                onClick={shareData}
                disabled={!currentData || !navigator.share}
              >
                Share
              </Button>
            </div>

            {!currentData && (
              <Typography color="error" className="mt-4">
                Please input or upload data first
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-2">
                Export Preview
              </Typography>
              {currentData ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {currentData.headers.map((header, index) => (
                          <th key={index} className="p-2 text-left border-b">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.rows.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="p-2 border-b">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Typography color="textSecondary">
                  No data available for preview
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Export;