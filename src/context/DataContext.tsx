import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  currentData: {
    headers: string[];
    rows: any[][];
  } | null;
  setCurrentData: (data: { headers: string[]; rows: any[][] } | null) => void;
  dataSource: string;
  setDataSource: (source: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentData, setCurrentData] = useState<{ headers: string[]; rows: any[][] } | null>(null);
  const [dataSource, setDataSource] = useState<string>('');

  return (
    <DataContext.Provider
      value={{
        currentData,
        setCurrentData,
        dataSource,
        setDataSource,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;