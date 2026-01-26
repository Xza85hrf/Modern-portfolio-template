import { ReactNode } from "react";
import { motion } from "framer-motion";
import { pageVariants, smoothTransition } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component for page transitions
 * Provides consistent enter/exit animations for all pages
 */
export function AnimatedPage({ children, className = "" }: AnimatedPageProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={smoothTransition}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section wrapper with scroll-triggered fade-in animation
 */
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.section>
  );
}

/**
 * Stagger container for animating multiple children
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  initialDelay = 0.1,
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger item (use inside StaggerContainer)
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
