import { jwtDecode } from "jwt-decode";

export interface LogError {
  (error: unknown): void;
}

export const logError: LogError = error => {
  console.error('Error:', error);
};

export const isNotEmptyObject = (
  obj: unknown
): obj is Record<string, unknown> => {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;
};

// Alternative function for use in contexts where cookies() is not available
export const getTokenSync = (): string | undefined => {
  if (typeof window !== 'undefined') {
    // client
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match?.[2];
  }
  // For server-side, return undefined if cookies() is not available
  return '';
};

export const apiAsyncHandler = async (
  handleTry: () => Promise<unknown>,
  handleCatch?: (error: unknown) => unknown,
  handleFinally?: () => void
) => {
  try {
    const response = await handleTry();
    return response;
  } catch (error) {
    logError(error);
    if (handleCatch && typeof handleCatch === 'function') {
      return handleCatch(error);
    }
    return null;
  } finally {
    if (handleFinally && typeof handleFinally === 'function') {
      handleFinally();
    }
  }
};

export const errorHandler = (
  handleTry: () => unknown,
  handleCatch?: (error: unknown) => unknown,
  handleFinally?: () => void
) => {
  try {
    const response = handleTry();
    return response;
  } catch (error) {
    logError(error);
    if (handleCatch && typeof handleCatch === 'function') {
      return handleCatch(error);
    }
    return null;
  } finally {
    if (handleFinally && typeof handleFinally === 'function') {
      handleFinally();
    }
  }
};

export const decodeToken = (token: string | null = null) => {
  if (!token) {
    return null;
  }
  const decoded = jwtDecode(token);
  return decoded;
};
