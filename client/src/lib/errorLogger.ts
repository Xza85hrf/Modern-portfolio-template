type ErrorLevel = "route" | "component" | "critical";

interface ErrorContext {
  level: ErrorLevel;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
}

/**
 * Centralized error logging utility.
 * In development, logs to console. In production, could send to error tracking service.
 */
export function logError(error: Error, context: ErrorContext): void {
  const errorData = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    level: context.level,
    componentStack: context.componentStack,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
  };

  // Always log to console in development
  if (import.meta.env.DEV) {
    console.group(`[ErrorBoundary] ${context.level} error`);
    console.error("Error:", error);
    console.log("Context:", errorData);
    console.groupEnd();
  }

  // In production, you could send to an error tracking service
  // Example: Sentry, LogRocket, etc.
  // if (import.meta.env.PROD) {
  //   sendToErrorTrackingService(errorData);
  // }
}

/**
 * Get a user-friendly error message based on the error type.
 */
export function getErrorMessage(error: Error): string {
  // Network errors
  if (error.message.includes("fetch") || error.message.includes("network")) {
    return "Unable to connect. Please check your internet connection.";
  }

  // Chunk loading errors (common with lazy loading)
  if (error.message.includes("Loading chunk") || error.message.includes("dynamically imported")) {
    return "Failed to load page. Please refresh and try again.";
  }

  // Generic fallback
  return "Something went wrong. Please try again.";
}
