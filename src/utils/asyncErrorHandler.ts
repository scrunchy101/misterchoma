
import { useState, useCallback } from "react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { ErrorSeverity } from "@/hooks/useErrorHandler";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface AsyncOptions {
  showToast?: boolean;
  severity?: ErrorSeverity;
  context?: string;
}

/**
 * Hook for handling async functions with built-in error handling
 */
export const useAsyncHandler = <T,>(initialData: T | null = null) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null
  });
  const { handleError } = useErrorHandler();

  const execute = useCallback(
    async (asyncFn: () => Promise<T>, options?: AsyncOptions) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const data = await asyncFn();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState(prev => ({ ...prev, loading: false, error: errorObj }));
        handleError(errorObj, options);
        return null;
      }
    },
    [handleError]
  );

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset
  };
};

/**
 * Utility function to wrap a promise with a loading state and error handling
 * @returns An array with [data, loading, error, execute, reset]
 */
export const createAsyncHandler = <T,>(
  asyncFn: (...args: any[]) => Promise<T>,
  errorHandler?: (error: Error) => void
) => {
  return async (...args: any[]): Promise<[T | null, boolean, Error | null]> => {
    try {
      const result = await asyncFn(...args);
      return [result, false, null];
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      if (errorHandler) {
        errorHandler(errorObj);
      } else {
        console.error(errorObj);
      }
      return [null, false, errorObj];
    }
  };
};
