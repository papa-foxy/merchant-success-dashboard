// layouts/MainLayout.tsx
import React from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ResponsiveNavigation from '../components/ResponsiveNavigation';
import MSDashboard from '../pages/Dashboard';
import DailyTicket from '../pages/Daily Ticket';
import TroubleshootingStep from '../pages/Troubleshooting Step';
import Settings from '../pages/Settings';

interface MainLayoutProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  session: any;
  logout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  darkMode,
  toggleDarkMode,
  session,
  logout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveItemFromPath = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/daily-ticket':
        return 'Daily Ticket';
      case '/click-up-ageing':
        return 'Click Up Ageing';
      case '/troubleshooting':
        return 'Troubleshooting Step';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const handleNavigation = (item: string) => {
    switch (item) {
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Daily Ticket':
        navigate('/daily-ticket');
        break;
      case 'Click Up Ageing':
        navigate('/click-up-ageing');
        break;
      case 'Troubleshooting Step':
        navigate('/troubleshooting');
        break;
      case 'Settings':
        navigate('/settings');
        break;
    }
  };

  const routeContent = (
    <Routes>
      <Route path="/dashboard" element={<MSDashboard session={session} logout={logout} />} />
      <Route path="/daily-ticket" element={<DailyTicket />} />
      <Route path="/troubleshooting" element={<TroubleshootingStep  session={session}/>} />
      <Route path="/settings" element={<Settings session={session} />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );

  // In MainLayout.tsx
  return (
    <ResponsiveNavigation
      activeItem={getActiveItemFromPath(location.pathname)}
      setActiveItem={handleNavigation}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      session={session}
      logout={logout}
    >
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default'
        }}
      >
        {routeContent}
      </Box>
    </ResponsiveNavigation>
  );
};

export default MainLayout;