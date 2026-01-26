// HeroContent - Styled Links without nested Buttons (accessibility fix)
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { heroTextVariants, staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface HeroContentProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export function HeroContent({
  title = "Crafting Digital Experiences",
  subtitle = "Full-Stack Developer",
  description = "Building exceptional web applications with modern technologies. Turning ideas into elegant, functional solutions.",
}: HeroContentProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="relative z-10 max-w-3xl"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Badge */}
      <motion.div variants={staggerItemVariants} className="mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="gradient-text">{subtitle}</span>
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        variants={heroTextVariants}
      >
        <span className="block text-foreground">Crafting</span>
        <span className="block gradient-text">Digital</span>
        <span className="block text-foreground">Experiences</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl"
        variants={staggerItemVariants}
      >
        {description}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        variants={staggerItemVariants}
      >
        <motion.div
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        >
          <Link
            href="/portfolio"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <motion.span
                animate={
                  prefersReducedMotion
                    ? {}
                    : { x: [0, 4, 0] }
                }
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </span>
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </motion.div>

        <motion.div
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 px-8 glass border border-primary/30 hover:border-primary/50 hover:bg-primary/10 w-full sm:w-auto"
          >
            Get in Touch
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden md:flex items-center gap-2 mt-16 text-muted-foreground text-sm"
        variants={staggerItemVariants}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-2"
          animate={
            prefersReducedMotion
              ? {}
              : { opacity: [0.5, 1, 0.5] }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={
              prefersReducedMotion
                ? {}
                : { y: [0, 12, 0] }
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        <span>Scroll to explore</span>
      </motion.div>
    </motion.div>
  );
}

export default HeroContent;
