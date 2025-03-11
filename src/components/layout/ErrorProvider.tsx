
import React, { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalErrorListener } from "./GlobalErrorListener";

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const errorFallback = (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-gray-900">
      <AlertTriangle size={64} className="text-yellow-500 mb-6" />
      <h1 className="text-2xl font-bold mb-4">Something Went Wrong</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        We've encountered an unexpected error. Please refresh the page to try again.
      </p>
      <Button onClick={() => window.location.reload()}>
        Refresh Page
      </Button>
    </div>
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <GlobalErrorListener />
      {children}
    </ErrorBoundary>
  );
};
