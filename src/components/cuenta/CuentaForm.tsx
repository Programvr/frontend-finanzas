import React, { useEffect, useState } from 'react';
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
  DialogActions
} from '@mui/material';
import { Paid as PaidIcon } from '@mui/icons-material';
import { useCuentas } from './CuentaContext';
import { Cuenta } from '../../services/cuenta/cuentaService';

// Esquema de validación con Zod
const cuentaSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  tipo: z.string().min(1, 'tipo requerido'),
  saldoInicial: z.number().min(0.0, 'El saldoInicial debe ser de al menos 0'),
  saldoActual: z.number().min(0.0, 'El saldoActual debe ser de al menos 0'),
  moneda: z.string().min(1, 'moneda requerida'),
  activa: z.boolean()
});

type FormValues = z.infer<typeof cuentaSchema>;

interface CuentaFormProps {
  initialData?: Cuenta;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const CuentaForm: React.FC<CuentaFormProps> = ({ 
  initialData, 
  onSuccess, 
  onCancel,
  isModal = false
}) => {
  const { 
    loading, 
    error, 
    message,
    createCuenta, 
    updateCuenta,
    clearError,
    clearMessage
  } = useCuentas();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    reset,
    watch,
    setValue
  } = useForm<FormValues>({
    resolver: zodResolver(cuentaSchema),
    defaultValues: {
      tipo: 'Ahorros',
      saldoInicial: 0,
      saldoActual: 0,
      moneda: 'COP',
      activa: true
    }
  });


  // Efecto para cargar los datos iniciales
  useEffect(() => {
    if (initialData) {

      reset({
        nombre: initialData.nombre || '',
        tipo: initialData.tipo || 'Ahorros',
        saldoInicial: initialData.saldoInicial || 0,
        saldoActual: initialData.saldoActual || 0,
        moneda: initialData.moneda || 'COP',
        activa: Boolean(initialData.activa)
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      
      const cuentaData: Omit<Cuenta, 'id'> & { activa: boolean } = {
        ...data,
        activa: data.activa as boolean 
      };

      let result;
      if (initialData?.id) {
        result = await updateCuenta(initialData.id, cuentaData);
      } else {
        result = await createCuenta(cuentaData);
      }

      if (result) {
        onSuccess?.(); // Solo se cierra después de esta ejecución
        console.log('Cuenta guardada exitosamente');
      } else {
        console.error('Error al guardar cuenta:', error);
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
        label="Nombre de la cuenta *"
        fullWidth
        sx={{ minWidth: 200 }}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        disabled={loading || isSubmitting}
        {...register('nombre')}
      />
      
      <FormControl fullWidth sx={{ minWidth: 200 }} error={!!errors.tipo}>
        <InputLabel id="tipo-label">Tipo de cuenta *</InputLabel>
        <Select
          labelId="tipo-label"
          label="Tipo de cuenta *"
          value={watch('tipo')}
          onChange={(e) => setValue('tipo', e.target.value, { shouldValidate: true })}
          disabled={loading || isSubmitting}
        >
          <MenuItem value="" disabled>
            Seleccione un tipo
          </MenuItem>
          <MenuItem value="Ahorros">Ahorros</MenuItem>
          <MenuItem value="Corriente">Corriente</MenuItem>
          <MenuItem value="Inversión">Inversión</MenuItem>
          <MenuItem value="Nómina">Nómina</MenuItem>
          <MenuItem value="Efectivo">Efectivo</MenuItem>
        </Select>
        {errors.tipo && (
          <Typography variant="caption" color="error">
            {errors.tipo.message}
          </Typography>
        )}
      </FormControl>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <TextField
        label="Saldo inicial *"
        type="number"
        fullWidth
        sx={{ minWidth: 200 }}
        InputProps={{
          inputProps: { 
            step: "0.01",
            min: "0.00"
          }
        }}
        error={!!errors.saldoInicial}
        helperText={errors.saldoInicial?.message}
        disabled={loading || isSubmitting}
        {...register('saldoInicial', { valueAsNumber: true })}
      />

      <TextField
        label="Saldo actual *"
        type="number"
        fullWidth
        sx={{ minWidth: 200 }}
        InputProps={{
          inputProps: { 
            step: "0.01",
            min: "0.00"
          }
        }}
        error={!!errors.saldoActual}
        helperText={errors.saldoActual?.message}
        disabled={loading || isSubmitting}
        {...register('saldoActual', { valueAsNumber: true })}
      />
    </Box>

    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <FormControl fullWidth sx={{ minWidth: 200 }} error={!!errors.moneda}>
        <InputLabel id="moneda-label">Moneda *</InputLabel>
        <Select
          labelId="moneda-label"
          label="Moneda *"
          value={watch('moneda')}
          onChange={(e) => setValue('moneda', e.target.value, { shouldValidate: true })}
          disabled={loading || isSubmitting}
        >
          <MenuItem value="COP">Peso Colombiano (COP)</MenuItem>
          <MenuItem value="USD">Dólar Estadounidense (USD)</MenuItem>
          <MenuItem value="EUR">Euro (EUR)</MenuItem>
          <MenuItem value="MXN">Peso Mexicano (MXN)</MenuItem>
          <MenuItem value="BRL">Real Brasileño (BRL)</MenuItem>
        </Select>
        {errors.moneda && (
          <Typography variant="caption" color="error">
            {errors.moneda.message}
          </Typography>
        )}
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={watch('activa')}
            {...register('activa')}
            color="primary"
            disabled={loading || isSubmitting}
          />
        }
        label="Cuenta activa"
        sx={{ 
          alignSelf: 'center', 
          minWidth: 200,
          ml: 1
        }}
      />
    </Box>

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
          {initialData?.id ? 'Actualizar' : 'Crear cuenta'}
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
          {initialData?.id ? 'Actualizar' : 'Crear cuenta'}
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