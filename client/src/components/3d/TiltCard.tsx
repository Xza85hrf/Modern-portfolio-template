import {
  useRef,
  useState,
  useCallback,
  ReactNode,
  MouseEvent,
  CSSProperties,
} from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareEnabled?: boolean;
  scale?: number;
  perspective?: number;
  style?: CSSProperties;
}

/**
 * 3D Tilt Card component with mouse-follow effect
 * Creates an interactive 3D perspective transform based on mouse position
 */
export function TiltCard({
  children,
  className = "",
  tiltAmount = 15,
  glareEnabled = true,
  scale = 1.02,
  perspective = 1000,
  style,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Spring configuration for smooth movement
  const springConfig = { stiffness: 300, damping: 30 };

  // Motion values for rotation
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const glareX = useSpring(50, springConfig);
  const glareY = useSpring(50, springConfig);
  const scaleValue = useSpring(1, springConfig);

  // Transform glare position to opacity
  const glareOpacity = useTransform(
    [glareX, glareY],
    ([x, y]) => {
      // Calculate distance from center to determine glare intensity
      const distance = Math.sqrt(Math.pow(Number(x) - 50, 2) + Math.pow(Number(y) - 50, 2));
      return Math.min(0.3, distance / 100);
    }
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || prefersReducedMotion) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to card center (-1 to 1)
      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);

      // Apply rotation (inverted for natural feel)
      rotateX.set(-mouseY * tiltAmount);
      rotateY.set(mouseX * tiltAmount);

      // Update glare position (percentage from 0-100)
      glareX.set(50 + mouseX * 50);
      glareY.set(50 + mouseY * 50);
    },
    [rotateX, rotateY, glareX, glareY, tiltAmount, prefersReducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsHovering(true);
    scaleValue.set(scale);
  }, [scaleValue, scale, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
    scaleValue.set(1);
  }, [rotateX, rotateY, glareX, glareY, scaleValue]);

  // If reduced motion is preferred, render without effects
  if (prefersReducedMotion) {
    return (
      <div className={cn("relative", className)} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative", className)}
      style={{
        perspective,
        transformStyle: "preserve-3d",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full"
        style={{
          rotateX,
          rotateY,
          scale: scaleValue,
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {/* Glare effect overlay */}
        {glareEnabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden"
            style={{
              opacity: isHovering ? glareOpacity : 0,
              background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
              borderRadius: "inherit",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Simple float animation wrapper
 */
interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  y?: number;
  rotation?: number;
  delay?: number;
}

export function FloatingElement({
  children,
  className = "",
  duration = 6,
  y = 20,
  rotation = 2,
  delay = 0,
}: FloatingElementProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [-y / 2, y / 2, -y / 2],
        rotate: [-rotation, rotation, -rotation],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export default TiltCard;
