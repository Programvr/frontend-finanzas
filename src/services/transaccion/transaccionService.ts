import axios, { AxiosError } from 'axios';
import api from '../api';

// Interfaces
export interface Categoria {
  id: number;
  nombre: string;
  tipo: 'I' | 'G';
  icono?: string;
  color?: string;
}

export interface Transaccion {
  id?: number;
  categoria: number;
  tipo: 'I' | 'G';
  monto: number;
  fecha: string;
  descripcion: string;
  nota?: string; // Hacer opcional aquí
  recurrente: boolean;
}

export interface TransaccionResponse {
  content: Transaccion[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort?: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Tipo para los errores de la API
interface ApiErrorResponse {
  message?: string;
  // Otras propiedades que pueda devolver tu API en los errores
  // timestamp?: string;
  // status?: number;
  // error?: string;
  // path?: string;
}

// Servicios de Transacciones
export const TransaccionService = {
  async listar(page: number = 0, size: number = 10): Promise<TransaccionResponse> {
    try {
      const response = await api.get<TransaccionResponse>(`/transaccion/listar?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async registrar(data: Omit<Transaccion, 'id'>): Promise<ApiResponse<Transaccion>> {
    try {
      const response = await api.post<ApiResponse<Transaccion>>('/transaccion/registrar', data);
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async actualizar(id: number, data: Partial<Transaccion>): Promise<ApiResponse<Transaccion>> {
    try {
      const response = await api.put<ApiResponse<Transaccion>>(`/transaccion/actualizar/${id}`, data);
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async eliminar(id: number): Promise<ApiResponse> {
    try {
      await api.delete(`/transaccion/eliminar/${id}`);
      return {
        success: true,
        message: 'Transacción eliminada exitosamente'
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Servicios de Categorías
export const CategoriaService = {
  async listar(): Promise<Categoria[]> {
    try {
      const response = await api.get<Categoria[]>('/categoria/consult-categorias');
      return response.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  
};

// Manejo centralizado de errores
function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    if (axiosError.response) {
      // Error con respuesta del servidor
      if (axiosError.response.status === 401) {
        const isTokenExpired = axiosError.response.data?.message?.toLowerCase().includes('expired');
        return new Error(
          isTokenExpired 
            ? 'La sesión ha expirado. Por favor, vuelva a iniciar sesión.'
            : 'No tiene permisos suficientes para realizar esta acción.'
        );
      }

      
      return new Error(
        axiosError.response.data?.message || 
        `Error en la solicitud: ${axiosError.response.statusText}`
      );
    } else if (axiosError.request) {
      // Error sin respuesta del servidor
      return new Error('No se recibió respuesta del servidor');
    }
  }

  // Error no relacionado con Axios
  return error instanceof Error 
    ? error 
    : new Error('Error desconocido al realizar la operación');
}