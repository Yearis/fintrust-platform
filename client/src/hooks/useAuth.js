import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      const userData = authService.getCurrentUser();
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('[useAuth] Calling authService.login...');
      const response = await authService.login(credentials);
      console.log('[useAuth] Server response received:', response);

      if (response.success) {
        console.log('[useAuth] Login successful, setting user state.');
        const { token, ...userData } = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        return response;
      } else {
        console.log('[useAuth] Login failed according to server, throwing error:', response.message);
        throw new Error(response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('[useAuth] An error was caught during login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    // This function can be updated with similar logging if needed
    const response = await authService.register(userData);
    if (response.success) {
      const { token, ...user } = response.data;
      setUser(user);
      setIsAuthenticated(true);
      return response;
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = { user, isAuthenticated, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};