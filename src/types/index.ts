export interface DataSet {
  id: string;
  name: string;
  data: any[];
  type: 'csv' | 'json';
  createdAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface AlgorithmStep {
  id: number;
  description: string;
  state: any;
  highlight?: number[];
}