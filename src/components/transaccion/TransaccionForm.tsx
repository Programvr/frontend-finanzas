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
import { useTransacciones } from './TransaccionContext';
import { Transaccion } from '../../services/transaccion/transaccionService';

// Esquema de validación con Zod
const transactionSchema = z.object({
  categoria: z.number().min(1, 'Selecciona una categoría'),
  monto: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  fecha: z.string().min(1, 'Fecha requerida'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  nota: z.string().optional(),
  recurrente: z.boolean()
});

type FormValues = z.infer<typeof transactionSchema>;

interface TransaccionFormProps {
  initialData?: Transaccion;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const TransaccionForm: React.FC<TransaccionFormProps> = ({ 
  initialData, 
  onSuccess, 
  onCancel,
  isModal = false
}) => {
  const { 
    categorias, 
    loading, 
    error, 
    message,
    createTransaccion, 
    updateTransaccion,
    clearError,
    clearMessage
  } = useTransacciones();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    reset,
    watch,
    setValue
  } = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      categoria: 0,
      monto: 0,
      fecha: '',
      descripcion: '',
      nota: '',
      recurrente: false
    }
  });

  // Función para obtener el ID de categoría por nombre
  const getCategoriaIdByName = (nombre: string): number => {
    const categoria = categorias.find(cat => cat.nombre === nombre);
    return categoria ? categoria.id : 0;
  };

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    if (initialData) {
      // Convertir el nombre de categoría a ID
      const categoriaId = typeof initialData.categoria === 'string' 
        ? getCategoriaIdByName(initialData.categoria)
        : initialData.categoria || 0;

      reset({
        categoria: categoriaId,
        monto: initialData.monto || 0,
        fecha: initialData.fecha ? new Date(initialData.fecha).toISOString().slice(0, 16) : '',
        descripcion: initialData.descripcion || '',
        nota: initialData.nota || '',
        recurrente: Boolean(initialData.recurrente)
      });
    }
  }, [initialData, reset, categorias]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const selectedCategoria = categorias.find(c => c.id === data.categoria);
      
      const transactionData: Omit<Transaccion, 'id'> = {
        ...data,
        tipo: selectedCategoria?.tipo || 'G',
        nota: data.nota || '',
        categoria: selectedCategoria?.id || 0
      };

      let result;
      if (initialData?.id) {
        result = await updateTransaccion(initialData.id, transactionData);
      } else {
        result = await createTransaccion(transactionData);
      }

      if (result) {
        onSuccess?.(); // Solo se cierra después de esta ejecución
        console.log('Transacción guardada exitosamente');
      } else {
        console.error('Error al guardar transacción:', error);
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
        <FormControl fullWidth sx={{ minWidth: 200 }} error={!!errors.categoria}>
          <InputLabel id="categoria-label">Categoría *</InputLabel>
          <Select
            labelId="categoria-label"
            label="Categoría *"
            value={watch('categoria')}
            onChange={(e) => setValue('categoria', Number(e.target.value), { shouldValidate: true })}
            disabled={loading || isSubmitting}
          >
            <MenuItem value={0} disabled>
              Seleccione una categoría
            </MenuItem>
            {categorias.map((cat) => (
              <MenuItem 
                key={cat.id} 
                value={cat.id}
                sx={{ color: cat.color }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaidIcon 
                    sx={{ 
                      color: cat.color,
                      transform: cat.tipo === 'G' ? 'rotate(180deg)' : 'none' 
                    }} 
                  />
                  {cat.nombre}
                </Box>
              </MenuItem>
            ))}
          </Select>
          {errors.categoria && (
            <Typography variant="caption" color="error">
              {errors.categoria.message}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="Monto *"
          type="number"
          fullWidth
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: '$',
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
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
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

        <TextField
          label="Descripción *"
          fullWidth
          sx={{ minWidth: 200 }}
          error={!!errors.descripcion}
          helperText={errors.descripcion?.message}
          disabled={loading || isSubmitting}
          {...register('descripcion')}
        />
      </Box>

      <TextField
        label="Notas (Opcional)"
        multiline
        rows={4}
        fullWidth
        error={!!errors.nota}
        helperText={errors.nota?.message}
        disabled={loading || isSubmitting}
        {...register('nota')}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={watch('recurrente')}
            {...register('recurrente')}
            color="primary"
            disabled={loading || isSubmitting}
          />
        }
        label="Transacción recurrente"
        sx={{ mb: 3 }}
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
            {initialData?.id ? 'Actualizar' : 'Guardar'}
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
            {initialData?.id ? 'Actualizar' : 'Guardar'}
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