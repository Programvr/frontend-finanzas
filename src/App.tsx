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
import { InformePage } from './pages/informe/InformePage';
import { InformeProvider } from './components/informe/InformeContext';
import { PresupuestoProvider } from './components/presupuesto/PresupuestoContext';
import { PresupuestoPage } from './pages/presupuesto/PresupuestoPage';
import { CuentaProvider } from './components/cuenta/CuentaContext';
import { CuentaPage } from './pages/cuenta/CuentaPage';
import { TransferenciaPage } from './pages/transferencia/TransferenciaPage';
import { TransferenciaProvider } from './components/transferencia/TransferenciaContext';
import { ObjetivoAhorroProvider } from './components/objetivoAhorro/ObjetivoAhorroContext';
import { ObjetivoAhorroPage } from './pages/objetivoAhorro/ObjetivoAhorroPage';


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

            <Route path="/transferencias" element={
              <TransferenciaProvider>{}
                <TransferenciaPage />
              </TransferenciaProvider>} />
            
            <Route path="/objetivosAhorro" element={
              <ObjetivoAhorroProvider>{}
                <ObjetivoAhorroPage />
              </ObjetivoAhorroProvider>} />

            <Route path="/cuentas" element={
              <CuentaProvider>{}
                <CuentaPage />
              </CuentaProvider>} />

            <Route path="/informes" element={
              <InformeProvider>{}
                <InformePage />
              </InformeProvider>} />
              
            <Route path="/presupuestos" element={
              <PresupuestoProvider>{}
                <PresupuestoPage />
              </PresupuestoProvider>} />
            
            </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;