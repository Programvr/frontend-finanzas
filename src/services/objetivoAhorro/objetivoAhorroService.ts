import axios, { AxiosError } from 'axios';
import api from '../api';

// Interfaces
export interface Cuenta {
  id: number;
  nombre: string;
  tipo: string;
  saldoInicial: number;
  saldoActual: number;
  moneda: string;
  activa: boolean;
}

export interface ObjetivoAhorro {
  id?: number;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
  fechaObjetivo: string;
  completado: boolean;
  cuenta: number;
}

export interface ObjetivoAhorroResponse {
  content: ObjetivoAhorro[];
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

// Interfaces para el simulador
export interface SimuladorRequest {
  montoObjetivo: number;
  montoActual: number;
  fechaObjetivo: string;
  cuotaMensual?: number;
}

export interface SimuladorResponse {
  montoObjetivo: number;
  montoActual: number;
  fechaObjetivo: string;
  cuotaMensual?: number;
  cuotaMensualCalculada?: number;
  tiempoRestanteMeses?: number;
  esPosible?: boolean;
  mensaje?: string;
  fechaEstimada?: string;
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

// Servicios de Objetivos de Ahorro
export const ObjetivoAhorroService = {
  async listar(page: number = 0, size: number = 10): Promise<ObjetivoAhorroResponse> {
    try {
      const response = await api.get<ObjetivoAhorroResponse>(`/objetivoAhorro/listar?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async registrar(data: Omit<ObjetivoAhorro, 'id'>): Promise<ApiResponse<ObjetivoAhorro>> {
    try {
      const response = await api.post<ApiResponse<ObjetivoAhorro>>('/objetivoAhorro/registrar', data);
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async actualizar(id: number, data: Partial<ObjetivoAhorro>): Promise<ApiResponse<ObjetivoAhorro>> {
    try {
      const response = await api.put<ApiResponse<ObjetivoAhorro>>(`/objetivoAhorro/actualizar/${id}`, data);
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
      await api.delete(`/objetivoAhorro/eliminar/${id}`);
      return {
        success: true,
        message: 'Objetivo de ahorro eliminada exitosamente'
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async simulador(data: SimuladorRequest): Promise<ApiResponse<SimuladorResponse>> {
    try {
      // Validar que al menos 3 de los 4 campos estén presentes
      const camposPresentes = Object.keys(data).filter(key => 
        data[key as keyof SimuladorRequest] !== undefined && 
        data[key as keyof SimuladorRequest] !== null && 
        data[key as keyof SimuladorRequest] !== 0
      ).length;

      if (camposPresentes < 3) {
        throw new Error('Se requieren al menos 3 de los 4 campos para realizar la simulación');
      }

      const response = await api.post<ApiResponse<SimuladorResponse>>('/objetivoAhorro/simulador', data);
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Servicios de Cuentas
export const CuentaService = {
  async listar(): Promise<Cuenta[]> {
    try {
      const response = await api.get<Cuenta[]>('/cuenta/consulta');
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