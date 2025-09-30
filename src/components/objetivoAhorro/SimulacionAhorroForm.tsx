import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  DialogActions,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import { ObjetivoAhorroService, SimuladorRequest, SimuladorResponse } from '../../services/objetivoAhorro/objetivoAhorroService';

// Esquema de validación para simulación
const simulacionSchema = z.object({
  montoObjetivo: z.number().min(0.01, 'El monto objetivo debe ser mayor a 0'),
  montoActual: z.number().min(0.00, 'El monto actual debe ser mayor o igual a 0'),
  fechaObjetivo: z.string().min(1, 'Fecha objetivo requerida'),
  cuotaMensual: z.number().min(0.00, 'La cuota mensual debe ser mayor o igual a 0').optional()
}).refine((data) => {
  // Validar que al menos 3 campos tengan valores - forma compatible
  const valores = [data.montoObjetivo, data.montoActual, data.fechaObjetivo, data.cuotaMensual];
  const camposConValor = valores.filter(val => 
    val !== undefined && val !== null && val !== 0 && val !== ''
  ).length;
  return camposConValor >= 3;
}, {
  message: 'Debe completar al menos 3 de los 4 campos para realizar la simulación',
  path: ['montoObjetivo']
});

type SimulacionValues = z.infer<typeof simulacionSchema>;

interface SimulacionAhorroFormProps {
  onSuccess?: (data: SimuladorResponse) => void;
  onCancel?: () => void;
  isModal?: boolean;
  loading?: boolean;
}

