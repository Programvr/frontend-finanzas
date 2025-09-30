import {PresupuestoModalButton} from '../../components/presupuesto/PresupuestoModalButton';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const PresupuestoPage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.presupuestoPageContainer}>
      <Box sx={theme.customStyles.presupuestoFormContainer}>
        <PresupuestoModalButton />
      </Box>
    </Box>
  );
};