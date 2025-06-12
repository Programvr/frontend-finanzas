import { createContext, useContext, ReactNode, useState } from 'react';
import { searchEmail, updateUserRoles, activateUser, deactivateUser, fetchAllRoles, UserRolesData, Role } from '../../services/auth/administrationService';

interface AdministrationContextType {
  userData: UserRolesData | null;
  allRoles: Role[];
  messageUpdate: string | null;
  loading: boolean;
  error: string | null;
  searchUserByEmail: (email: string) => Promise<void>;
  updateUserRoles: (roles: number[]) => Promise<void>;
  activateUser: (userId: number) => Promise<void>;
  deactivateUser: (userId: number) => Promise<void>;
  clearError: () => void;
}

const AdministrationContext = createContext<AdministrationContextType | null>(null);

export const AdministrationProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserRolesData | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [messageUpdate, setMessageUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUserByEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await searchEmail(email);
      setUserData(user);
      
      
      const roles = await fetchAllRoles();
      setAllRoles(roles);
    } catch (err) {
      console.error('Error al buscar usuario:', err);
      setError(err instanceof Error ? err.message : 'Error al buscar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRoles = async (roles: number[]) => {
    if (!userData?.id) return;
    
    setLoading(true);
    try {
      const message = await updateUserRoles(userData.id, roles);
      setMessageUpdate(message.message);
      setUserData(prev => prev ? { ...prev, roleIds: roles } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar roles');
    } finally {
      setLoading(false);
    }
  };

  const  handleActivateUser = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await activateUser(userId);
      setMessageUpdate(messageUpdate || 'Usuario activado correctamente');
      if (userData && userData.id === userId) {
        setUserData({ ...userData, activo: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handledeactivateUser = async (userId: number) => {
    if (!userData?.id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await deactivateUser(userData.id);
      setMessageUpdate(messageUpdate || 'Usuario desactivado correctamente');
      // Actualizar el estado del usuario si ya está cargado
      if (userData && userData.id === userId) {
        setUserData({ ...userData, activo: false });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desactivar usuario');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AdministrationContext.Provider
      value={{
        userData,
        allRoles,
        messageUpdate,
        loading,
        error,
        searchUserByEmail,
        updateUserRoles: handleUpdateUserRoles,
        activateUser: handleActivateUser,
        deactivateUser: handledeactivateUser,
        clearError
      }}
    >
      {children}
    </AdministrationContext.Provider>
  );
};

export const useAdministration = () => {
  const context = useContext(AdministrationContext);
  if (!context) {
    throw new Error('useAdministration must be used within an AdministrationProvider');
  }
  return context;
};