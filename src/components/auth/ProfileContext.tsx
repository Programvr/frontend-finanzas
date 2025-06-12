import { createContext, useContext, ReactNode, useState } from 'react';
import { profile } from '../../services/auth/profileService';

interface ProfileContextType {
  message: string | null;
  profile: (userId: number, nombre: string, email: string) => Promise<void>;
  clearMessage: () => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
 

  const handleProfile = async (userId: number, nombre: string, email: string) => {
    try {
      const { message } = await profile(userId, nombre, email);
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
    profile: handleProfile, 
    clearMessage,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};