import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customStyles: {
      authPageContainer: React.CSSProperties;
      loginFormContainer: React.CSSProperties;
    };
  }
  interface ThemeOptions {
    customStyles?: {
      authPageContainer?: React.CSSProperties;
      loginFormContainer?: React.CSSProperties;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#a3afdc', // Naranja para botones o elementos destacados
    },
    secondary: {
      main: '#795548', // Marrón para elementos secundarios
    },
    background: {
      default: '#121212', // Fondo oscuro por defecto
      paper: '#1e1e1e', // Fondo para elementos como tarjetas o formularios
    },
    text: {
      primary: '#ffffff', // Texto blanco para contraste
      secondary: '#b0b0b0', // Texto secundario gris claro
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: '#ffffff', // Texto blanco en botones
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  customStyles: {
    authPageContainer: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("https://th.bing.com/th/id/R.b14e871c4508d395bc24b59b34da178e?rik=q7B5630dXd4ATg&pid=ImgRaw&r=0")', // Ruta directa a la imagen en línea
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    loginFormContainer: {
      width: '100%',
      maxWidth: '400px',
      padding: '20px',
      backgroundColor: '#b2b2b2', // Fondo oscuro para el formulario
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(92, 8, 8, 0.7)', // Sombra más pronunciada
      color: '#ffffff', // Texto blanco dentro del formulario
      border: '1px solidrgb(156, 97, 7)', // Borde naranja para resaltar
    },
  },
});