import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId}
          className={cn(
            "peer w-full px-4 pt-6 pb-2 rounded-lg transition-all duration-300",
            "bg-muted/30 border-2 border-transparent",
            "focus:border-primary focus:bg-muted/50 focus:outline-none",
            "placeholder-transparent",
            error && "border-destructive focus:border-destructive",
            className
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            "text-muted-foreground",
            isFocused || hasValue
              ? "top-2 text-xs text-primary"
              : "top-1/2 -translate-y-1/2 text-base"
          )}
        >
          {label}
        </label>
        {/* Focus glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={false}
          animate={{
            boxShadow: isFocused
              ? "0 0 0 4px hsl(var(--primary) / 0.1)"
              : "0 0 0 0px transparent",
          }}
          transition={{ duration: 0.2 }}
        />
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              aria-live="polite"
              className="text-xs text-destructive mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

interface FloatingTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId}
          className={cn(
            "peer w-full px-4 pt-6 pb-2 rounded-lg transition-all duration-300 min-h-[150px] resize-none",
            "bg-muted/30 border-2 border-transparent",
            "focus:border-primary focus:bg-muted/50 focus:outline-none",
            "placeholder-transparent",
            error && "border-destructive focus:border-destructive",
            className
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            "text-muted-foreground",
            isFocused || hasValue
              ? "top-2 text-xs text-primary"
              : "top-4 text-base"
          )}
        >
          {label}
        </label>
        {/* Focus glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={false}
          animate={{
            boxShadow: isFocused
              ? "0 0 0 4px hsl(var(--primary) / 0.1)"
              : "0 0 0 0px transparent",
          }}
          transition={{ duration: 0.2 }}
        />
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              aria-live="polite"
              className="text-xs text-destructive mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";

export default FloatingInput;
