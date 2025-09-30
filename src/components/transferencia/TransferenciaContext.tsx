import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { TransferenciaService, CuentaService, Cuenta, Transferencia, TransferenciaResponse, ApiResponse } from '../../services/transferencia/transferenciaService';
import { set } from 'react-hook-form';


interface Pagination {
  page: number;
  size: number;
  total: number;
}

interface TransferenciaContextType {
  transferencias: Transferencia[];
  cuentas: Cuenta[];
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  pagination: Pagination;
  fetchTransferencias: (page?: number, size?: number) => Promise<void>;
  fetchCuentas: () => Promise<void>;
  createTransferencia: (data: Omit<Transferencia, 'id'>) => Promise<boolean>;
  updateTransferencia: (id: number, data: Partial<Transferencia>) => Promise<boolean>;
  deleteTransferencia: (id: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearMessage: () => void;
}

const TransferenciaContext = createContext<TransferenciaContextType | null>(null);

export const TransferenciaProvider = ({ children }: { children: ReactNode }) => {
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
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

  const fetchTransferencias = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    clearError();
    try {
      const response = await TransferenciaService.listar(page, size);
      setTransferencias(response.content);
      setPagination({
        page: response.pageable.pageNumber,
        size: response.pageable.pageSize,
        total: response.totalElements
      });
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al cargar transferencias');
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

  const handleCreateTransferencia = useCallback(async (data: Omit<Transferencia, 'id'>) => {
    setLoading(true);
    clearError();
    try {
      const result = await TransferenciaService.registrar(data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchTransferencias(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      console.error('Error al crear transferencia:', err);
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTransferencias, pagination.page, pagination.size]);

  const handleUpdateTransferencia = useCallback(async (id: number, data: Partial<Transferencia>) => {
    setLoading(true);
    clearError();
    try {
      const result = await TransferenciaService.actualizar(id, data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchTransferencias(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      console.error('Error al actualizar transferencia 400:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTransferencias, pagination.page, pagination.size]);

  const handleDeleteTransferencia = useCallback(async (id: number) => {
    setLoading(true);
    clearError();
    try {
      const result = await TransferenciaService.eliminar(id);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchTransferencias(pagination.page, pagination.size);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al eliminar transferencia');
    } finally {
      setLoading(false);
    }
  }, [fetchTransferencias, pagination.page, pagination.size]);

  // Cargar cuentas al iniciar
    useEffect(() => {
      fetchCuentas();
    }, [fetchCuentas]);

  const contextValue = {
    transferencias,
    cuentas,
    loading,
    error,
    success,
    message,
    pagination,
    fetchTransferencias,
    fetchCuentas,
    createTransferencia: handleCreateTransferencia,
    updateTransferencia: handleUpdateTransferencia,
    deleteTransferencia: handleDeleteTransferencia,
    clearError,
    clearSuccess,
    clearMessage
  };

  return (
    <TransferenciaContext.Provider value={contextValue}>
      {children}
    </TransferenciaContext.Provider>
  );
};

export const useTransferencias = () => {
  const context = useContext(TransferenciaContext);
  if (!context) {
    throw new Error('useTransferencias debe usarse dentro de TransferenciaProvider');
  }
  return context;
};