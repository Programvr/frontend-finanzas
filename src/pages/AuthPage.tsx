import { LoginForm } from '../components/auth/LoginForm';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const AuthPage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.authPageContainer}>
      <Box sx={theme.customStyles.loginFormContainer}>
        <LoginForm />
      </Box>
    </Box>
  );
};