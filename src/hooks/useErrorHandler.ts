
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseErrorMessage, isNetworkError, formatErrorForLogging } from "@/utils/errorUtils";

export type ErrorSeverity = "error" | "warning" | "info";

interface ErrorOptions {
  showToast?: boolean;
  severity?: ErrorSeverity;
  logToConsole?: boolean;
  context?: string;
}

const defaultOptions: ErrorOptions = {
  showToast: true,
  severity: "error",
  logToConsole: true,
  context: ""
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
      console.error(formatErrorForLogging(errorObj, mergedOptions.context || ""));
    }

    // Handle network errors with a specific message
    if (isNetworkError(errorObj)) {
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive"
      });
      return errorObj;
    }

    // Handle Supabase specific errors
    if (errorObj.message.includes("supabase") || 
        errorObj.name === "PostgrestError" || 
        errorObj.name === "AuthError") {
      const errorMessage = getSupabaseErrorMessage(errorObj);
      
      if (mergedOptions.showToast) {
        toast({
          title: mergedOptions.severity === "error" ? "Database Error" : 
                mergedOptions.severity === "warning" ? "Warning" : "Information",
          description: errorMessage,
          variant: mergedOptions.severity === "error" ? "destructive" : "default"
        });
      }
      return errorObj;
    }

    // Handle general errors
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

  // Wrap async functions with error handling
  const withErrorHandling = <T,>(
    asyncFn: () => Promise<T>,
    options?: ErrorOptions
  ): Promise<T> => {
    return asyncFn().catch(err => {
      handleError(err, options);
      throw err; // Re-throw to allow the caller to also handle if needed
    });
  };

  return { 
    error, 
    isError, 
    handleError, 
    clearError,
    withErrorHandling
  };
};
