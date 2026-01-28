import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComponentErrorFallbackProps {
  error: Error;
  reset: () => void;
  className?: string;
  compact?: boolean;
}

/**
 * Inline error fallback for component-level errors.
 * Displays within the component's space without taking over the page.
 */
export function ComponentErrorFallback({
  error,
  reset,
  className,
  compact = false,
}: ComponentErrorFallbackProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20",
          className
        )}
        role="alert"
      >
        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
        <span className="text-sm text-destructive">Failed to load</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="ml-auto h-7 px-2"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-xl",
        "bg-card/50 border border-border/50 text-center",
        className
      )}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        This section couldn't load
      </p>
      <Button variant="outline" size="sm" onClick={reset} className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Retry
      </Button>
    </div>
  );
}

/**
 * Fallback for 3D/heavy components that may fail to load.
 * Shows a static placeholder instead of the dynamic content.
 */
export function Critical3DErrorFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl",
        "bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5",
        "border border-border/30",
        className
      )}
      role="img"
      aria-label="Decorative element (failed to load)"
    >
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary/20" />
        </div>
        <p className="text-xs text-muted-foreground">Interactive element unavailable</p>
      </div>
    </div>
  );
}
