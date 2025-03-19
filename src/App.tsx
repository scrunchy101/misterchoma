
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import MenuManagement from './pages/MenuManagement';
import Inventory from './pages/Inventory';
import Reservations from './pages/Reservations';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import POS from './pages/POS';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import { ErrorProvider } from './components/layout/ErrorProvider';
import { GlobalErrorListener } from './components/layout/GlobalErrorListener';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <ErrorProvider>
              <GlobalErrorListener />
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'chef']}>
                    <MenuManagement />
                  </ProtectedRoute>
                } />
                <Route path="/inventory" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'chef']}>
                    <Inventory />
                  </ProtectedRoute>
                } />
                <Route path="/reservations" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'waiter']}>
                    <Reservations />
                  </ProtectedRoute>
                } />
                <Route path="/billing" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'cashier']}>
                    <Billing />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="/customers" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'waiter', 'cashier']}>
                    <Customers />
                  </ProtectedRoute>
                } />
                <Route path="/employees" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Employees />
                  </ProtectedRoute>
                } />
                <Route path="/pos" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'cashier', 'waiter']}>
                    <POS />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'chef', 'waiter']}>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </ErrorProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
