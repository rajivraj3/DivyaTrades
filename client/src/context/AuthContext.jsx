import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('divyatrades_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('divyatrades_token') || '');

  useEffect(() => {
    if (user) {
      localStorage.setItem('divyatrades_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('divyatrades_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('divyatrades_token', token);
    } else {
      localStorage.removeItem('divyatrades_token');
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    let cancelled = false;
    api.get('/auth/me')
      .then((response) => {
        if (!cancelled) setUser(response.data.user);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setToken('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    setUser(response.data.user);
    setToken(response.data.token);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    setUser(response.data.user);
    setToken(response.data.token);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  const updateUser = (updater) => {
    setUser((previousUser) => {
      const nextUser = typeof updater === 'function' ? updater(previousUser) : updater;
      if (nextUser) {
        localStorage.setItem('divyatrades_user', JSON.stringify(nextUser));
      }
      return nextUser;
    });
  };

  const value = useMemo(() => ({ user, token, login, register, logout, updateUser }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
