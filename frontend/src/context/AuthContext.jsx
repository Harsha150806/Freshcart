import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on app start
  useEffect(() => {
    const stored = localStorage.getItem("freshcart_user");
    const token = localStorage.getItem("freshcart_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const data = res.data;
    localStorage.setItem("freshcart_token", data.token);
    localStorage.setItem("freshcart_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const signup = async (name, email, phone, password) => {
    const res = await authAPI.signup({ name, email, phone, password });
    const data = res.data;
    localStorage.setItem("freshcart_token", data.token);
    localStorage.setItem("freshcart_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("freshcart_token");
    localStorage.removeItem("freshcart_user");
    setUser(null);
  };

  const updateUser = (data) => {
    localStorage.setItem("freshcart_user", JSON.stringify(data));
    localStorage.setItem("freshcart_token", data.token);
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
