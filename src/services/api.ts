import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000, 
});



const PUBLIC_ENDPOINTS = [
  '/auth/login',       
  '/auth/register'
];


api.interceptors.request.use((config) => {
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
    config.url?.startsWith(endpoint) 
  );

  
  if (!isPublicEndpoint) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No se encontró token para ruta protegida:', config.url);
      //window.location.href = '/login';
    }
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Error 401: No autorizado');
      localStorage.removeItem('token');
      //window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;