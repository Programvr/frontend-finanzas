import api from '../api';

interface ProfileResponse {
  success: boolean;
  message: string;
}

export const profile = async (userId: number, nombre: string, email: string): Promise<ProfileResponse> => {
  try {
    const response = await api.put('/auth/update-profile', { userId, nombre, email }); 
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Error al actualizar el perfil');
    }
    throw new Error('Error desconocido al actualizar el perfil');
  }
};