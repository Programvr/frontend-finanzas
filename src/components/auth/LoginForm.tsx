import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Esquema de validación mejorado (Punto 9)
const loginSchema = z.object({
  email: z.string()
    .email('Debe ingresar un email válido')
    .min(1, 'El email es requerido')
    .max(100, 'El email no puede exceder los 100 caracteres')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El formato del email no es válido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede exceder los 50 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Validar mientras se escribe
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Ocurrió un error al iniciar sesión. Por favor intente nuevamente.'
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
        Iniciar Sesión
      </Typography>
      
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
        sx={{ mb: 2 }}
      />

      <TextField
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        variant="outlined"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
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
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link 
          component={RouterLink} 
          to="/forgot-password" 
          variant="body2"
          sx={{ textDecoration: 'none' }}
        >
          ¿Olvidaste tu contraseña?
        </Link>
        
        <Typography variant="body2">
          ¿No tienes cuenta?{' '}
          <Link 
            component={RouterLink} 
            to="/register"
            sx={{ fontWeight: 'bold' }}
          >
            Regístrate
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};