import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePassword } from './PasswordContext';
import { useAuth } from './AuthContext';
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
import { Password, Visibility, VisibilityOff } from '@mui/icons-material';

// Esquema de validación mejorado (Punto 9)
const passwordSchema = z.object({
  currentPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede exceder los 50 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    ),
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede exceder los 50 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    ),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export const PasswordForm = () => {
  const { password, message,  clearMessage } = usePassword();
  const { token, nombre, email, idUsuario, logout } = useAuth(); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange', 
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await password(Number(idUsuario), data.currentPassword, data.newPassword);
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
        Cambiar Contraseña
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
        label="Contraseña Actual"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        variant="outlined"
        {...register('currentPassword')}
        error={!!errors.currentPassword}
        helperText={errors.currentPassword?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={toggleShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          autoComplete: 'current-password',
        }}
        sx={{ mb: 3 }}
      />
      <TextField
        label="Contraseña Nueva"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        variant="outlined"
        {...register('newPassword')}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={toggleShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          autoComplete: 'current-password',
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
        {isLoading ? 'Actualizando Contraseña...' : 'Actualizar Contraseña'}
      </Button>

    </Box>
  );
};