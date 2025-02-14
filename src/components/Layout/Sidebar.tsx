import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Home,
  Database,
  BarChart,
  Binary,
  Network,
  Palette,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: <Home size={24} />, label: 'Home' },
  { path: '/data-input', icon: <Database size={24} />, label: 'Data Input' },
  { path: '/visualizations', icon: <BarChart size={24} />, label: 'Visualizations' },
  { path: '/algorithms', icon: <Binary size={24} />, label: 'Algorithms' },
  { path: '/data-structures', icon: <Network size={24} />, label: 'Data Structures' },
  { path: '/customization', icon: <Palette size={24} />, label: 'Customization' },
  { path: '/export', icon: <Download size={24} />, label: 'Export' },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={`transition-all duration-300 ${open ? 'w-64' : 'w-20'}`}
      sx={{
        width: open ? 240 : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 72,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
        },
      }}
    >
      <div className="flex justify-end p-2">
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </IconButton>
      </div>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={NavLink}
            to={item.path}
            className="hover:bg-gray-100"
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {open && <ListItemText primary={item.label} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;