import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Avatar, IconButton, Menu, MenuItem, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Importa el ícono de Dashboard

import { AdminPanelSettings, PaidOutlined } from '@mui/icons-material';
import { DateRangeIcon } from '@mui/x-date-pickers';


export const AuthenticatedLayout = () => {
  const { token, nombre, email, idUsuario, logout } = useAuth(); 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  // Extraer el nombre del email (parte antes del @) para mostrar en el avatar
  const usernameFromEmail = email?.split('@')[0] || 'Usuario';

  return (
    <>
      <AppBar position="static" sx={{ 
        backgroundColor: 'white', 
        color: 'black', 
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          minHeight: '64px'
        }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 2 }}>
              FinanzasApp
            </Typography>
            <Button
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                color: 'black',
                textTransform: 'none',
                fontWeight: 'normal',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Dashboard
            </Button>
            <Button
              startIcon={< DateRangeIcon />}
              onClick={() => navigate('/informes')}
              sx={{
                color: 'black',
                textTransform: 'none',
                fontWeight: 'normal',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Informes
            </Button>
            <Button

              startIcon={<PaidOutlined />}
              onClick={() => navigate('/transacciones')}
              sx={{
                color: 'black',
                textTransform: 'none',
                fontWeight: 'normal',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Transacciones
            </Button>
            <Button

              startIcon={<AdminPanelSettings />}
              onClick={() => navigate('/administration')}
              sx={{
                color: 'black',
                textTransform: 'none',
                fontWeight: 'normal',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Administración
            </Button>
          </Box>
          
          {token && (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ mr: 2 }}>
                {nombre}
              </Typography>
              <IconButton 
                onClick={handleMenuOpen} 
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    bgcolor: '#3f51b5',
                    color: 'white'
                  }}
                  alt={usernameFromEmail}
                >
                  {usernameFromEmail.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 1,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: '8px',
                    '& .MuiMenuItem-root': {
                      fontSize: '0.875rem',
                      padding: '8px 16px'
                    }
                  }
                }}
              >
                <MenuItem onClick={() => handleNavigation('/profile')}>
                  Mi Perfil
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/change-password')}>
                  Cambiar Contraseña
                </MenuItem>
                <MenuItem onClick={logout}>
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Box 
        component="main" 
        sx={{ 
          p: 3,
          flexGrow: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};