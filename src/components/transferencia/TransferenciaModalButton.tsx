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
import { TransferenciaForm } from './TransferenciaForm';
import { useTransferencias } from './TransferenciaContext';
import { Transferencia } from '../../services/transferencia/transferenciaService';

export const TransferenciaModalButton = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    transferencias,
    loading,
    error,
    fetchTransferencias,
    deleteTransferencia,
    cuentas,
    clearError,
    clearMessage
  } = useTransferencias();

  const [currentTransferencia, setCurrentTransferencia] = useState<Transferencia | null>(null);

  useEffect(() => {
    fetchTransferencias();
  }, [fetchTransferencias]);

  const handleOpen = () => {
    clearError();
    clearMessage();
    setCurrentTransferencia(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (!error) {
      clearError();
      clearMessage();
      setOpen(false);
    }
  };

  const handleEdit = (transferencia: Transferencia) => {
    setCurrentTransferencia(transferencia);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta transferencia?')) {
      await deleteTransferencia(id);
      fetchTransferencias();
    }
  };

  const handleSuccess = () => {
    clearError();
    clearMessage();
    setOpen(false);
    fetchTransferencias();
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

  const getCuentaName = (cuentaId: number) => {
    const cuenta = cuentas.find(c => c.id === cuentaId);
    return cuenta ? cuenta.nombre : 'Desconocida';
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      {/* Botón de agregar nueva transferencia */}
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
          <Typography variant="button">Nueva Transferencia</Typography>
        </Button>
      </Box>

      {/* Tabla de transacciones */}
      {loading && !transferencias.length ? (
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
                <TableCell>CuentaOrigen</TableCell>
                <TableCell>CuentaDestino</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transferencias.map((transferencia) => (
                <TableRow key={transferencia.id}>
                  <TableCell>{formatDateTime(transferencia.fecha)}</TableCell>
                  <TableCell>{transferencia.descripcion}</TableCell>
                  <TableCell>{transferencia.cuentaOrigen}</TableCell>
                  <TableCell>{transferencia.cuentaDestino}</TableCell>
                  <TableCell sx={{ color: 'green'}}>${transferencia.monto.toFixed(2)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(transferencia)}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => transferencia.id && handleDelete(transferencia.id)}
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

      {/* Modal para agregar/editar transferencias */}
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
              {currentTransferencia ? 'Editar Transferencia' : 'Nueva Transferencia'}
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
            <TransferenciaForm 
              initialData={currentTransferencia || undefined}
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