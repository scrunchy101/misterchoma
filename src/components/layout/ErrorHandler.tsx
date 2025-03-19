
import React, { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorHandlerProps {
  children: ReactNode;
}

const GlobalErrorFallback = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2 text-white">Application Error</h2>
        <p className="text-gray-300 mb-6">
          We've encountered an unexpected error. This could be due to a network issue or a problem with our application.
        </p>
        <div className="space-y-4">
          <Button 
            onClick={handleReload} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Reload Application
          </Button>
          <p className="text-gray-400 text-sm">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ErrorHandler = ({ children }: ErrorHandlerProps) => {
  return (
    <ErrorBoundary fallback={<GlobalErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};
