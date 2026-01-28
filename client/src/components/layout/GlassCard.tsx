import { forwardRef, HTMLAttributes } from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHoverVariants } from "@/lib/animations";

export interface GlassCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  children?: React.ReactNode;
  variant?: "default" | "elevated" | "bordered" | "gradient";
  hover?: boolean;
  glow?: boolean;
  as?: "div" | "article" | "section";
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = "default",
      hover = true,
      glow = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-xl backdrop-blur-md border transition-all duration-300";

    const variants = {
      default: "bg-card/50 border-border/50",
      elevated: "bg-card/70 border-border/40 shadow-lg shadow-primary/5",
      bordered: "bg-card/30 border-primary/20",
      gradient:
        "bg-gradient-to-br from-card/60 via-card/40 to-card/60 border-border/30",
    };

    const glowStyles = glow
      ? "shadow-lg shadow-primary/20 hover:shadow-primary/30"
      : "";

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], glowStyles, className)}
        variants={hover ? cardHoverVariants : undefined}
        initial="rest"
        whileHover={hover ? "hover" : undefined}
        whileTap={hover ? "tap" : undefined}
        onClick={onClick}
        {...(props as MotionProps)}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };

// Simple glass container without hover effects
export interface GlassContainerProps extends HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
}

export const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ className, blur = "md", opacity = 50, children, ...props }, ref) => {
    const blurSizes = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border/30 transition-all duration-300",
          blurSizes[blur],
          className
        )}
        style={{
          backgroundColor: `hsl(var(--card) / ${opacity / 100})`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassContainer.displayName = "GlassContainer";
