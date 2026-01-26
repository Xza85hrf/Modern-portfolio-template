import { Suspense, lazy, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Lazy load Spline to reduce initial bundle size
const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Check if WebGL is supported in the browser
 */
function isWebGLSupported(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Check if device is likely mobile/low-powered
 */
function isLowPowerDevice(): boolean {
  if (typeof window === "undefined") return true;

  // Check for mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Check for low memory (if available)
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory < 4;

  return isMobile || lowMemory;
}

/**
 * Default fallback component when Spline can't load
 */
function DefaultFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-64 h-64"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Animated geometric shapes as fallback */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-8 rounded-full border-2 border-accent/30"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute inset-16 rounded-full border-2 border-secondary/30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        {/* Center glow */}
        <div className="absolute inset-24 rounded-full bg-primary/20 blur-xl" />
      </motion.div>
    </div>
  );
}

/**
 * Loading spinner for Spline
 */
function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

/**
 * Lazy-loaded Spline 3D scene with performance safeguards
 */
export function SplineScene({
  scene,
  className = "",
  fallback,
}: SplineSceneProps) {
  const [canRender, setCanRender] = useState(false);
  const [hasError, setHasError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Check if we should render the 3D scene
    const webGLSupported = isWebGLSupported();
    const isLowPower = isLowPowerDevice();

    // Only render on capable devices with WebGL support
    setCanRender(webGLSupported && !isLowPower && !prefersReducedMotion);
  }, [prefersReducedMotion]);

  // Show fallback if can't render or has error
  if (!canRender || hasError) {
    return (
      <div className={className}>
        {fallback || <DefaultFallback />}
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense fallback={<SplineLoader />}>
        <Spline
          scene={scene}
          onError={() => setHasError(true)}
        />
      </Suspense>
    </div>
  );
}

export default SplineScene;
