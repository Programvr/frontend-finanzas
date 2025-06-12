import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile } from './ProfileContext';
import { useAuth } from '../auth/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  Link,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Esquema de validación mejorado (Punto 9)
const profileSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z.string()
    .email('Debe ingresar un email válido')
    .min(1, 'El email es requerido')
    .max(100, 'El email no puede exceder los 100 caracteres')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El formato del email no es válido'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const { profile, message,  clearMessage } = useProfile();
  const { token, nombre, email, idUsuario, logout } = useAuth(); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange', 
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await profile(Number(idUsuario), data.nombre, data.email);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Ocurrió un error al actualizar los datos. Por favor intente nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
      noValidate
      autoComplete="off"
    >
      <Typography 
        variant="h5" 
        component="h1" 
        gutterBottom 
        textAlign="center"
        sx={{ fontWeight: 'bold' }}
      >
        Actualizar Perfil
      </Typography>
      
      {}
      {message && (
        <Alert 
          severity="success"
          sx={{ mb: 2 }}
          onClose={clearMessage}
        >
          {message}
        </Alert>
      )}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <TextField
        label="Nombre"
        type="text"
        fullWidth
        margin="normal"
        variant="outlined"
        autoFocus
        {...register('nombre')}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        InputProps={{
          autoComplete: 'username',
        }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        variant="outlined"
        autoFocus
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        InputProps={{
          autoComplete: 'username',
        }}
        sx={{ mb: 3 }}
      />

      

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{ 
          mt: 2, 
          mb: 2,
          py: 1.5,
          fontWeight: 'bold'
        }}
        disabled={isLoading || !isDirty || !isValid}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? 'Actualizando datos...' : 'Actualizar Datos'}
      </Button>

    </Box>
  );
};