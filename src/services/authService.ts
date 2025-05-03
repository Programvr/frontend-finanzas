import api from './api';

interface AuthResponse {
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Error al iniciar sesión');
    }
    throw new Error('Error desconocido al iniciar sesión');
  }
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data || 'Error al registrarse');
    }
    throw new Error('Error desconocido al registrarse');
  }
};
