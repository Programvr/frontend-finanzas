import { AuthProvider } from './components/auth/AuthContext';
import { RegisterProvider } from './components/auth/RegisterContext';
import { ProfileProvider } from './components/auth/ProfileContext';
import { PasswordProvider } from './components/auth/PasswordContext';
import { AdministrationProvider } from './components/auth/AdministrationContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/auth/AuthPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthenticatedLayout } from './components/layout/AuthenticatedLayout';
import { ProfilePage } from './pages/auth/ProfilePage';
import { PasswordPage } from './pages/auth/PasswordPage';
import { AdministrationPage } from './pages/auth/AdministrationPage';
import { TransaccionProvider } from './components/transaccion/TransaccionContext';
import { TransaccionPage } from './pages/transaccion/TransaccionPage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <AuthProvider>{}
              <AuthPage />
            </AuthProvider>} />
          <Route path="/register" element={
              <RegisterProvider> {}
                <RegisterPage />
              </RegisterProvider>
            } />
          <Route element={
            <AuthProvider>{}
              <ProtectedRoute>
              <AuthenticatedLayout />
              </ProtectedRoute>
            </AuthProvider>
          }>
            <Route path="/dashboard" element={
              <AuthProvider>{}
                <DashboardPage />
              </AuthProvider>} />
            <Route path="/profile" element={
              <ProfileProvider>{}
                <ProfilePage />
              </ProfileProvider>} />
            <Route path="/change-password" element={
              <PasswordProvider>{}
                <PasswordPage />
              </PasswordProvider>} />
            <Route path="/administration" element={
              <AdministrationProvider>{}
                <AdministrationPage />
              </AdministrationProvider>} />
            <Route path="/transacciones" element={
              <TransaccionProvider>{}
                <TransaccionPage />
              </TransaccionProvider>} />
            </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;