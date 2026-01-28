import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  message?: string;
}

/**
 * Loading fallback for React.lazy Suspense boundaries.
 * Matches the space theme with glass-morphism styling.
 */
export function PageLoader({ className, message = "Loading..." }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[60vh] gap-6",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Animated orbital loader */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-secondary/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner core */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/60 to-accent/40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orbiting dot */}
        <motion.div
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{ top: "50%", left: "50%", marginTop: -4, marginLeft: -4 }}
          animate={{
            x: [0, 24, 0, -24, 0],
            y: [-24, 0, 24, 0, -24],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Loading text */}
      <motion.p
        className="text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </div>
  );
}

/**
 * Minimal inline loader for component-level Suspense.
 */
export function InlineLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center p-8", className)}
      role="status"
      aria-label="Loading content"
    >
      <motion.div
        className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
