import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../configs/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user data
          const { data } = await api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        } catch (error) {
          console.error("Token invalid or expired");
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  // Register function
  const register = async (name, email, password) => {
    console.log("AuthContext: Calling API /api/auth/register", { name, email });
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      console.log("AuthContext: Registration success", data);
      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } catch (error) {
      console.error("AuthContext: Registration failed", error.response?.data || error.message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);