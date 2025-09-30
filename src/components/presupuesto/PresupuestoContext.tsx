import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { PresupuestoService, CategoriaService, Categoria, Presupuesto, PresupuestoResponse, ApiResponse } from '../../services/presupuesto/presupuestoService';
import { set } from 'react-hook-form';


interface Pagination {
  page: number;
  size: number;
  total: number;
}

interface PresupuestoContextType {
  presupuestos: Presupuesto[];
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  pagination: Pagination;
  fetchPresupuestos: (page?: number, size?: number) => Promise<void>;
  fetchCategorias: () => Promise<void>;
  createPresupuesto: (data: Omit<Presupuesto, 'id'>) => Promise<boolean>;
  updatePresupuesto: (id: number, data: Partial<Presupuesto>) => Promise<boolean>;
  deletePresupuesto: (id: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearMessage: () => void;
}

const PresupuestoContext = createContext<PresupuestoContextType | null>(null);

export const PresupuestoProvider = ({ children }: { children: ReactNode }) => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
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

  const fetchPresupuestos = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    clearError();
    try {
      const response = await PresupuestoService.listar(page, size);
      setPresupuestos(response.content);
      setPagination({
        page: response.pageable.pageNumber,
        size: response.pageable.pageSize,
        total: response.totalElements
      });
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al cargar presupuestos');
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

  const handleCreatePresupuesto = useCallback(async (data: Omit<Presupuesto, 'id'>) => {
    setLoading(true);
    clearError();
    try {
      const result = await PresupuestoService.registrar(data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchPresupuestos(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      console.error('Error al crear presupuesto:', err);
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchPresupuestos, pagination.page, pagination.size]);

  const handleUpdatePresupuesto = useCallback(async (id: number, data: Partial<Presupuesto>) => {
    setLoading(true);
    clearError();
    try {
      const result = await PresupuestoService.actualizar(id, data);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchPresupuestos(pagination.page, pagination.size);
      return result.success;
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error');
      console.error('Error al actualizar presupuesto 400:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchPresupuestos, pagination.page, pagination.size]);

  const handleDeletePresupuesto = useCallback(async (id: number) => {
    setLoading(true);
    clearError();
    try {
      const result = await PresupuestoService.eliminar(id);
      setSuccess(result.success);
      setMessage(result.message);
      await fetchPresupuestos(pagination.page, pagination.size);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Error al eliminar presupuesto');
    } finally {
      setLoading(false);
    }
  }, [fetchPresupuestos, pagination.page, pagination.size]);

  // Cargar categorías al iniciar
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const contextValue = {
    presupuestos,
    categorias,
    loading,
    error,
    success,
    message,
    pagination,
    fetchPresupuestos,
    fetchCategorias,
    createPresupuesto: handleCreatePresupuesto,
    updatePresupuesto: handleUpdatePresupuesto,
    deletePresupuesto: handleDeletePresupuesto,
    clearError,
    clearSuccess,
    clearMessage
  };

  return (
    <PresupuestoContext.Provider value={contextValue}>
      {children}
    </PresupuestoContext.Provider>
  );
};

export const usePresupuestos = () => {
  const context = useContext(PresupuestoContext);
  if (!context) {
    throw new Error('usePresupuestos debe usarse dentro de PresupuestoProvider');
  }
  return context;
};