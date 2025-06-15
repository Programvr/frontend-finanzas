import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { TransaccionService, CategoriaService, Categoria, Transaccion, TransaccionResponse, ApiResponse } from '../../services/transaccion/transaccionService';
import { set } from 'react-hook-form';


interface Pagination {
  page: number;
  size: number;
  total: number;
}

interface TransaccionContextType {
  transacciones: Transaccion[];
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  pagination: Pagination;
  fetchTransacciones: (page?: number, size?: number) => Promise<void>;
  fetchCategorias: () => Promise<void>;
  createTransaccion: (data: Omit<Transaccion, 'id'>) => Promise<boolean>;
  updateTransaccion: (id: number, data: Partial<Transaccion>) => Promise<boolean>;
  deleteTransaccion: (id: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearMessage: () => void;
}

const TransaccionContext = createContext<TransaccionContextType | null>(null);

export const TransaccionProvider = ({ children }: { children: ReactNode }) => {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
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

  const fetchTransacciones = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    clearError();
    try {
      const response = await TransaccionService.listar(page, size);
      setTransacciones(response.content);
      setPagination({
        page: response.pageable.pageNumber,
        size: response.pageable.pageSize,
        total: response.totalElements
      });
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const response = await CategoriaService.listar();
      setSuccess(true);
      setCategorias(response);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateTransaccion = useCallback(async (data: Omit<Transaccion, 'id'>) => {
    setLoading(true);
    clearError();
    try {
      const result = await TransaccionService.registrar(data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchTransacciones(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      console.error('Error al crear transacción:', err);
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTransacciones, pagination.page, pagination.size]);

  const handleUpdateTransaccion = useCallback(async (id: number, data: Partial<Transaccion>) => {
    setLoading(true);
    clearError();
    try {
      const result = await TransaccionService.actualizar(id, data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchTransacciones(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      console.error('Error al actualizar transacción 400:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTransacciones, pagination.page, pagination.size]);

  const handleDeleteTransaccion = useCallback(async (id: number) => {
    setLoading(true);
    clearError();
    try {
      const result = await TransaccionService.eliminar(id);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchTransacciones(pagination.page, pagination.size);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al eliminar transacción');
    } finally {
      setLoading(false);
    }
  }, [fetchTransacciones, pagination.page, pagination.size]);

  // Cargar categorías al iniciar
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const contextValue = {
    transacciones,
    categorias,
    loading,
    error,
    success,
    message,
    pagination,
    fetchTransacciones,
    fetchCategorias,
    createTransaccion: handleCreateTransaccion,
    updateTransaccion: handleUpdateTransaccion,
    deleteTransaccion: handleDeleteTransaccion,
    clearError,
    clearSuccess,
    clearMessage
  };

  return (
    <TransaccionContext.Provider value={contextValue}>
      {children}
    </TransaccionContext.Provider>
  );
};

export const useTransacciones = () => {
  const context = useContext(TransaccionContext);
  if (!context) {
    throw new Error('useTransacciones debe usarse dentro de TransaccionProvider');
  }
  return context;
};