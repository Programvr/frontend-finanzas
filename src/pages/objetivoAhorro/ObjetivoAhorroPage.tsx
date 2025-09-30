import { ObjetivoAhorroModalButton } from '../../components/objetivoAhorro/ObjetivoAhorroModalButton';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const ObjetivoAhorroPage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.objetivoAhorroPageContainer}>
      <Box sx={theme.customStyles.objetivoAhorroFormContainer}>
        <ObjetivoAhorroModalButton />
      </Box>
    </Box>
  );
};