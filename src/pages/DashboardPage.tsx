import React from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { Button, Box, Typography } from '@mui/material';

export const DashboardPage = () => {
    const { logout } = useAuth();

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Bienvenido al panel de control.
            </Typography>
            <Button variant="outlined" color="secondary" onClick={logout}>
                Cerrar sesión
            </Button>
        </Box>
    );
};
