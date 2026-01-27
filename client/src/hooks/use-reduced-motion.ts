import { useState, useEffect } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if the user has enabled reduced motion in their OS settings
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") return false;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    return mediaQuery.matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get animation duration based on reduced motion preference
 * Returns 0 if reduced motion is preferred, otherwise returns the provided duration
 */
export function useAnimationDuration(duration: number): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 0 : duration;
}

/**
 * Hook to get animation variants based on reduced motion preference
 * Returns static variants if reduced motion is preferred
 */
export function useMotionSafeVariants<T extends Record<string, unknown>>(
  variants: T,
  staticVariant: keyof T
): T {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    // Return variants where all states are the static variant
    const staticValue = variants[staticVariant];
    return Object.keys(variants).reduce((acc, key) => {
      acc[key as keyof T] = staticValue as T[keyof T];
      return acc;
    }, {} as T);
  }

  return variants;
}
