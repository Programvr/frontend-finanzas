import { TransferenciaModalButton } from '../../components/transferencia/TransferenciaModalButton';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const TransferenciaPage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.transferenciaPageContainer}>
      <Box sx={theme.customStyles.transferenciaFormContainer}>
        <TransferenciaModalButton />
      </Box>
    </Box>
  );
};