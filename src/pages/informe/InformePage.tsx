import { InformeSelector } from '../../components/informe/InformeForm';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const InformePage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.informePageContainer}>
      <Box sx={theme.customStyles.informeFormContainer}>
        <InformeSelector />
      </Box>
    </Box>
  );
};