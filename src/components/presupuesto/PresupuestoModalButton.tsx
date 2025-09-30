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
import { PresupuestoForm } from './PresupuestoForm';
import { usePresupuestos } from './PresupuestoContext';
import { Presupuesto } from '../../services/presupuesto/presupuestoService';

export const PresupuestoModalButton = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    presupuestos,
    loading,
    error,
    fetchPresupuestos,
    deletePresupuesto,
    categorias,
    clearError,
    clearMessage
  } = usePresupuestos();

  const [currentPresupuesto, setCurrentPresupuesto] = useState<Presupuesto | null>(null);

  useEffect(() => {
    fetchPresupuestos();
  }, [fetchPresupuestos]);

  const handleOpen = () => {
    clearError();
    clearMessage();
    setCurrentPresupuesto(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (!error) {
      clearError();
      clearMessage();
      setOpen(false);
    }
  };

  const handleEdit = (presupuesto: Presupuesto) => {
    setCurrentPresupuesto(presupuesto);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este presupuesto?')) {
      await deletePresupuesto(id);
      fetchPresupuestos();
    }
  };

  const handleSuccess = () => {
    clearError();
    clearMessage();
    setOpen(false);
    fetchPresupuestos();
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
      {/* Botón de agregar nueva presupuesto */}
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
            textPresuform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '8px 16px',
            minWidth: '200px'
          }}
        >
          <Typography variant="button">Nuevo Presupuesto</Typography>
        </Button>
      </Box>

      {/* Tabla de presupuestos */}
      {loading && !presupuestos.length ? (
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
                <TableCell>Periodo</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presupuestos.map((presupuesto) => (
                <TableRow key={presupuesto.id}>
                  <TableCell>{presupuesto.periodo}</TableCell>
                  <TableCell>{presupuesto.categoria}</TableCell>
                  <TableCell sx={{ color: presupuesto.tipo === 'I' ? 'green' : 'red' }}>
                    {presupuesto.tipo === 'I' ? '+' : '-'}${presupuesto.monto.toFixed(2)}
                  </TableCell>
                  <TableCell>{presupuesto.tipo === 'I' ? 'Ingreso' : 'Gasto'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(presupuesto)}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => presupuesto.id && handleDelete(presupuesto.id)}
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

      {/* Modal para agregar/editar presupuestos */}
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
              {currentPresupuesto ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
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
            <PresupuestoForm 
              initialData={currentPresupuesto || undefined}
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