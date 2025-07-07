import React from 'react';
import { Card, CardContent, Typography, Stack, useTheme } from '@mui/material';
import { ArrowUpward, ArrowDownward, AccountBalance } from '@mui/icons-material';

interface ResumenCardProps {
  titulo: string;
  valor: number;
  tipo: 'ingreso' | 'gasto' | 'balance';
}

export const ResumenCard: React.FC<ResumenCardProps> = ({ titulo, valor, tipo }) => {
  const theme = useTheme();
  
  const iconos = {
    ingreso: <ArrowUpward sx={{ color: theme.palette.success.main }} />,
    gasto: <ArrowDownward sx={{ color: theme.palette.error.main }} />,
    balance: <AccountBalance sx={{ color: theme.palette.info.main }} />
  };
  
  const colores = {
    ingreso: theme.palette.success.main,
    gasto: theme.palette.error.main,
    balance: valor >= 0 ? theme.palette.success.main : theme.palette.error.main
  };
  
  return (
    <Card sx={{ minWidth: 275, flexGrow: 1 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {iconos[tipo]}
          <Typography variant="h6" component="div">
            {titulo}
          </Typography>
        </Stack>
        <Typography variant="h4" sx={{ color: colores[tipo] }}>
          {valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
        </Typography>
      </CardContent>
    </Card>
  );
};