export const SimulacionAhorroForm: React.FC<SimulacionAhorroFormProps> = ({ 
  onSuccess, 
  onCancel,
  isModal = false,
  loading = false
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resultado, setResultado] = React.useState<SimuladorResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    setValue,
    trigger
  } = useForm<SimulacionValues>({
    resolver: zodResolver(simulacionSchema),
    defaultValues: {
      montoObjetivo: 0,
      montoActual: 0,
      fechaObjetivo: '',
      cuotaMensual: 0
    }
  });

  // Función para simular usando el servicio real
  const simularAhorro = async (data: SimulacionValues): Promise<SimuladorResponse> => {
    setError(null);
    
    // Preparar datos para el servicio
    const requestData: SimuladorRequest = {
      montoObjetivo: data.montoObjetivo,
      montoActual: data.montoActual,
      fechaObjetivo: data.fechaObjetivo,
      cuotaMensual: data.cuotaMensual || 0
    };

    try {
      const response = await ObjetivoAhorroService.simulador(requestData);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error en la simulación');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al realizar la simulación';
      setError(errorMessage);
      throw error;
    }
  };

  const onSubmit = async (data: SimulacionValues) => {
    setIsSubmitting(true);
    try {
      const resultado = await simularAhorro(data);
      setResultado(resultado);
      onSuccess?.(resultado);
    } catch (error) {
      console.error('Error en simulación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const montoObjetivo = watch('montoObjetivo');
  const montoActual = watch('montoActual');
  const cuotaMensual = watch('cuotaMensual');
  const fechaObjetivo = watch('fechaObjetivo');

  // Calcular progreso local
  const calcularProgreso = () => {
    if (montoObjetivo <= 0) return 0;
    return Math.min((montoActual / montoObjetivo) * 100, 100);
  };

  // Calcular meses restantes localmente para preview
  const calcularMesesRestantes = () => {
    if (!fechaObjetivo) return 0;
    
    try {
      const fechaObj = new Date(fechaObjetivo);
      const hoy = new Date();
      const meses = Math.max(1, 
        (fechaObj.getFullYear() - hoy.getFullYear()) * 12 + 
        (fechaObj.getMonth() - hoy.getMonth())
      );
      return meses;
    } catch {
      return 0;
    }
  };

  // Calcular cuota sugerida localmente para preview
  const calcularCuotaSugerida = () => {
    const montoFaltante = montoObjetivo - montoActual;
    const meses = calcularMesesRestantes();
    
    if (meses <= 0 || montoFaltante <= 0) return 0;
    return montoFaltante / meses;
  };

  const mesesRestantes = calcularMesesRestantes();
  const cuotaSugerida = calcularCuotaSugerida();
  const montoFaltante = montoObjetivo - montoActual;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          label="Monto objetivo *"
          type="number"
          fullWidth
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { 
              step: "0.01",
              min: "0.01"
            }
          }}
          error={!!errors.montoObjetivo}
          helperText={errors.montoObjetivo?.message}
          disabled={loading || isSubmitting}
          {...register('montoObjetivo', { valueAsNumber: true })}
        />

        <TextField
          label="Monto actual *"
          type="number"
          fullWidth
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { 
              step: "0.01",
              min: "0"
            }
          }}
          error={!!errors.montoActual}
          helperText={errors.montoActual?.message}
          disabled={loading || isSubmitting}
          {...register('montoActual', { valueAsNumber: true })}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          label="Fecha objetivo *"
          type="date"
          fullWidth
          sx={{ minWidth: 200 }}
          InputLabelProps={{ shrink: true }}
          error={!!errors.fechaObjetivo}
          helperText={errors.fechaObjetivo?.message}
          disabled={loading || isSubmitting}
          {...register('fechaObjetivo')}
        />

        <TextField
          label="Cuota mensual"
          type="number"
          fullWidth
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { 
              step: "0.01",
              min: "0"
            }
          }}
          error={!!errors.cuotaMensual}
          helperText={errors.cuotaMensual?.message || "Opcional - el sistema calculará la cuota necesaria"}
          disabled={loading || isSubmitting}
          {...register('cuotaMensual', { valueAsNumber: true })}
        />
      </Box>

      {/* Mostrar información de simulación previa */}
      {montoObjetivo > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" gutterBottom>
              Monto faltante: ${montoFaltante.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            {mesesRestantes > 0 && (
              <Typography variant="body2" gutterBottom>
                Meses restantes: {mesesRestantes}
              </Typography>
            )}
            {cuotaSugerida > 0 && (
              <Typography variant="body2" gutterBottom>
                Cuota mensual sugerida: ${cuotaSugerida.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            )}
            <LinearProgress 
              variant="determinate" 
              value={calcularProgreso()}
              sx={{ height: 8, borderRadius: 4, mt: 1 }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {calcularProgreso().toFixed(1)}% del objetivo
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Mostrar errores de la API */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Resultado de la simulación del servicio */}
      {resultado && (
        <Alert severity={resultado.esPosible ? "success" : "warning"} sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            {resultado.esPosible ? '✅ Simulación exitosa' : '⚠️ Ajuste necesario'}
          </Typography>
          <Typography variant="body2">
            Monto objetivo: ${resultado.montoObjetivo.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body2">
            Monto actual: ${resultado.montoActual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          {resultado.cuotaMensualCalculada && (
            <Typography variant="body2">
              Cuota mensual calculada: ${resultado.cuotaMensualCalculada.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          )}
          {resultado.tiempoRestanteMeses && (
            <Typography variant="body2">
              Meses restantes: {resultado.tiempoRestanteMeses}
            </Typography>
          )}
          {resultado.fechaEstimada && (
            <Typography variant="body2">
              Fecha estimada: {new Date(resultado.fechaEstimada).toLocaleDateString()}
            </Typography>
          )}
          <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
            {resultado.mensaje || 
              (resultado.esPosible 
                ? 'Con la cuota actual puedes alcanzar tu objetivo' 
                : 'Considera aumentar tu cuota mensual o ampliar el plazo')}
          </Typography>
        </Alert>
      )}

      {isModal ? (
        <DialogActions>
          <Button 
            onClick={onCancel} 
            disabled={loading || isSubmitting}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || isSubmitting}
            startIcon={(loading || isSubmitting) ? <CircularProgress size={20} /> : null}
          >
            Simular
          </Button>
        </DialogActions>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading || isSubmitting}
              sx={{ px: 4 }}
            >
              Cancelar
            </Button>
          )}
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading || isSubmitting}
            startIcon={(loading || isSubmitting) ? <CircularProgress size={20} /> : null}
            sx={{ px: 4 }}
          >
            Simular
          </Button>
        </Box>
      )}
    </Box>
  );
};