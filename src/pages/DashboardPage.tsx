import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress, 
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Stack
} from '@mui/material';
import { DashboardResumen } from '../components/dashboard/DashboardResumen';
import { DashboardService } from '../services/dashboard/dashboardService';

export const DashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fechaActual = new Date();
  const [anio, setAnio] = useState<number>(fechaActual.getFullYear());
  const [mes, setMes] = useState<number>(fechaActual.getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await DashboardService.getResumenMensual(anio, mes);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [anio, mes]);

  const handleAnioChange = (event: any) => setAnio(event.target.value);
  const handleMesChange = (event: any) => setMes(event.target.value);

  if (loading && !data) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box display="flex" justifyContent="center" mt={4}><Alert severity="error">{error}</Alert></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Financiero
      </Typography>
      
      {/* Filtros con Flexbox */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2,
        mb: 3 
      }}>
        <Paper sx={{ 
          flex: 1,
          minWidth: 200,
          p: 2,
          flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' }
        }}>
          <FormControl fullWidth>
            <InputLabel>Año</InputLabel>
            <Select value={anio} label="Año" onChange={handleAnioChange}>
              <MenuItem value={2023}>2023</MenuItem>
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2025}>2025</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        <Paper sx={{ 
          flex: 1,
          minWidth: 200,
          p: 2,
          flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' }
        }}>
          <FormControl fullWidth>
            <InputLabel>Mes</InputLabel>
            <Select value={mes} label="Mes" onChange={handleMesChange}>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(2023, i, 1).toLocaleDateString('es-ES', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>

      {/* Resumen */}
      {data && (
        <>
          <DashboardResumen 
            ingresos={data.totalIngresos} 
            gastos={data.totalGastos} 
            balance={data.balance} 
          />

          {/* Estadísticas con Stack */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ mt: 3 }}
          >
            <Paper sx={{ 
              flex: 1,
              p: 2,
              minWidth: 0 // Evita desbordamiento
            }}>
              <Typography variant="h6" gutterBottom>
                Transacciones
              </Typography>
              <Typography>
                Ingresos: {data.resumenMensual.find((i: any) => i.tipo === 'I')?.cantidadTransacciones || 0}
              </Typography>
              <Typography>
                Gastos: {data.resumenMensual.find((i: any) => i.tipo === 'G')?.cantidadTransacciones || 0}
              </Typography>
            </Paper>

            <Paper sx={{ 
              flex: 1,
              p: 2,
              minWidth: 0
            }}>
              <Typography variant="h6" gutterBottom>
                Promedios
              </Typography>
              <Typography>
                Ingreso promedio: {(data.totalIngresos / (data.resumenMensual.find((i: any) => i.tipo === 'I')?.cantidadTransacciones || 1)).toLocaleString('es-CO', { 
                  style: 'currency', 
                  currency: 'COP' 
                })}
              </Typography>
              <Typography>
                Gasto promedio: {(data.totalGastos / (data.resumenMensual.find((i: any) => i.tipo === 'G')?.cantidadTransacciones || 1)).toLocaleString('es-CO', { 
                  style: 'currency', 
                  currency: 'COP' 
                })}
              </Typography>
            </Paper>
          </Stack>
        </>
      )}
    </Container>
  );
};