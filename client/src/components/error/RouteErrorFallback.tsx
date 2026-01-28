import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/layout/GlassCard";
import { getErrorMessage } from "@/lib/errorLogger";

interface RouteErrorFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * Full-page error fallback for route-level errors.
 * Displayed when a page fails to load or crashes.
 */
export function RouteErrorFallback({ error, reset }: RouteErrorFallbackProps) {
  const userMessage = getErrorMessage(error);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard
          variant="bordered"
          hover={false}
          className="p-8 max-w-md text-center"
        >
          {/* Error icon */}
          <motion.div
            className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </motion.div>

          {/* Error message */}
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{userMessage}</p>

          {/* Show technical details in development */}
          {import.meta.env.DEV && (
            <details className="mb-6 text-left">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Technical details
              </summary>
              <pre className="mt-2 p-3 bg-muted/50 rounded-md text-xs overflow-auto max-h-32">
                {error.message}
                {"\n"}
                {error.stack}
              </pre>
            </details>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
