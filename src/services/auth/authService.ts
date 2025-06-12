import api from '../api';

interface LoginResponse {
  token: string;
  nombre: string;
  email: string;
  idUsuario: number;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password }); // Usa la instancia de `api`
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Error al iniciar sesión');
    }
    throw new Error('Error desconocido al iniciar sesión');
  }
};