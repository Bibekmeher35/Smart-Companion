import React, { lazy, Suspense } from "react";
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { normalTheme, dyslexiaTheme } from './styles/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ProgressProvider } from './context/ProgressContext';

// Lazy load components
const Login = lazy(() => import('./pages/Login'));
const DashboardLayout = lazy(() => import('./pages/DashboardLayout'));

/**
 * Main Application Component.
 * Uses Context API to manage global state.
 */
function AppContent() {
  const { session, loading, login } = useAuth();

  // Derive dyslexia mode preference from user profile
  const dyslexiaMode = !!session?.userData?.profile?.dyslexiaMode;
  const theme = dyslexiaMode ? { ...dyslexiaTheme, isDyslexia: true } : { ...normalTheme, isDyslexia: false };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <Suspense fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <p>Loading...</p>
        </div>
      }>
        <Login onLogin={login} />
      </Suspense>
    );
  }


  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Suspense fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <p>Loading...</p>
        </div>
      }>
        <TaskProvider>
          <ProgressProvider>
            <DashboardLayout />
          </ProgressProvider>
        </TaskProvider>
      </Suspense>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

