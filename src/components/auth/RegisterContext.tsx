import { createContext, useContext, ReactNode, useState } from 'react';
import { register } from '../../services/auth/registerService';

interface RegisterContextType {
  message: string | null;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  clearMessage: () => void;
}

const RegisterContext = createContext<RegisterContextType | null>(null);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
 

  const handleRegister = async (nombre: string, email: string, password: string) => {
    try {
      const { message } = await register(nombre, email, password);
      localStorage.setItem('message', message);
      setMessage(message);
    } catch (error) {
      throw error;
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const value = {
    message,
    register: handleRegister, 
    clearMessage,
  };

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }
  return context;
};