
import { PostgrestError, AuthError } from "@supabase/supabase-js";
import React from "react";

/**
 * Extracts a user-friendly message from a Supabase error
 */
export const getSupabaseErrorMessage = (error: PostgrestError | AuthError | any): string => {
  // Handle PostgrestError
  if ('code' in error && 'message' in error && 'details' in error) {
    // Format PostgrestError in a more readable way
    if (error.details) {
      return `${error.message} (${error.details})`;
    }
    return error.message;
  }
  
  // Handle AuthError
  if ('message' in error && 'status' in error) {
    return error.message;
  }

  // Fallback for unexpected error formats
  return error?.message || String(error) || "An unexpected error occurred";
};

/**
 * Determines if an error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return (
    error instanceof TypeError && 
    (error.message.includes("network") || error.message.includes("fetch"))
  ) || !navigator.onLine;
};

/**
 * Formats an error for logging
 */
export const formatErrorForLogging = (error: any, context: string = ""): string => {
  const timestamp = new Date().toISOString();
  const errorMessage = error?.message || String(error);
  const stack = error?.stack || "No stack trace available";
  
  return `[${timestamp}] Error${context ? ` in ${context}` : ""}: ${errorMessage}\n${stack}`;
};

/**
 * Safely executes a promise and returns a tuple with [data, error]
 */
export const safeAsync = async <T>(promise: Promise<T>): Promise<[T | null, Error | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err instanceof Error ? err : new Error(String(err))];
  }
};

/**
 * HOC to wrap components with error boundary
 * This is a factory function that returns a higher-order component
 * without using JSX directly in the .ts file
 */
export const withErrorBoundary = (Component: React.ComponentType<any>, fallbackElement?: React.ReactNode) => {
  // Create a wrapper component
  const WithErrorBoundary = (props: any) => {
    // Dynamically import ErrorBoundary to avoid jsx in .ts files
    return React.createElement(
      require("@/components/ui/error-boundary").ErrorBoundary,
      { fallback: fallbackElement },
      React.createElement(Component, props)
    );
  };
  
  WithErrorBoundary.displayName = `WithErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  return WithErrorBoundary;
};
