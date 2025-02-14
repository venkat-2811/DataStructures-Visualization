import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <AppBar position="fixed" className="bg-white dark:bg-gray-900">
      <Toolbar>
        <Typography variant="h6" component="div" className="flex-grow text-center">
          Data Structures & Algorithms Visualization Tool
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit">
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;