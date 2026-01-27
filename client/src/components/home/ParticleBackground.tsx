import { useCallback, useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
}

/**
 * Star field particle background
 * Uses tsparticles for performant particle rendering
 */
export function ParticleBackground({
  className = "",
  particleCount,
}: ParticleBackgroundProps) {
  const [init, setInit] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Initialize tsparticles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Particles loaded callback - can be used for debugging
  }, []);

  // Memoize particle count calculation (only depends on particleCount prop)
  const calculatedParticleCount = useMemo(() => {
    if (particleCount) return particleCount;
    // Check if mobile - only calculated once on mount
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return 30; // Fewer particles on mobile
    }
    return 80; // More particles on desktop
  }, [particleCount]);

  // Memoize options object to prevent unnecessary re-renders
  const options: ISourceOptions = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.3,
            color: "#8b5cf6", // Primary purple
          },
        },
      },
    },
    particles: {
      color: {
        value: ["#8b5cf6", "#ec4899", "#14b8a6"], // Primary, accent, secondary
      },
      links: {
        color: "#8b5cf6",
        distance: 150,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: calculatedParticleCount,
      },
      opacity: {
        value: { min: 0.1, max: 0.6 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 2,
          sync: false,
        },
      },
    },
    detectRetina: true,
  }), [calculatedParticleCount]);

  // Don't render particles if reduced motion is preferred
  if (prefersReducedMotion || !init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      className={className}
      particlesLoaded={particlesLoaded}
      options={options}
    />
  );
}

/**
 * Simpler star background using CSS for better performance
 * Use this as a lighter alternative to particle system
 */
export function StarBackground({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Static stars layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, rgba(139, 92, 246, 0.6), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(139, 92, 246, 0.4), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(236, 72, 153, 0.5), transparent),
            radial-gradient(2px 2px at 130px 80px, rgba(20, 184, 166, 0.4), transparent),
            radial-gradient(1px 1px at 160px 120px, rgba(139, 92, 246, 0.3), transparent)
          `,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Animated stars layer */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            animationDuration: "4s",
            backgroundImage: `
              radial-gradient(1px 1px at 50px 50px, rgba(255, 255, 255, 0.4), transparent),
              radial-gradient(1px 1px at 100px 150px, rgba(255, 255, 255, 0.3), transparent),
              radial-gradient(1px 1px at 200px 100px, rgba(255, 255, 255, 0.5), transparent)
            `,
            backgroundSize: "250px 250px",
          }}
        />
      )}

      {/* Nebula glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
    </div>
  );
}

export default ParticleBackground;
