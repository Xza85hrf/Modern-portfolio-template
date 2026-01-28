import logger from './logger';

/**
 * Database error types that are transient and can be retried
 */
const TRANSIENT_ERRORS = [
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'ENETUNREACH',
  'fetch failed',
  'Error connecting to database',
];

/**
 * Check if an error is transient (network-related) and can be retried
 */
export function isTransientError(error: unknown): boolean {
  if (!error) return false;

  const errorStr = String(error);
  const errorMessage = error instanceof Error ? error.message : errorStr;

  return TRANSIENT_ERRORS.some(code =>
    errorMessage.includes(code) || errorStr.includes(code)
  );
}

/**
 * Wrap a database operation with retry logic for transient errors
 * @param operation - The async database operation to execute
 * @param options - Retry options
 * @returns The result of the operation
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    operationName?: string;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, operationName = 'Database operation' } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isTransientError(error) || attempt === maxRetries) {
        // Non-transient error or final attempt - don't retry
        throw error;
      }

      logger.warn(
        `${operationName} failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`,
        { error: error instanceof Error ? error.message : String(error) }
      );

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
}

/**
 * Safe database query wrapper that catches errors and returns a default value
 * Useful for non-critical queries that shouldn't crash the server
 */
export async function safeQuery<T>(
  operation: () => Promise<T>,
  defaultValue: T,
  operationName: string = 'Database query'
): Promise<T> {
  try {
    return await withRetry(operation, { operationName });
  } catch (error) {
    logger.error(`${operationName} failed after retries:`, error);
    return defaultValue;
  }
}
