import { PasswordForm } from '../../components/auth/PasswordForm';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const PasswordPage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.passwordPageContainer}>
      <Box sx={theme.customStyles.passwordFormContainer}>
        <PasswordForm />
      </Box>
    </Box>
  );
};