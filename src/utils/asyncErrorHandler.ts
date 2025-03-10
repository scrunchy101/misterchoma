
/**
 * A utility to wrap async functions with error handling
 * @param asyncFn The async function to execute
 * @param errorHandler Function to handle any errors
 * @returns A promise that resolves to the result of the async function
 */
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  errorHandler: (error: unknown) => void
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    errorHandler(error);
    return undefined;
  }
};

/**
 * A utility to add loading state management to async operations
 * @param asyncFn The async function to execute
 * @param setLoading Function to update loading state
 * @param errorHandler Function to handle any errors
 * @returns A promise that resolves to the result of the async function
 */
export const loadingAsync = async <T>(
  asyncFn: () => Promise<T>,
  setLoading: (isLoading: boolean) => void,
  errorHandler: (error: unknown) => void
): Promise<T | undefined> => {
  try {
    setLoading(true);
    return await asyncFn();
  } catch (error) {
    errorHandler(error);
    return undefined;
  } finally {
    setLoading(false);
  }
};
