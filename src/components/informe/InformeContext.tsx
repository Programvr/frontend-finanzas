import React, { createContext, ReactNode } from 'react';
import { descargarInforme as descargarInformeService } from '../../services/informe/informeService';

interface InformeContextProps {
  descargarInforme: (tipo: 'excel' | 'pdf', fechaInicio: string, fechaFin: string) => Promise<void>;
}

export const InformeContext = createContext<InformeContextProps>({
  descargarInforme: async () => {},
});

export const InformeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const descargarInforme = async (tipo: 'excel' | 'pdf', fechaInicio: string, fechaFin: string) => {
    try {
      const response = await descargarInformeService(tipo, fechaInicio, fechaFin);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = tipo === 'excel' ? 'informe.xlsx' : 'informe.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw error;
    }
  };

  return (
    <InformeContext.Provider value={{ descargarInforme }}>
      {children}
    </InformeContext.Provider>
  );
};