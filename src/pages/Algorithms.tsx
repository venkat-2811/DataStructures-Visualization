import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Card, CardContent, Button, Select, MenuItem, Slider, IconButton } from '@mui/material';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

interface AlgorithmStep {
  array: number[];
  description: string;
  highlights: number[];
}

interface SortingAlgorithm {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  getSteps: (arr: number[]) => AlgorithmStep[];
}

const ALGORITHMS: Record<string, SortingAlgorithm> = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    getSteps: (arr: number[]): AlgorithmStep[] => {
      const steps: AlgorithmStep[] = [];
      const array = [...arr];
      
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          steps.push({
            array: [...array],
            description: `Comparing elements at positions ${j} and ${j + 1}`,
            highlights: [j, j + 1]
          });
          
          if (array[j] > array[j + 1]) {
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            steps.push({
              array: [...array],
              description: `Swapped elements ${array[j]} and ${array[j + 1]}`,
              highlights: [j, j + 1]
            });
          }
        }
      }
      return steps;
    }
  },
  quick: {name: 'Quick Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    getSteps: (arr: number[]): AlgorithmStep[] => {
      const steps: AlgorithmStep[] = [];
      const array = [...arr];

      const partition = (low: number, high: number): number => {
        const pivot = array[high];
        steps.push({
          array: [...array],
          description: `Choosing pivot element: ${pivot}`,
          highlights: [high]
        });

        let i = low - 1;

        for (let j = low; j < high; j++) {
          steps.push({
            array: [...array],
            description: `Comparing element ${array[j]} with pivot ${pivot}`,
            highlights: [j, high]
          });

          if (array[j] <= pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            if (i !== j) {
              steps.push({
                array: [...array],
                description: `Swapped elements ${array[i]} and ${array[j]}`,
                highlights: [i, j]
              });
            }
          }
        }

        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        steps.push({
          array: [...array],
          description: `Placed pivot ${pivot} in its correct position`,
          highlights: [i + 1]
        });

        return i + 1;
      };

      const quickSort = (low: number, high: number): void => {
        if (low < high) {
          const pi = partition(low, high);
          quickSort(low, pi - 1);
          quickSort(pi + 1, high);
        }
      };

      quickSort(0, array.length - 1);
      return steps;
    }
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    getSteps: (arr: number[]): AlgorithmStep[] => {
      const steps: AlgorithmStep[] = [];
      const array = [...arr];

      const merge = (left: number, middle: number, right: number): void => {
        const leftArray = array.slice(left, middle + 1);
        const rightArray = array.slice(middle + 1, right + 1);
        
        steps.push({
          array: [...array],
          description: `Splitting array into two subarrays`,
          highlights: [left, middle, right]
        });

        let i = 0, j = 0, k = left;

        while (i < leftArray.length && j < rightArray.length) {
          steps.push({
            array: [...array],
            description: `Comparing elements ${leftArray[i]} and ${rightArray[j]}`,
            highlights: [left + i, middle + 1 + j]
          });

          if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
          } else {
            array[k] = rightArray[j];
            j++;
          }
          k++;

          steps.push({
            array: [...array],
            description: `Merged element into position ${k-1}`,
            highlights: [k-1]
          });
        }

        while (i < leftArray.length) {
          array[k] = leftArray[i];
          steps.push({
            array: [...array],
            description: `Adding remaining left element ${leftArray[i]}`,
            highlights: [k]
          });
          i++;
          k++;
        }

        while (j < rightArray.length) {
          array[k] = rightArray[j];
          steps.push({
            array: [...array],
            description: `Adding remaining right element ${rightArray[j]}`,
            highlights: [k]
          });
          j++;
          k++;
        }
      };

      const mergeSort = (left: number, right: number): void => {
        if (left < right) {
          const middle = Math.floor((left + right) / 2);
          mergeSort(left, middle);
          mergeSort(middle + 1, right);
          merge(left, middle, right);
        }
      };

      mergeSort(0, array.length - 1);
      return steps;
    }
  },
  insertion: {
    name: 'Insertion Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    getSteps: (arr: number[]): AlgorithmStep[] => {
      const steps: AlgorithmStep[] = [];
      const array = [...arr];
  
      for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        steps.push({
          array: [...array],
          description: `Selecting element ${key} to insert`,
          highlights: [i]
        });
  
        while (j >= 0 && array[j] > key) {
          array[j + 1] = array[j];
          steps.push({
            array: [...array],
            description: `Moving ${array[j]} to the right`,
            highlights: [j, j + 1]
          });
          j--;
        }
        
        array[j + 1] = key;
        steps.push({
          array: [...array],
          description: `Inserting ${key} at position ${j + 1}`,
          highlights: [j + 1]
        });
      }
      return steps;
    }
  },
  selection: {
    name: 'Selection Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    getSteps: (arr: number[]): AlgorithmStep[] => {
      const steps: AlgorithmStep[] = [];
      const array = [...arr];
  
      for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        
        steps.push({
          array: [...array],
          description: `Finding minimum element from position ${i}`,
          highlights: [i]
        });
  
        for (let j = i + 1; j < array.length; j++) {
          steps.push({
            array: [...array],
            description: `Comparing ${array[j]} with current minimum ${array[minIdx]}`,
            highlights: [j, minIdx]
          });
  
          if (array[j] < array[minIdx]) {
            minIdx = j;
          }
        }
  
        if (minIdx !== i) {
          [array[i], array[minIdx]] = [array[minIdx], array[i]];
          steps.push({
            array: [...array],
            description: `Swapping ${array[i]} with ${array[minIdx]}`,
            highlights: [i, minIdx]
          });
        }
      }
      return steps;
    }
  },
  
  heap: {
    name: 'Heap Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    getSteps: (arr: number[]): AlgorithmStep[] => {
      const steps: AlgorithmStep[] = [];
      const array = [...arr];
  
      const heapify = (n: number, i: number) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
  
        steps.push({
          array: [...array],
          description: `Heapifying at index ${i}`,
          highlights: [i]
        });
  
        if (left < n && array[left] > array[largest]) {
          largest = left;
        }
  
        if (right < n && array[right] > array[largest]) {
          largest = right;
        }
  
        if (largest !== i) {
          [array[i], array[largest]] = [array[largest], array[i]];
          steps.push({
            array: [...array],
            description: `Swapped ${array[i]} with ${array[largest]}`,
            highlights: [i, largest]
          });
          heapify(n, largest);
        }
      };
  
      for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        heapify(array.length, i);
      }
  
      for (let i = array.length - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        steps.push({
          array: [...array],
          description: `Moved largest element ${array[i]} to end`,
          highlights: [0, i]
        });
        heapify(i, 0);
      }
  
      return steps;
    }
  },
  
  // Searching Algorithms
  linearSearch: {
    name: 'Linear Search',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    getSteps: (arr: number[]): AlgorithmStep[] => {
      const steps: AlgorithmStep[] = [];
      const array = [...arr];
      const target = Math.floor(Math.random() * 100) + 1; // Random target to search
  
      for (let i = 0; i < array.length; i++) {
        steps.push({
          array: [...array],
          description: `Checking if ${array[i]} equals ${target}`,
          highlights: [i]
        });
  
        if (array[i] === target) {
          steps.push({
            array: [...array],
            description: `Found ${target} at position ${i}!`,
            highlights: [i]
          });
          break;
        }
      }
      return steps;
    }
  },
  
  binarySearch: {
    name: 'Binary Search',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    getSteps: (arr: number[]): AlgorithmStep[] => {
      const steps: AlgorithmStep[] = [];
      const array = [...arr].sort((a, b) => a - b); // Binary search requires sorted array
      const target = array[Math.floor(Math.random() * array.length)]; // Pick a random existing value
  
      let left = 0;
      let right = array.length - 1;
  
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
          array: [...array],
          description: `Checking middle element ${array[mid]}`,
          highlights: [mid]
        });
  
        if (array[mid] === target) {
          steps.push({
            array: [...array],
            description: `Found ${target} at position ${mid}!`,
            highlights: [mid]
          });
          break;
        }
  
        if (array[mid] < target) {
          left = mid + 1;
          steps.push({
            array: [...array],
            description: `${target} is larger, searching right half`,
            highlights: [left, right]
          });
        } else {
          right = mid - 1;
          steps.push({
            array: [...array],
            description: `${target} is smaller, searching left half`,
            highlights: [left, right]
          });
        }
      }
      return steps;
    }
  }  
};


