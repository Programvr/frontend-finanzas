import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { ResumenCard } from './ResumenCard';
import Chart from 'chart.js/auto';

interface DashboardResumenProps {
  ingresos: number;
  gastos: number;
  balance: number;
}

export const DashboardResumen: React.FC<DashboardResumenProps> = ({ 
  ingresos, 
  gastos, 
  balance 
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chartInstance = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Ingresos', 'Gastos', 'Balance'],
        datasets: [
          {
            label: 'Resumen',
            data: [ingresos, gastos, balance],
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(75, 192, 192, 0.5)'
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [ingresos, gastos, balance]);

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <ResumenCard 
          titulo="Ingresos" 
          valor={ingresos} 
          tipo="ingreso" 
        />
        <ResumenCard 
          titulo="Gastos" 
          valor={gastos} 
          tipo="gasto" 
        />
        <ResumenCard 
          titulo="Balance" 
          valor={balance} 
          tipo="balance" 
        />
      </Box>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <canvas ref={chartRef} />
      </Box>
    </Box>
  );
};