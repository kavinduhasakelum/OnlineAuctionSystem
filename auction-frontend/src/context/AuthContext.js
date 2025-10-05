import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = \Bearer \\;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('https://localhost:7001/api/auth/profile');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('https://localhost:7001/api/auth/login', {
      email,
      password
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = \Bearer \\;
    setUser(user);
  };

  const register = async (username, email, password) => {
    const response = await axios.post('https://localhost:7001/api/auth/register', {
      username,
      email,
      password
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = \Bearer \\;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
