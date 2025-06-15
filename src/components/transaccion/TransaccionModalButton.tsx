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
import { TransaccionForm } from './TransaccionForm';
import { useTransacciones } from './TransaccionContext';
import { Transaccion } from '../../services/transaccion/transaccionService';

export const TransaccionModalButton = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    transacciones,
    loading,
    error,
    fetchTransacciones,
    deleteTransaccion,
    categorias,
    clearError,
    clearMessage
  } = useTransacciones();

  const [currentTransaccion, setCurrentTransaccion] = useState<Transaccion | null>(null);

  useEffect(() => {
    fetchTransacciones();
  }, [fetchTransacciones]);

  const handleOpen = () => {
    clearError();
    clearMessage();
    setCurrentTransaccion(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (!error) {
      clearError();
      clearMessage();
      setOpen(false);
    }
  };

  const handleEdit = (transaccion: Transaccion) => {
    setCurrentTransaccion(transaccion);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
      await deleteTransaccion(id);
      fetchTransacciones();
    }
  };

  const handleSuccess = () => {
    clearError();
    clearMessage();
    setOpen(false);
    fetchTransacciones();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categorias.find(c => c.id === categoryId);
    return category ? category.nombre : 'Desconocida';
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      {/* Botón de agregar nueva transacción */}
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
          <Typography variant="button">Nueva Transacción</Typography>
        </Button>
      </Box>

      {/* Tabla de transacciones */}
      {loading && !transacciones.length ? (
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
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Nota</TableCell>
                <TableCell>Recurrente</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transacciones.map((transaccion) => (
                <TableRow key={transaccion.id}>
                  <TableCell>{formatDateTime(transaccion.fecha)}</TableCell>
                  <TableCell>{transaccion.descripcion}</TableCell>
                  <TableCell>{getCategoryName(transaccion.categoria)}</TableCell>
                  <TableCell sx={{ color: transaccion.tipo === 'I' ? 'green' : 'red' }}>
                    {transaccion.tipo === 'I' ? '+' : '-'}${transaccion.monto.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaccion.tipo === 'I' ? 'Ingreso' : 'Gasto'}</TableCell>
                  <TableCell>{transaccion.nota || '-'}</TableCell>
                  <TableCell>{transaccion.recurrente ? '✔️' : '❌'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(transaccion)}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => transaccion.id && handleDelete(transaccion.id)}
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

      {/* Modal para agregar/editar transacciones */}
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
              {currentTransaccion ? 'Editar Transacción' : 'Nueva Transacción'}
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
            <TransaccionForm 
              initialData={currentTransaccion || undefined}
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