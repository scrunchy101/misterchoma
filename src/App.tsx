
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Employees from "./pages/Employees";
import POS from "./pages/POS";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UIProvider } from "@/contexts/UIContext";
import { AuthProvider } from "@/contexts/AuthContext"; 
import DatabaseConnectionTest from "./pages/DatabaseConnectionTest";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <AuthProvider>
        <UIProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
              <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/database-test" element={<ProtectedRoute><DatabaseConnectionTest /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
