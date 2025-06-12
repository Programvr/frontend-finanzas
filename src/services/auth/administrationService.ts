import api from '../api';

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface UserRolesData {
  id: number;
  email: string;
  activo: boolean;
  roleIds: number[];
}

export interface UpdateResponse {
  message: string;
}

export const searchEmail = async (email: string): Promise<UserRolesData> => {
  try {
    const response = await api.post('/auth/search-email', { email });
    return {
      id: response.data.id,
      email: response.data.email,
      activo: response.data.activo,
      roleIds: response.data.roleIds || []
    };
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        const errorMessage = error.response.data?.message?.toLowerCase().includes('expired') 
          ? 'La sesión ha expirado. Por favor, vuelva a iniciar sesión.'
          : 'No tiene permisos suficientes para realizar esta acción.';
        
        throw new Error(errorMessage);
      }
      
      throw new Error(
        error.response.data?.message || 
        'Error al buscar el usuario por email'
      );
    } else {
      throw new Error('Error de conexión al buscar el usuario');
    }
  }
};

export const fetchAllRoles = async (): Promise<Role[]> => {
  const response = await api.get('/rol/consult-roles');
  return response.data || [];
};

export const updateUserRoles = async (userId: number, roleIds: number[]): Promise<UpdateResponse> => {
  const response = await api.put(`/auth/change-roles/${userId}`, { roleIds });
  return {
    message: response.data.message
  };
  };

export const activateUser = async (userId: number): Promise<UpdateResponse> => {
  const response = await api.put(`/auth/activate/${userId}`);
  return {
    message: response.data.message
  };
};

export const deactivateUser = async (userId: number): Promise<UpdateResponse> => {
  const response = await api.put(`/auth/deactivate/${userId}`);
  return {
    message: response.data.message
  };
};