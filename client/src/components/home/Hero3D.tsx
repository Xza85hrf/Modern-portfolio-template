import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Abstract 3D-style hero decoration
 * Uses CSS transforms and gradients to create a 3D illusion
 * without the overhead of actual WebGL
 */
export function Hero3D() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main orb */}
      <motion.div
        className="absolute top-1/4 right-[10%] w-64 md:w-96 h-64 md:h-96"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: prefersReducedMotion ? 0 : [-10, 10, -10],
          rotate: prefersReducedMotion ? 0 : [0, 5, 0],
        }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 1 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 blur-3xl" />

        {/* Main sphere */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/40 via-transparent to-accent/30 backdrop-blur-sm border border-primary/20">
          {/* Inner highlight */}
          <div className="absolute top-4 left-4 w-1/3 h-1/3 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-sm" />
        </div>

        {/* Orbital ring 1 */}
        <motion.div
          className="absolute inset-0"
          animate={
            prefersReducedMotion
              ? {}
              : { rotate: 360 }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-primary/20 border-dashed" />
        </motion.div>

        {/* Orbital ring 2 */}
        <motion.div
          className="absolute inset-0"
          style={{ transform: "rotateX(60deg)" }}
          animate={
            prefersReducedMotion
              ? {}
              : { rotate: -360 }
          }
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute inset-4 rounded-full border border-accent/20" />
        </motion.div>
      </motion.div>

      {/* Secondary floating shapes */}
      <motion.div
        className="absolute top-[60%] right-[5%] w-20 h-20"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-secondary/40 to-secondary/10 backdrop-blur-sm border border-secondary/30 rotate-45" />
      </motion.div>

      <motion.div
        className="absolute top-[20%] right-[35%] w-12 h-12"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, 15, 0],
                x: [0, 10, 0],
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-accent/50 to-accent/10 backdrop-blur-sm border border-accent/30" />
      </motion.div>

      <motion.div
        className="absolute bottom-[30%] right-[25%] w-8 h-8"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary/20 rotate-45" />
      </motion.div>

      {/* Connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.1 }}
      >
        <motion.line
          x1="60%"
          y1="30%"
          x2="80%"
          y2="50%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.line
          x1="80%"
          y1="50%"
          x2="70%"
          y2="70%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(250, 90%, 65%)" />
            <stop offset="100%" stopColor="hsl(330, 80%, 60%)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(250 90% 65% / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(250 90% 65% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 70% 40%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 70% 40%, black 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

export default Hero3D;
