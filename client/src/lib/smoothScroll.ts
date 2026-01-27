import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal" | "both";
  smoothWheel?: boolean;
  touchMultiplier?: number;
  wheelMultiplier?: number;
  infinite?: boolean;
}

/**
 * Default smooth easing function
 */
const defaultEasing = (t: number): number => {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
};

/**
 * Initialize Lenis smooth scrolling
 */
export function initSmoothScroll(options: SmoothScrollOptions = {}): Lenis {
  // Clean up existing instance
  if (lenisInstance) {
    lenisInstance.destroy();
  }

  const {
    duration = 1.2,
    easing = defaultEasing,
    orientation = "vertical",
    gestureOrientation = "vertical",
    smoothWheel = true,
    touchMultiplier = 2,
    wheelMultiplier = 1,
    infinite = false,
  } = options;

  lenisInstance = new Lenis({
    duration,
    easing,
    orientation,
    gestureOrientation,
    smoothWheel,
    touchMultiplier,
    wheelMultiplier,
    infinite,
  });

  // Integrate with GSAP ScrollTrigger
  lenisInstance.on("scroll", ScrollTrigger.update);

  // Add Lenis to GSAP ticker for frame-perfect scrolling
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

/**
 * Get the current Lenis instance
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Scroll to a specific target (element or position)
 */
export function scrollTo(
  target: string | number | HTMLElement,
  options: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
    lock?: boolean;
    onComplete?: () => void;
  } = {}
): void {
  if (!lenisInstance) {
    console.warn("Lenis not initialized. Call initSmoothScroll first.");
    return;
  }

  lenisInstance.scrollTo(target, options);
}

/**
 * Stop smooth scrolling
 */
export function stopScroll(): void {
  lenisInstance?.stop();
}

/**
 * Start smooth scrolling
 */
export function startScroll(): void {
  lenisInstance?.start();
}

/**
 * Destroy Lenis instance
 */
export function destroySmoothScroll(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/**
 * Check if smooth scrolling is supported and user doesn't prefer reduced motion
 */
export function shouldEnableSmoothScroll(): boolean {
  // Check for reduced motion preference
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return false;
    }
  }

  // Check for touch devices (smooth scroll can be jarring on touch)
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Enable on non-touch devices
  return !isTouchDevice;
}

/**
 * Initialize smooth scroll with smart defaults based on device/preferences
 */
export function initSmartSmoothScroll(): Lenis | null {
  if (!shouldEnableSmoothScroll()) {
    console.log("Smooth scroll disabled due to user preferences or device type");
    return null;
  }

  return initSmoothScroll({
    duration: 1.2,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    smoothWheel: true,
  });
}
