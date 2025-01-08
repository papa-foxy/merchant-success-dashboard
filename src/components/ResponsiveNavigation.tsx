import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Collapse,
  useMediaQuery,
  Avatar,
  Tooltip,
  Switch,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { log } from 'console';

const drawerWidth = 260;

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  '&.Mui-selected': {
    backgroundColor: 'rgba(187, 134, 252, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(187, 134, 252, 0.2)',
    },
  },
}));

const MotionListItem = motion(ListItem);

interface ResponsiveNavigationProps {
  activeItem: string;
  setActiveItem: (item: string) => void;  // Added this line
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  session: any;
  logout: () => void;
}

const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  activeItem,
  setActiveItem,
  children,
  darkMode,
  toggleDarkMode,
  session,
  logout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    if (item === 'Ticket') {
      setTicketOpen(!ticketOpen);
    } else {
      setTicketOpen(false);
    }
    if (isSmallScreen) {
      setMobileOpen(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Ticket', icon: <ConfirmationNumberIcon />, subItems: ['Daily Ticket', 'Click Up Ageing'] },
    { name: 'Troubleshooting Step', icon: <BuildIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ justifyContent: 'center', mb: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          Merchant Success
        </Typography>
      </Toolbar>
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.name}>
            <MotionListItem disablePadding whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <StyledListItemButton
                selected={activeItem === item.name}
                onClick={() => handleItemClick(item.name)}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
                {item.subItems && (ticketOpen ? <ExpandLess /> : <ExpandMore />)}
              </StyledListItemButton>
            </MotionListItem>
            {item.subItems && (
              <Collapse in={ticketOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <MotionListItem key={subItem} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <StyledListItemButton
                        sx={{ pl: 4 }}
                        selected={activeItem === subItem}
                        onClick={() => handleItemClick(subItem)}
                      >
                        <ListItemText primary={subItem} />
                      </StyledListItemButton>
                    </MotionListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © 2025 Merchant Success
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        boxShadow: 'none',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
      }}
    >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {activeItem}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="John Doe" onClick={logout}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>SZ</Avatar>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default ResponsiveNavigation;

