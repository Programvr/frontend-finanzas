import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { CuentaService, Cuenta, CuentaResponse, ApiResponse } from '../../services/cuenta/cuentaService';
import { set } from 'react-hook-form';


interface Pagination {
  page: number;
  size: number;
  total: number;
}

interface CuentaContextType {
  cuentas: Cuenta[];
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  pagination: Pagination;
  fetchCuentas: (page?: number, size?: number) => Promise<void>;
  createCuenta: (data: Omit<Cuenta, 'id'>) => Promise<boolean>;
  updateCuenta: (id: number, data: Partial<Cuenta>) => Promise<boolean>;
  deleteCuenta: (id: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearMessage: () => void;
}

const CuentaContext = createContext<CuentaContextType | null>(null);

export const CuentaProvider = ({ children }: { children: ReactNode }) => {
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

  const fetchCuentas = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    clearError();
    try {
      const response = await CuentaService.listar(page, size);
      setCuentas(response.content);
      setPagination({
        page: response.pageable.pageNumber,
        size: response.pageable.pageSize,
        total: response.totalElements
      });
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al cargar cuentas');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCuenta = useCallback(async (data: Omit<Cuenta, 'id'>) => {
    setLoading(true);
    clearError();
    try {
      const result = await CuentaService.registrar(data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchCuentas(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      console.error('Error al crear cuenta:', err);
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCuentas, pagination.page, pagination.size]);

  const handleUpdateCuenta = useCallback(async (id: number, data: Partial<Cuenta>) => {
    setLoading(true);
    clearError();
    try {
      const result = await CuentaService.actualizar(id, data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchCuentas(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      console.error('Error al actualizar cuenta 400:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCuentas, pagination.page, pagination.size]);

  const handleDeleteCuenta = useCallback(async (id: number) => {
    setLoading(true);
    clearError();
    try {
      const result = await CuentaService.eliminar(id);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchCuentas(pagination.page, pagination.size);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al eliminar transacción');
    } finally {
      setLoading(false);
    }
  }, [fetchCuentas, pagination.page, pagination.size]);


  const contextValue = {
    cuentas,
    loading,
    error,
    success,
    message,
    pagination,
    fetchCuentas,
    createCuenta: handleCreateCuenta,
    updateCuenta: handleUpdateCuenta,
    deleteCuenta: handleDeleteCuenta,
    clearError,
    clearSuccess,
    clearMessage
  };

  return (
    <CuentaContext.Provider value={contextValue}>
      {children}
    </CuentaContext.Provider>
  );
};

export const useCuentas = () => {
  const context = useContext(CuentaContext);
  if (!context) {
    throw new Error('useCuentas debe usarse dentro de CuentaProvider');
  }
  return context;
};