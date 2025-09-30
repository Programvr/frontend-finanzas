import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { ObjetivoAhorroService, CuentaService, Cuenta, ObjetivoAhorro, ObjetivoAhorroResponse, ApiResponse } from '../../services/objetivoAhorro/objetivoAhorroService';
import { set } from 'react-hook-form';


interface Pagination {
  page: number;
  size: number;
  total: number;
}

interface ObjetivoAhorroContextType {
  objetivoAhorros: ObjetivoAhorro[];
  cuentas: Cuenta[];
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  pagination: Pagination;
  fetchObjetivoAhorros: (page?: number, size?: number) => Promise<void>;
  fetchCuentas: () => Promise<void>;
  createObjetivoAhorro: (data: Omit<ObjetivoAhorro, 'id'>) => Promise<boolean>;
  updateObjetivoAhorro: (id: number, data: Partial<ObjetivoAhorro>) => Promise<boolean>;
  deleteObjetivoAhorro: (id: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearMessage: () => void;
}

const ObjetivoAhorroContext = createContext<ObjetivoAhorroContextType | null>(null);

export const ObjetivoAhorroProvider = ({ children }: { children: ReactNode }) => {
  const [objetivoAhorros, setObjetivoAhorros] = useState<ObjetivoAhorro[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 10,
    total: 0
  });

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(false), []);
  const clearMessage = useCallback(() => setMessage(null), []);

  const fetchObjetivoAhorros = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    clearError();
    try {
      const response = await ObjetivoAhorroService.listar(page, size);
      setObjetivoAhorros(response.content);
      setPagination({
        page: response.pageable.pageNumber,
        size: response.pageable.pageSize,
        total: response.totalElements
      });
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al cargar Objetivos de ahorro');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCuentas = useCallback(async () => {
      setLoading(true);
      clearError();
      try {
        const response = await CuentaService.listar();
        setSuccess(true);
        setCuentas(response);
      } catch (err) {
        setSuccess(false);
        setError(err instanceof Error ? err.message : 'Error al cargar cuentas');
      } finally {
        setLoading(false);
      }
    }, []);

  const handleCreateObjetivoAhorro = useCallback(async (data: Omit<ObjetivoAhorro, 'id'>) => {
    setLoading(true);
    clearError();
    try {
      const result = await ObjetivoAhorroService.registrar(data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchObjetivoAhorros(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      console.error('Error al crear Objetivo de ahorro:', err);
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchObjetivoAhorros, pagination.page, pagination.size]);

  const handleUpdateObjetivoAhorro = useCallback(async (id: number, data: Partial<ObjetivoAhorro>) => {
    setLoading(true);
    clearError();
    try {
      const result = await ObjetivoAhorroService.actualizar(id, data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchObjetivoAhorros(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      console.error('Error al actualizar Objetivo de ahorro 400:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchObjetivoAhorros, pagination.page, pagination.size]);

  const handleDeleteObjetivoAhorro = useCallback(async (id: number) => {
    setLoading(true);
    clearError();
    try {
      const result = await ObjetivoAhorroService.eliminar(id);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchObjetivoAhorros(pagination.page, pagination.size);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al eliminar Objetivo de Ahorro');
    } finally {
      setLoading(false);
    }
  }, [fetchObjetivoAhorros, pagination.page, pagination.size]);

  // Cargar cuentas al iniciar
    useEffect(() => {
      fetchCuentas();
    }, [fetchCuentas]);

  const contextValue = {
    objetivoAhorros,
    cuentas,
    loading,
    error,
    success,
    message,
    pagination,
    fetchObjetivoAhorros,
    fetchCuentas,
    createObjetivoAhorro: handleCreateObjetivoAhorro,
    updateObjetivoAhorro: handleUpdateObjetivoAhorro,
    deleteObjetivoAhorro: handleDeleteObjetivoAhorro,
    clearError,
    clearSuccess,
    clearMessage
  };

  return (
    <ObjetivoAhorroContext.Provider value={contextValue}>
      {children}
    </ObjetivoAhorroContext.Provider>
  );
};

export const useObjetivoAhorros = () => {
  const context = useContext(ObjetivoAhorroContext);
  if (!context) {
    throw new Error('useObjetivoAhorros debe usarse dentro de TransferenciaProvider');
  }
  return context;
};