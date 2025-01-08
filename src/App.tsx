// App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import LoginPage from './pages/Login Page';
import MainLayout from './pages/MainLayout';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [session, setSession] = useState(() => {
    const savedSession = localStorage.getItem('session');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const logout = () => {
    localStorage.removeItem('session');
    setSession(null);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={!session ? <LoginPage setSession={setSession} /> : <Navigate to="/dashboard" />} 
          />
          <Route
            path="/*"
            element={
              session ? (
                <MainLayout
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  session={session}
                  logout={logout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;