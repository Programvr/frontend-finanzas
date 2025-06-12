import { createContext, useContext, ReactNode, useState } from 'react';
import { password } from '../../services/auth/passwordService';

interface PasswordContextType {
  message: string | null;
  password: (userId: number, currentPassword: string, newPassword: string) => Promise<void>;
  clearMessage: () => void;
}

const PasswordContext = createContext<PasswordContextType | null>(null);

export const PasswordProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
 

  const handlePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    try {
      const { message } = await password(userId, currentPassword, newPassword);
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
    password: handlePassword, 
    clearMessage,
  };

  return <PasswordContext.Provider value={value}>{children}</PasswordContext.Provider>;
};

export const usePassword = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePassword must be used within a PasswordProvider');
  }
  return context;
};