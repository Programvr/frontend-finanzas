import React, { useEffect, useState } from 'react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  DialogActions,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import { Paid as PaidIcon } from '@mui/icons-material';
import { useObjetivoAhorros } from './ObjetivoAhorroContext';
import { ObjetivoAhorro } from '../../services/objetivoAhorro/objetivoAhorroService';

// Esquema de validación con Zod
const objetivoAhorroSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  montoObjetivo: z.number().min(0.01, 'El monto objetivo debe ser mayor a 0'),
  montoActual: z.number().min(0.00, 'El monto debe ser por lo menos de 0'),
  fechaObjetivo: z.string().min(1, 'Fecha requerida'),
  completado: z.boolean(),
  cuenta: z.number().min(1, 'Cuenta requerida')
});

type FormValues = z.infer<typeof objetivoAhorroSchema>;

interface ObjetivoAhorroFormProps {
  initialData?: ObjetivoAhorro;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const ObjetivoAhorroForm: React.FC<ObjetivoAhorroFormProps> = ({ 
  initialData, 
  onSuccess, 
  onCancel,
  isModal = false
}) => {
  const {
    cuentas, 
    loading, 
    error, 
    message,
    createObjetivoAhorro, 
    updateObjetivoAhorro,
    clearError,
    clearMessage
  } = useObjetivoAhorros();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    reset,
    watch,
    setValue
  } = useForm<FormValues>({
    resolver: zodResolver(objetivoAhorroSchema),
    defaultValues: {
      montoObjetivo: 0,
      montoActual: 0,
      fechaObjetivo: '',
      completado: false,
      cuenta: 0
    }
  });

  // Función para obtener el ID de cuenta por nombre
  const getCuentaIdByName = (nombre: string): number => {
    const cuenta = cuentas.find(cat => cat.nombre === nombre);
    return cuenta ? cuenta.id : 0;
  };

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    if (initialData) {
      
      // Convertir el nombre de cuenta a ID
      const cuentaId = typeof initialData.cuenta === 'string' 
        ? getCuentaIdByName(initialData.cuenta)
        : initialData.cuenta || 0;

      reset({
        nombre: initialData.nombre || '',
        montoObjetivo: initialData.montoObjetivo || 0,
        montoActual: initialData.montoActual || 0,
        fechaObjetivo: initialData.fechaObjetivo ? new Date(initialData.fechaObjetivo).toISOString().split('T')[0] : '',
        completado: initialData.completado || false,
        cuenta: cuentaId
      });
    }
  }, [initialData, reset, cuentas]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const selectedCuenta = cuentas.find(c => c.id === data.cuenta);
      
      const objetivoAhorroData: Omit<ObjetivoAhorro, 'id'> = {
        ...data,
        cuenta: selectedCuenta?.id || 0
      };

      let result;
      if (initialData?.id) {
        result = await updateObjetivoAhorro(initialData.id, objetivoAhorroData);
      } else {
        result = await createObjetivoAhorro(objetivoAhorroData);
      }

      if (result) {
        onSuccess?.(); // Solo se cierra después de esta ejecución
        console.log('Objetivo de Ahorro guardado exitosamente');
      } else {
        console.error('Error al guardar Objetivo de Ahorro:', error);
      }
    } catch (err) {
      console.error('Error en el envío del formulario:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <TextField
        label="Nombre del objetivo *"
        fullWidth
        sx={{ minWidth: 200 }}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        disabled={loading || isSubmitting}
        {...register('nombre')}
      />

      <FormControl fullWidth sx={{ minWidth: 200 }} error={!!errors.cuenta}>
        <InputLabel id="cuenta-label">Cuenta asociada *</InputLabel>
        <Select
          labelId="cuenta-label"
          label="Cuenta asociada *"
          value={watch('cuenta')}
          onChange={(e) => setValue('cuenta', Number(e.target.value), { shouldValidate: true })}
          disabled={loading || isSubmitting}
        >
          <MenuItem value={0} disabled>
            Seleccione una cuenta
          </MenuItem>
          {cuentas.map((cuenta) => (
            <MenuItem 
              key={cuenta.id} 
              value={cuenta.id}
              disabled={!cuenta.activa} // Evitar cuentas inactivas
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceIcon sx={{ color: cuenta.activa ? 'success.main' : 'error.main' }} />
                <Box>
                  <Typography variant="body1">{cuenta.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Saldo: ${cuenta.saldoActual.toLocaleString()} {cuenta.moneda}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
        {errors.cuenta && (
          <Typography variant="caption" color="error">
            {errors.cuenta.message}
          </Typography>
        )}
      </FormControl>
    </Box>

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
        label="Monto actual"
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

    <TextField
      label="Fecha objetivo *"
      type="date"
      fullWidth
      sx={{ minWidth: 200, mb: 2 }}
      InputLabelProps={{ shrink: true }}
      error={!!errors.fechaObjetivo}
      helperText={errors.fechaObjetivo?.message}
      disabled={loading || isSubmitting}
      {...register('fechaObjetivo')}
    />

    {/* Mostrar información de progreso */}
    {watch('montoObjetivo') > 0 && watch('montoActual') >= 0 && (
      <Alert severity="info" sx={{ mb: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" gutterBottom>
            Progreso: ${watch('montoActual').toLocaleString()} / ${watch('montoObjetivo').toLocaleString()}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={Math.min((watch('montoActual') / watch('montoObjetivo')) * 100, 100)}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            {((watch('montoActual') / watch('montoObjetivo')) * 100).toFixed(1)}% completado
          </Typography>
        </Box>
      </Alert>
    )}

    {/* Checkbox para estado completado */}
    <FormControlLabel
      control={
        <Checkbox
          checked={watch('completado') || false}
          onChange={(e) => {
        setValue('completado', e.target.checked, { shouldValidate: true, shouldDirty: true });
      }}
      disabled={loading || isSubmitting}
    />
      }
      label="Objetivo completado"
      sx={{ mb: 2 }}
    />

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
          disabled={loading || !isDirty || isSubmitting}
          startIcon={(loading || isSubmitting) ? <CircularProgress size={20} /> : null}
        >
          {initialData?.id ? 'Actualizar' : 'Crear objetivo'}
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
          disabled={loading || !isDirty || isSubmitting}
          startIcon={(loading || isSubmitting) ? <CircularProgress size={20} /> : null}
          sx={{ px: 4 }}
        >
          {initialData?.id ? 'Actualizar' : 'Crear objetivo'}
        </Button>
      </Box>
    )}

    {error && (
      <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    {message && message.includes('exitosa') && !isModal && (
      <Alert severity="success" onClose={clearMessage} sx={{ mb: 2 }}>
        {message}
      </Alert>
    )}
  </Box>
);
};