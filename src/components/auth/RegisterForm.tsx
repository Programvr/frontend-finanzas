import { useState } from 'react';
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
    IconButton,
    InputAdornment,
    Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { register as registerUser } from '../../services/authService'; // Importa la función register


const registerSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),
    email: z.string()
        .email('Debe ingresar un email válido')
        .min(1, 'El email es requerido')
        .max(100, 'El email no puede exceder los 100 caracteres')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El formato del email no es válido'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(50, 'La contraseña no puede exceder los 50 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            'Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await registerUser(data.name, data.email, data.password); // No necesitas el token aquí
            setSuccessMessage('Registro exitoso. Ahora puedes iniciar sesión.');

            /*setTimeout(() => {
                navigate('/login');
            }, 2000);*/
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Ocurrió un error al registrarse. Inténtalo nuevamente.'
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
                Crear Cuenta
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <TextField
                label="Nombre"
                fullWidth
                margin="normal"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
            />

            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
            />

            <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={toggleShowPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            <TextField
                label="Confirmar Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={{ mb: 3 }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || !isDirty || !isValid}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    fontWeight: 'bold'
                }}
            >
                {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>

            <Typography variant="body2" align="center">
                ¿Ya tienes cuenta?{' '}
                <Link
                    component={RouterLink}
                    to="/login"
                    sx={{ fontWeight: 'bold' }}
                >
                    Inicia sesión
                </Link>
            </Typography>
        </Box>
    );
};
