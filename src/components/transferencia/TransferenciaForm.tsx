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
  InputAdornment
} from '@mui/material';
import { Paid as PaidIcon } from '@mui/icons-material';
import { useTransferencias } from './TransferenciaContext';
import { Transferencia } from '../../services/transferencia/transferenciaService';

// Esquema de validación con Zod
const transferenciaSchema = z.object({
  cuentaOrigen: z.number().min(1, 'Selecciona una cuenta origen'),
  cuentaDestino: z.number().min(1, 'Selecciona una cuenta destino'),
  monto: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  fecha: z.string().min(1, 'Fecha requerida'),
  descripcion: z.string().min(1, 'Descripción requerida')
});

type FormValues = z.infer<typeof transferenciaSchema>;

interface TransferenciaFormProps {
  initialData?: Transferencia;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const TransferenciaForm: React.FC<TransferenciaFormProps> = ({ 
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
    createTransferencia, 
    updateTransferencia,
    clearError,
    clearMessage
  } = useTransferencias();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    reset,
    watch,
    setValue
  } = useForm<FormValues>({
    resolver: zodResolver(transferenciaSchema),
    defaultValues: {
      cuentaOrigen: 0,
      cuentaDestino: 0,
      monto: 0,
      fecha: '',
      descripcion: ''
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
      const cuentaIdOrigen = typeof initialData.cuentaOrigen === 'string' 
        ? getCuentaIdByName(initialData.cuentaOrigen)
        : initialData.cuentaOrigen || 0;

      const cuentaIdDestino = typeof initialData.cuentaDestino === 'string' 
        ? getCuentaIdByName(initialData.cuentaDestino)
        : initialData.cuentaDestino || 0;

      reset({
        cuentaOrigen: cuentaIdOrigen,
        cuentaDestino: cuentaIdDestino,
        monto: initialData.monto || 0,
        fecha: initialData.fecha ? new Date(initialData.fecha).toISOString().slice(0, 16) : '',
        descripcion: initialData.descripcion || ''
      });
    }
  }, [initialData, reset, cuentas]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const selectedCuentaOrigen = cuentas.find(c => c.id === data.cuentaOrigen);

      const selectedCuentaDestino = cuentas.find(c => c.id === data.cuentaDestino);
      
      const transferenciaData: Omit<Transferencia, 'id'> = {
        ...data,
        cuentaOrigen: selectedCuentaOrigen?.id || 0,
        cuentaDestino: selectedCuentaDestino?.id || 0
      };

      let result;
      if (initialData?.id) {
        result = await updateTransferencia(initialData.id, transferenciaData);
      } else {
        result = await createTransferencia(transferenciaData);
      }

      if (result) {
        onSuccess?.(); // Solo se cierra después de esta ejecución
        console.log('Transferencia guardada exitosamente');
      } else {
        console.error('Error al guardar transferencia:', error);
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
      <FormControl fullWidth sx={{ minWidth: 200 }} error={!!errors.cuentaOrigen}>
        <InputLabel id="cuenta-origen-label">Cuenta Origen *</InputLabel>
        <Select
          labelId="cuenta-origen-label"
          label="Cuenta Origen *"
          value={watch('cuentaOrigen')}
          onChange={(e) => setValue('cuentaOrigen', Number(e.target.value), { shouldValidate: true })}
          disabled={loading || isSubmitting}
        >
          <MenuItem value={0} disabled>
            Seleccione cuenta origen
          </MenuItem>
          {cuentas.map((cuenta) => (
            <MenuItem 
              key={cuenta.id} 
              value={cuenta.id}
              disabled={cuenta.id === watch('cuentaDestino')} // Evitar misma cuenta
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
        {errors.cuentaOrigen && (
          <Typography variant="caption" color="error">
            {errors.cuentaOrigen.message}
          </Typography>
        )}
      </FormControl>

      <FormControl fullWidth sx={{ minWidth: 200 }} error={!!errors.cuentaDestino}>
        <InputLabel id="cuenta-destino-label">Cuenta Destino *</InputLabel>
        <Select
          labelId="cuenta-destino-label"
          label="Cuenta Destino *"
          value={watch('cuentaDestino')}
          onChange={(e) => setValue('cuentaDestino', Number(e.target.value), { shouldValidate: true })}
          disabled={loading || isSubmitting}
        >
          <MenuItem value={0} disabled>
            Seleccione cuenta destino
          </MenuItem>
          {cuentas.map((cuenta) => (
            <MenuItem 
              key={cuenta.id} 
              value={cuenta.id}
              disabled={cuenta.id === watch('cuentaOrigen') || !cuenta.activa} // Evitar misma cuenta y cuentas inactivas
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceIcon sx={{ color: cuenta.activa ? 'success.main' : 'error.main' }} />
                <Box>
                  <Typography variant="body1">{cuenta.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {cuenta.tipo} - {cuenta.moneda}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
        {errors.cuentaDestino && (
          <Typography variant="caption" color="error">
            {errors.cuentaDestino.message}
          </Typography>
        )}
      </FormControl>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <TextField
        label="Monto *"
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
        error={!!errors.monto}
        helperText={errors.monto?.message}
        disabled={loading || isSubmitting}
        {...register('monto', { valueAsNumber: true })}
      />

      <TextField
        label="Fecha *"
        type="datetime-local"
        fullWidth
        sx={{ minWidth: 200 }}
        InputLabelProps={{ shrink: true }}
        error={!!errors.fecha}
        helperText={errors.fecha?.message}
        disabled={loading || isSubmitting}
        {...register('fecha')}
      />
    </Box>

    <TextField
      label="Descripción *"
      fullWidth
      multiline
      rows={3}
      error={!!errors.descripcion}
      helperText={errors.descripcion?.message}
      disabled={loading || isSubmitting}
      {...register('descripcion')}
      sx={{ mb: 3 }}
    />

    {/* Mostrar información de saldo disponible */}
    {watch('cuentaOrigen') > 0 && (
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Saldo disponible en cuenta origen: $
          {cuentas.find(c => c.id === watch('cuentaOrigen'))?.saldoActual.toLocaleString()}
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
          disabled={loading || !isDirty || isSubmitting}
          startIcon={(loading || isSubmitting) ? <CircularProgress size={20} /> : null}
        >
          {initialData?.id ? 'Actualizar' : 'Transferir'}
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
          {initialData?.id ? 'Actualizar' : 'Transferir'}
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