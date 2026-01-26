import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Rocket } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: "work" | "education" | "achievement" | "milestone";
}

interface JourneyTimelineProps {
  events?: TimelineEvent[];
}

// Default timeline events
const defaultEvents: TimelineEvent[] = [
  {
    year: "2024",
    title: "Senior Developer",
    description: "Leading development of enterprise applications and mentoring junior developers.",
    type: "work",
  },
  {
    year: "2022",
    title: "Full Stack Developer",
    description: "Built scalable web applications using React, Node.js, and PostgreSQL.",
    type: "work",
  },
  {
    year: "2020",
    title: "Started Professional Journey",
    description: "Began working as a junior developer, focusing on frontend technologies.",
    type: "milestone",
  },
  {
    year: "2019",
    title: "Computer Science Degree",
    description: "Graduated with honors, specializing in software engineering.",
    type: "education",
  },
];

const iconMap = {
  work: Briefcase,
  education: GraduationCap,
  achievement: Award,
  milestone: Rocket,
};

const colorMap = {
  work: "bg-primary/20 text-primary border-primary/30",
  education: "bg-secondary/20 text-secondary border-secondary/30",
  achievement: "bg-accent/20 text-accent border-accent/30",
  milestone: "bg-chart-4/20 text-chart-4 border-chart-4/30",
};

export function JourneyTimeline({ events = defaultEvents }: JourneyTimelineProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-secondary opacity-30" />

      <div className="space-y-12">
        {events.map((event, index) => {
          const Icon = iconMap[event.type];
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={`${event.year}-${event.title}`}
              className={cn(
                "relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8",
                isLeft ? "md:text-right" : "md:text-left"
              )}
              initial={{
                opacity: 0,
                x: prefersReducedMotion ? 0 : isLeft ? -50 : 50,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                delay: index * 0.1,
              }}
            >
              {/* Content - Order changes based on side */}
              <div
                className={cn(
                  "md:contents",
                  !isLeft && "md:col-start-2"
                )}
              >
                {/* Left side content or spacer */}
                <div className={cn("pl-16 md:pl-0", isLeft ? "order-1" : "order-2 md:order-1")}>
                  {isLeft ? (
                    <GlassCard
                      variant="bordered"
                      hover
                      className="p-6 h-full"
                    >
                      <span className="text-sm text-muted-foreground mb-2 block">
                        {event.year}
                      </span>
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {event.description}
                      </p>
                    </GlassCard>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                </div>

                {/* Right side content or spacer */}
                <div className={cn("pl-16 md:pl-0", isLeft ? "order-2 hidden md:block" : "order-1 md:order-2")}>
                  {!isLeft ? (
                    <GlassCard
                      variant="bordered"
                      hover
                      className="p-6 h-full"
                    >
                      <span className="text-sm text-muted-foreground mb-2 block">
                        {event.year}
                      </span>
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {event.description}
                      </p>
                    </GlassCard>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                </div>
              </div>

              {/* Center icon */}
              <motion.div
                className={cn(
                  "absolute left-0 md:left-1/2 top-6 -translate-x-0 md:-translate-x-1/2",
                  "w-12 h-12 rounded-full flex items-center justify-center border-2",
                  colorMap[event.type]
                )}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1 + 0.2,
                }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* End decoration */}
      <motion.div
        className="absolute left-6 md:left-1/2 bottom-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: events.length * 0.1 + 0.3 }}
      />
    </div>
  );
}

export default JourneyTimeline;
