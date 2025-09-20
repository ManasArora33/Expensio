import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication status...');
      const response = await api.get('/auth/me');
      console.log('Auth check response:', response.data);
      
      if (response.data.success) {
        console.log('User is authenticated, updating state...');
        // Use functional updates to ensure we have the latest state
        setUser(prevUser => {
          console.log('Setting user:', response.data.user);
          return response.data.user;
        });
        setIsAuthenticated(true);
        return true;
      }
      // If success is false, treat as not authenticated
      console.log('Authentication check failed - success is false');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      // If we get a 401, it means the session is invalid
      if (error.response?.status === 401) {
        console.log('Received 401, setting isAuthenticated to false');
        setUser(null);
        setIsAuthenticated(false);
      } else {
        console.error('Unexpected error during auth check:', error);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to clear the httpOnly cookie
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Reset auth state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    console.log('AuthProvider mounted, checking auth status...');
    // checkAuth();
    
    // Cleanup function
    return () => {
      console.log('AuthProvider unmounting...');
    };
  }, []);

  // Debug effect to log authentication state changes
  useEffect(() => {
    console.log('Auth state updated - isAuthenticated:', isAuthenticated, 'User:', user);
  }, [isAuthenticated, user]);

  const value = {
    user,
    isAuthenticated,
    loading,
    setUser,
    setIsAuthenticated,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
