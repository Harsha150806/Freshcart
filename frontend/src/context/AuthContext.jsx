import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('freshcart_user');
    const token = localStorage.getItem('freshcart_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('freshcart_token', data.token);
    localStorage.setItem('freshcart_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('freshcart_token', data.token);
    localStorage.setItem('freshcart_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('freshcart_token');
    localStorage.removeItem('freshcart_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('freshcart_user', JSON.stringify(updatedUser));
    localStorage.setItem('freshcart_token', updatedUser.token);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
