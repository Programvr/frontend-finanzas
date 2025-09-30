import { CuentaModalButton } from '../../components/cuenta/CuentaModalButton';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const CuentaPage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.cuentaPageContainer}>
      <Box sx={theme.customStyles.cuentaFormContainer}>
        <CuentaModalButton />
      </Box>
    </Box>
  );
};