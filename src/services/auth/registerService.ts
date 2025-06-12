import api from '../api';

interface RegisterResponse {
  success: boolean;
  message: string;
}

export const register = async (nombre: string, email: string, password: string): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/register', { nombre, email, password }); // Usa la instancia de `api`
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Error al registrarse');
    }
    throw new Error('Error desconocido al registrarse');
  }
};