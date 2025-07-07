
import api from '../api';

interface ResumenMensual {
  tipo: 'G' | 'I';
  total: number;
  cantidadTransacciones: number;
}

interface DashboardData {
  resumenMensual: ResumenMensual[];
  balance: number;
  totalGastos: number;
  totalIngresos: number;
}

export const DashboardService = {
  async getResumenMensual(anio: number, mes: number): Promise<DashboardData> {
    try {
      const response = await api.get(`/dashboard/resumen?anio=${anio}&mes=${mes}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = response.data;
      const gastos = data.find((item: ResumenMensual) => item.tipo === 'G')?.total || 0;
      const ingresos = data.find((item: ResumenMensual) => item.tipo === 'I')?.total || 0;
      
      return {
        resumenMensual: data,
        balance: ingresos - gastos,
        totalGastos: gastos,
        totalIngresos: ingresos
      };
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      throw error;
    }
  }
};