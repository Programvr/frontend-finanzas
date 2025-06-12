import { createContext, useContext, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth/authService';

interface AuthContextType {
  token: string | null;
  nombre: string | null;
  email: string | null;
  idUsuario: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [nombre, setNombre] = useState<string | null>(localStorage.getItem('nombre'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));
  const [idUsuario, setIdUsuario] = useState<number | null>(() => {
  const storedId = localStorage.getItem('idUsuario');
  return storedId ? parseInt(storedId, 10) : null;
  });
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const { token, nombre, email: emailuser, idUsuario } = await login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('email', emailuser);
      localStorage.setItem('idUsuario', String(idUsuario));
      setToken(token);
      setToken(nombre);
      setToken(emailuser);
      setIdUsuario(idUsuario);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    localStorage.removeItem('idUsuario');
    setToken(null);
    setNombre(null);
    setEmail(null);
    setIdUsuario(null);
    navigate('/login');
  };

  const value = {
    token,
    nombre,
    email,
    idUsuario,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};