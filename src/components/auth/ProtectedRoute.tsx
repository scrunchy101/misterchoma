
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { session, profile, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have permission
  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center">
          You don't have permission to access this page. This page requires one of the following roles: {allowedRoles.join(", ")}.
        </p>
        <p className="text-gray-600 mb-6 text-center">
          Your current role: {profile.role}
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};
