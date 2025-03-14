
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
import NotFound from './pages/NotFound';
import { ErrorProvider } from './components/layout/ErrorProvider';
import { GlobalErrorListener } from './components/layout/GlobalErrorListener';
import { ThemeProvider } from './components/layout/ThemeProvider';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <ErrorProvider>
            <GlobalErrorListener />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuManagement />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/pos" element={<POS />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </ErrorProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
