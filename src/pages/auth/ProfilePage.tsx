import { ProfileForm } from '../../components/auth/ProfileForm';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const ProfilePage = () => {
  const theme = useTheme();

  return (
    <Box sx={theme.customStyles.profilePageContainer}>
      <Box sx={theme.customStyles.profileFormContainer}>
        <ProfileForm />
      </Box>
    </Box>
  );
};