import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage.jsx';
import RegisterPage from './pages/Register/RegisterPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


 
  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    // מוחק את הטוקן מהדפדפן
    localStorage.removeItem('token');
    // מעדכן את ה־state באפליקציה
    setIsAuthenticated(false);
  };
  // Handle successful authentication
  const handleAuthSuccess = (token) => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onAuthSuccess={handleAuthSuccess} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage onAuthSuccess={handleAuthSuccess} />
            )
          } 
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );

  
}

export default App;