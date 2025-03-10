
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type ErrorSeverity = "error" | "warning" | "info";

interface ErrorOptions {
  showToast?: boolean;
  severity?: ErrorSeverity;
  logToConsole?: boolean;
}

const defaultOptions: ErrorOptions = {
  showToast: true,
  severity: "error",
  logToConsole: true
};

export const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  const handleError = (err: unknown, options: ErrorOptions = defaultOptions) => {
    const mergedOptions = { ...defaultOptions, ...options };
    const errorObj = err instanceof Error ? err : new Error(String(err));
    
    setError(errorObj);
    setIsError(true);

    if (mergedOptions.logToConsole) {
      console.error("Error caught by useErrorHandler:", errorObj);
    }

    if (mergedOptions.showToast) {
      toast({
        title: mergedOptions.severity === "error" ? "Error" : 
               mergedOptions.severity === "warning" ? "Warning" : "Information",
        description: errorObj.message || "An unexpected error occurred",
        variant: mergedOptions.severity === "error" ? "destructive" : "default"
      });
    }

    return errorObj;
  };

  const clearError = () => {
    setError(null);
    setIsError(false);
  };

  return { 
    error, 
    isError, 
    handleError, 
    clearError 
  };
};
