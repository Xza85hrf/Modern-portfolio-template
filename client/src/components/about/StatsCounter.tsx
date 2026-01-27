import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Languages, GraduationCap, Zap } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface StatsCounterProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  {
    label: "Years Experience",
    value: 4,
    suffix: "+",
    icon: Zap,
    color: "text-primary",
  },
  {
    label: "Languages Spoken",
    value: 3,
    suffix: "",
    icon: Languages,
    color: "text-secondary",
  },
  {
    label: "GitHub Projects",
    value: 15,
    suffix: "+",
    icon: Code2,
    color: "text-accent",
  },
  {
    label: "Degrees Earned",
    value: 2,
    suffix: "",
    icon: GraduationCap,
    color: "text-chart-4",
  },
];

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function CountUp({ end, duration = 2, suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Ease out quad
      const easeOut = 1 - Math.pow(1 - progress, 2);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isInView, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsCounter({ stats = defaultStats }: StatsCounterProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: index * 0.1,
          }}
        >
          <GlassCard
            variant="bordered"
            hover
            className="p-6 text-center h-full"
          >
            <motion.div
              className={cn(
                "w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center",
                "bg-gradient-to-br from-card to-muted/50"
              )}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 1.1,
                      rotate: [0, -10, 10, 0],
                    }
              }
              transition={{ duration: 0.3 }}
            >
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </motion.div>
            <div className={cn("text-3xl md:text-4xl font-bold mb-2", stat.color)}>
              <CountUp end={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Inline stats for compact display
 */
export function StatsInline({ stats = defaultStats }: StatsCounterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <div className={cn("text-2xl md:text-3xl font-bold", stat.color)}>
            <CountUp end={stat.value} suffix={stat.suffix} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsCounter;
