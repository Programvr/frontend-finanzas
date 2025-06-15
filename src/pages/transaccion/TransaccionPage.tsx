import { TransaccionModalButton } from '../../components/transaccion/TransaccionModalButton';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const TransaccionPage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.transaccionPageContainer}>
      <Box sx={theme.customStyles.transaccionFormContainer}>
        <TransaccionModalButton />
      </Box>
    </Box>
  );
};