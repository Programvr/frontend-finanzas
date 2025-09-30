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
import { Add, Close, Edit, Delete, Calculate } from '@mui/icons-material';
import { ObjetivoAhorroForm } from './ObjetivoAhorroForm';
import { SimulacionAhorroForm } from './SimulacionAhorroForm'; // Nuevo componente
import { useObjetivoAhorros } from './ObjetivoAhorroContext';
import { ObjetivoAhorro } from '../../services/objetivoAhorro/objetivoAhorroService';

export const ObjetivoAhorroModalButton = () => {
  const [openObjetivo, setOpenObjetivo] = useState(false);
  const [openSimulacion, setOpenSimulacion] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    objetivoAhorros,
    loading,
    error,
    fetchObjetivoAhorros,
    deleteObjetivoAhorro,
    cuentas,
    clearError,
    clearMessage
  } = useObjetivoAhorros();

  const [currentObjetivoAhorro, setCurrentObjetivoAhorro] = useState<ObjetivoAhorro | null>(null);

  useEffect(() => {
    fetchObjetivoAhorros();
  }, [fetchObjetivoAhorros]);

  const handleOpenObjetivo = () => {
    clearError();
    clearMessage();
    setCurrentObjetivoAhorro(null);
    setOpenObjetivo(true);
  };

  const handleCloseObjetivo = () => {
    if (!error) {
      clearError();
      clearMessage();
      setOpenObjetivo(false);
    }
  };

  const handleOpenSimulacion = () => {
    clearError();
    clearMessage();
    setOpenSimulacion(true);
  };

  const handleCloseSimulacion = () => {
    if (!error) {
      clearError();
      clearMessage();
      setOpenSimulacion(false);
    }
  };

  const handleEdit = (objetivoAhorro: ObjetivoAhorro) => {
    setCurrentObjetivoAhorro(objetivoAhorro);
    setOpenObjetivo(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este Objetivo de ahorro?')) {
      await deleteObjetivoAhorro(id);
      fetchObjetivoAhorros();
    }
  };

  const handleSuccessObjetivo = () => {
    clearError();
    clearMessage();
    setOpenObjetivo(false);
    fetchObjetivoAhorros();
  };

  const handleSuccessSimulacion = (resultado: any) => {
    console.log('Resultado de simulación:', resultado);
    // Aquí puedes usar el resultado para crear un objetivo automáticamente si quieres
    // handleCloseSimulacion(); // Opcional: cerrar modal después de simular
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
      {/* Botones en línea */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        {/* Botón de simulación */}
        <Button
          variant="contained"
          color="success"
          startIcon={<Calculate />}
          onClick={handleOpenSimulacion}
          sx={{
            backgroundColor: '#190ae6ff',
            '&:hover': {
              backgroundColor: '#190ae6ff',
              boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
            },
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '8px 16px',
            minWidth: '200px'
          }}
        >
          <Typography variant="button">Nueva Simulación De Ahorro</Typography>
        </Button>

        {/* Botón de objetivo de ahorro */}
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={handleOpenObjetivo}
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
          <Typography variant="button">Nuevo Objetivo De Ahorro</Typography>
        </Button>
      </Box>

      {/* Tabla de objetivos de ahorro */}
      {loading && !objetivoAhorros.length ? (
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
                <TableCell>MontoObjetivo</TableCell>
                <TableCell>MontoActual</TableCell>
                <TableCell>FechaObjetivo</TableCell>
                <TableCell>Completado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {objetivoAhorros.map((objetivoAhorro) => (
                <TableRow key={objetivoAhorro.id}>
                  <TableCell>{objetivoAhorro.nombre}</TableCell>
                  <TableCell sx={{ color: 'green'}}>${objetivoAhorro.montoObjetivo.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: 'green'}}>${objetivoAhorro.montoActual.toFixed(2)}</TableCell>
                  <TableCell>{objetivoAhorro.fechaObjetivo}</TableCell>
                  <TableCell>{objetivoAhorro.completado ? '✔️' : '❌'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(objetivoAhorro)}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => objetivoAhorro.id && handleDelete(objetivoAhorro.id)}
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

      {/* Modal para Simulación de Ahorro */}
      <Dialog
        open={openSimulacion}
        onClose={handleCloseSimulacion}
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
              Simulación de Ahorro
            </Typography>
            <IconButton 
              edge="end" 
              onClick={handleCloseSimulacion}
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
            <SimulacionAhorroForm 
              onSuccess={handleSuccessSimulacion}
              onCancel={handleCloseSimulacion}
              isModal={true}
              loading={loading}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal para Objetivos de Ahorro */}
      <Dialog
        open={openObjetivo}
        onClose={handleCloseObjetivo}
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
              {currentObjetivoAhorro ? 'Editar Objetivo De Ahorro' : 'Nuevo Objetivo De Ahorro'}
            </Typography>
            <IconButton 
              edge="end" 
              onClick={handleCloseObjetivo}
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
            <ObjetivoAhorroForm 
              initialData={currentObjetivoAhorro || undefined}
              onSuccess={handleSuccessObjetivo}
              onCancel={handleCloseObjetivo}
              isModal={true}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};