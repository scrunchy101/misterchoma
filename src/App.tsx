
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorProvider } from "@/components/layout/ErrorProvider";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import MenuManagement from "./pages/MenuManagement";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Create a new QueryClient with error handling configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {}
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/reports" element={<Reports />} />
            {/* Redirect all reservations to the dashboard */}
            <Route path="/reservations" element={<Navigate to="/" replace />} />
            {/* Redirect removed routes to home */}
            <Route path="/pos" element={<Navigate to="/" replace />} />
            <Route path="/orders" element={<Navigate to="/" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
