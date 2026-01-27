const isProduction = process.env.NODE_ENV === 'production';

// Simple structured logger that respects NODE_ENV
export const logger = {
  /**
   * Debug logs - only shown in development
   */
  debug: (message: string, data?: Record<string, unknown>) => {
    if (!isProduction) {
      console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
  },

  /**
   * Info logs - only shown in development
   */
  info: (message: string, data?: Record<string, unknown>) => {
    if (!isProduction) {
      console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
    }
  },

  /**
   * Warning logs - always shown
   */
  warn: (message: string, data?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
  },

  /**
   * Error logs - always shown with stack trace in dev
   */
  error: (message: string, error?: unknown) => {
    if (error instanceof Error) {
      console.error(`[ERROR] ${message}`, {
        message: error.message,
        ...(isProduction ? {} : { stack: error.stack }),
      });
    } else if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  },

  /**
   * Request logging - only in development
   */
  request: (method: string, path: string, statusCode: number, durationMs: number) => {
    if (!isProduction) {
      console.log(`[REQ] ${method} ${path} ${statusCode} in ${durationMs}ms`);
    }
  },
};

export default logger;
