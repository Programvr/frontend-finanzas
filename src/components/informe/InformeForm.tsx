import React, { useState, useContext } from 'react';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { InformeContext } from './InformeContext';

const tipos = [
  { value: 'excel', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
];

export const InformeSelector = () => {
  const [tipo, setTipo] = useState<'excel' | 'pdf'>('excel');
  const [fechaInicio, setFechaInicio] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);

  const { descargarInforme } = useContext(InformeContext);

  const handleDescargar = async () => {
    setLoading(true);
    try {
      await descargarInforme(tipo, fechaInicio, fechaFin);
    } catch (error) {
      alert('Error al descargar el informe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
      <TextField
        label="Fecha inicio"
        type="date"
        value={fechaInicio}
        onChange={e => setFechaInicio(e.target.value)}
        InputLabelProps={{ shrink: true }}
        size="small"
      />
      <TextField
        label="Fecha fin"
        type="date"
        value={fechaFin}
        onChange={e => setFechaFin(e.target.value)}
        InputLabelProps={{ shrink: true }}
        size="small"
      />
      <TextField
        select
        label="Tipo"
        value={tipo}
        onChange={e => setTipo(e.target.value as 'excel' | 'pdf')}
        size="small"
      >
        {tipos.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" onClick={handleDescargar} disabled={loading}>
        {loading ? 'Descargando...' : 'Descargar informe'}
      </Button>
    </Box>
  );
};