import api from '../api';

interface PasswordResponse {
  success: boolean;
  message: string;
}

export const password = async (userId: number, currentPassword: string, newPassword: string): Promise<PasswordResponse> => {
  try {
    const response = await api.put('/auth/change-password', { userId, currentPassword, newPassword }); 
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Error al actualizar la contraseña');
    }
    throw new Error('Error desconocido al actualizar la contraseña');
  }
};