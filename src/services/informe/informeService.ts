import api from '../api';

export const descargarInforme = (
  tipo: 'excel' | 'pdf',
  fechaInicio: string,
  fechaFin: string
) => {
  return api.get('/informes/descargar', {
    params: {
      tipo,
      fechaInicio,
      fechaFin,
    },
    responseType: 'blob',
  });
};