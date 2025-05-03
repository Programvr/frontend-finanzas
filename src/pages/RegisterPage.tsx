import { RegisterForm } from '../components/auth/RegisterForm';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const RegisterPage = () => {
    const theme = useTheme();

    return (
        <Box sx={theme.customStyles.authPageContainer}>
            <Box sx={theme.customStyles.loginFormContainer}>
                <RegisterForm />
            </Box>
        </Box>
    );
};
