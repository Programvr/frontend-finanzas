import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import { Add, Close, Edit, Delete } from '@mui/icons-material';
import { CuentaForm } from './CuentaForm';
import { useCuentas } from './CuentaContext';
import { Cuenta } from '../../services/cuenta/cuentaService';

export const CuentaModalButton = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    cuentas,
    loading,
    error,
    fetchCuentas,
    deleteCuenta,
    clearError,
    clearMessage
  } = useCuentas();

  const [currentCuenta, setCurrentCuenta] = useState<Cuenta | null>(null);

  useEffect(() => {
    fetchCuentas();
  }, [fetchCuentas]);

  const handleOpen = () => {
    clearError();
    clearMessage();
    setCurrentCuenta(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (!error) {
      clearError();
      clearMessage();
      setOpen(false);
    }
  };

  const handleEdit = (cuenta: Cuenta) => {
    setCurrentCuenta(cuenta);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta cuenta?')) {
      await deleteCuenta(id);
      fetchCuentas();
    }
  };

  const handleSuccess = () => {
    clearError();
    clearMessage();
    setOpen(false);
    fetchCuentas();
  };


  return (
    <Box sx={{ marginTop: 4 }}>
      {/* Botón de agregar nueva cuenta */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#388E3C',
              boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
            },
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '8px 16px',
            minWidth: '200px'
          }}
        >
          <Typography variant="button">Nueva Cuenta</Typography>
        </Button>
      </Box>

      {/* Tabla de cuentas */}
      {loading && !cuentas.length ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Saldo Inicial</TableCell>
                <TableCell>Saldo Actual</TableCell>
                <TableCell>Moneda</TableCell>
                <TableCell>Activa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cuentas.map((cuenta) => (
                <TableRow key={cuenta.id}>
                  <TableCell>{cuenta.nombre}</TableCell>
                  <TableCell>{cuenta.tipo}</TableCell>
                  <TableCell sx={{ color: 'green'}}>${cuenta.saldoInicial.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: 'green'}}>${cuenta.saldoActual.toFixed(2)}</TableCell>
                  <TableCell>{cuenta.moneda}</TableCell>
                  <TableCell>{cuenta.activa ? '✔️' : '❌'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(cuenta)}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => cuenta.id && handleDelete(cuenta.id)}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal para agregar/editar cuentas */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : '12px',
            padding: fullScreen ? 0 : '16px'
          }
        }}
      >
        <DialogTitle>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            paddingRight={fullScreen ? 0 : 2}
          >
            <Typography variant="h6" fontWeight="bold">
              {currentCuenta ? 'Editar Cuenta' : 'Nueva Cuenta'}
            </Typography>
            <IconButton 
              edge="end" 
              onClick={handleClose}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary
                }
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        {error && (
          <Box sx={{ px: 3 }}>
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          </Box>
        )}

        <DialogContent dividers sx={{ paddingTop: '20px' }}>
          <Box sx={{
            maxHeight: fullScreen ? 'calc(100vh - 120px)' : '70vh',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            <CuentaForm 
              initialData={currentCuenta || undefined}
              onSuccess={handleSuccess}
              onCancel={handleClose}
              isModal={true}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};