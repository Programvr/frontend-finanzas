import { SearchEmailForm } from '../../components/auth/AdministrationForm';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const AdministrationPage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.administrationPageContainer}>
      <Box sx={theme.customStyles.administrationFormContainer}>
        <SearchEmailForm />
      </Box>
    </Box>
  );
};