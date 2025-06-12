import { useState, useEffect } from 'react';
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
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Snackbar
} from '@mui/material';
import { useAdministration } from './AdministrationContext';

const schema = z.object({
  email: z.string().email('Email inválido').min(1, 'Requerido'),
});

export const SearchEmailForm = () => {
  const { 
    userData, 
    allRoles,
    messageUpdate, 
    loading, 
    error, 
    searchUserByEmail, 
    updateUserRoles,
    activateUser,
    deactivateUser,
    clearError 
  } = useAdministration();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (userData?.roleIds) {
      setSelectedRoles(userData.roleIds);
    } else {
      setSelectedRoles([]);
    }
  }, [userData]);

  const onSubmit = async ({ email }: { email: string }) => {
    setSuccessMessage(null);
    await searchUserByEmail(email);
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.indexOf(roleId) !== -1  
        ? prev.filter(id => id !== roleId) 
        : [...prev, roleId]
    );
  };

  const handleUpdate = async () => {
    try {
      const result = await updateUserRoles(selectedRoles);
      setSuccessMessage(messageUpdate || "Roles actualizados correctamente");
      setSnackbarOpen(true);
    } catch (err) {
      // Error manejado por el contexto
    }
  };

  const handleToggleStatus = async () => {
    if (!userData?.id) return;
    try {
      let result;
      if (userData.activo) {
        result = await deactivateUser(userData.id);
      } else {
        result = await activateUser(userData.id);
      }
      setSuccessMessage(messageUpdate || (userData.activo ? "Usuario desactivado" : "Usuario activado"));
      setSnackbarOpen(true);
      await searchUserByEmail(userData.email);
    } catch (err) {
      
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administración de Usuarios
      </Typography>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Email del usuario"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 2 }}
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Buscar Usuario
        </Button>
      </form>

      {userData && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Usuario encontrado: {userData.email}
            </Typography>
            <Button
                variant="contained"
                color={userData.activo ? 'error' : 'success'}
                onClick={handleToggleStatus}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ 
                    mt: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                    transform: 'scale(1.05)'
                }
                }}
            >
              {userData.activo ? 'Desactivar Usuario' : 'Activar Usuario'}
            </Button>
          </Box>

          <Typography variant="body1" gutterBottom>
            Estado: {userData.activo ? 'Activo' : 'Inactivo'}
          </Typography>

          <FormControl component="fieldset" fullWidth sx={{ mt: 3 }}>
            <FormLabel component="legend">Roles asignados</FormLabel>
            <FormGroup>
              {allRoles.map(role => (
                <FormControlLabel
                  key={role.id}
                  control={
                    <Checkbox
                      checked={selectedRoles.indexOf(role.id) !== -1}
                      onChange={() => handleRoleChange(role.id)}
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight="bold">{role.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {role.descripcion}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Roles actualmente seleccionados:
            </Typography>
            {selectedRoles.length > 0 ? (
              <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #eee', borderRadius: 1 }}>
                {selectedRoles.map(roleId => {
                  const role = allRoles.find(r => r.id === roleId);
                  return role ? (
                    <ListItem key={roleId} divider>
                      <ListItemText 
                        primary={role.nombre}
                        secondary={role.descripcion}
                      />
                    </ListItem>
                  ) : null;
                })}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay roles seleccionados
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 3 }}
          >
            Actualizar Roles
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};