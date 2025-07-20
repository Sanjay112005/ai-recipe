import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token) {
      // Verify token and get user data
      if (userData && userData !== 'undefined') {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowAuth(false);
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleShowLogin = () => {
    setShowAuth(true);
  };

  const handleBackToHome = () => {
    setShowAuth(false);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {user ? (
        // When user is logged in, show only the Dashboard (no navbar/footer)
        <Dashboard user={user} onLogout={handleLogout} />
      ) : showAuth ? (
        // When showing auth page, show only the auth form (no navbar/footer)
        <AuthPage onLogin={handleLogin} onBack={handleBackToHome} />
      ) : (
        // When not logged in and not showing auth, show the homepage with navbar/footer
        <HomePage onGetStarted={handleGetStarted} onLogin={handleShowLogin} />
      )}
    </div>
  );
}

export default App;