const Algorithms: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [algorithm, setAlgorithm] = useState<string>('bubble');
  const [arraySize, setArraySize] = useState<number>(10);
  const [speed, setSpeed] = useState<number>(500);

  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps, speed]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setSteps([{ array: newArray, description: 'Initial array', highlights: [] }]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const startVisualization = () => {
    const newSteps = ALGORITHMS[algorithm].getSteps([...array]);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="space-y-6">
      <Typography variant="h4" component="h1" className="mb-6">
        Algorithm Visualization
      </Typography>

      <Paper className="p-6">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Controls
                </Typography>
                <div className="space-y-4">
                  <div>
                    <Typography gutterBottom>Algorithm</Typography>
                    <Select
                      fullWidth
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value as string)}
                    >
                      {Object.entries(ALGORITHMS).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Typography gutterBottom>Array Size</Typography>
                    <Slider
                      value={arraySize}
                      onChange={(_, value) => setArraySize(value as number)}
                      min={5}
                      max={30}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </div>

                  <div>
                    <Typography gutterBottom>Speed (ms)</Typography>
                    <Slider
                      value={speed}
                      onChange={(_, value) => setSpeed(value as number)}
                      min={100}
                      max={1000}
                      step={100}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="contained"
                      onClick={generateRandomArray}
                      fullWidth
                    >
                      Generate Array
                    </Button>
                    <Button
                      variant="contained"
                      onClick={startVisualization}
                      fullWidth
                      disabled={isPlaying}
                    >
                      Start
                    </Button>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <IconButton onClick={reset}>
                      <RotateCcw />
                    </IconButton>
                    <IconButton onClick={togglePlay}>
                      {isPlaying ? <Pause /> : <Play />}
                    </IconButton>
                    <IconButton onClick={stepForward}>
                      <ChevronRight />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Visualization
                </Typography>
                <div className="h-64 relative">
                  {steps[currentStep]?.array.map((value, index) => (
                    <div
                      key={index}
                      className="absolute bottom-0 transition-all duration-300"
                      style={{
                        left: `${(index / steps[currentStep].array.length) * 100}%`,
                        height: `${(value / 100) * 100}%`,
                        width: `${80 / steps[currentStep].array.length}%`,
                        backgroundColor: steps[currentStep].highlights.includes(index)
                          ? '#ef4444'
                          : '#3b82f6',
                      }}
                    />
                  ))}
                </div>
                <Typography className="mt-4 text-center">
                  {steps[currentStep]?.description}
                </Typography>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent>
                <Typography variant="h6" className="mb-2">
                  Algorithm Details
                </Typography>
                <Typography>
                  <strong>Time Complexity:</strong> {ALGORITHMS[algorithm].timeComplexity}
                </Typography>
                <Typography>
                  <strong>Space Complexity:</strong> {ALGORITHMS[algorithm].spaceComplexity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Algorithms;