import { motion } from "framer-motion";
import { Code2, GraduationCap, Users, Rocket, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: "leadership" | "development" | "education" | "milestone";
}

interface JourneyTimelineProps {
  events?: TimelineEvent[];
}

// Default timeline events - Ravindu's career journey
const defaultEvents: TimelineEvent[] = [
  {
    year: "Oct 2025",
    title: "IT Support Specialist @ DROGRÓD",
    description: "Independent management of company IT infrastructure, network administration, and website maintenance. Technical consulting on IT solutions supporting business operations.",
    type: "leadership",
  },
  {
    year: "July 2024",
    title: "IT Support Specialist @ Akord",
    description: "Technical support for office staff, workstation configuration, root cause analysis, and implementation of office process automation solutions.",
    type: "development",
  },
  {
    year: "2024-2025",
    title: "Master's Degree in Computer Science",
    description: "WSB Merito Chorzów - Python Developer specialization. Thesis: Visual AI Research Platform for comparing AI models with visual capabilities.",
    type: "education",
  },
  {
    year: "2020-2024",
    title: "Bachelor of Engineering",
    description: "Silesian University of Technology - Mobile and Industrial IT Systems. Thesis: Application for Querying Databases Using the QBE Language.",
    type: "education",
  },
  {
    year: "Sept 2018",
    title: "Freelance Software Engineer",
    description: "Development of IT tools, Python scripting for automation, GUI applications, monitoring dashboards, Docker environments, and AI/ML projects.",
    type: "development",
  },
  {
    year: "2016-2018",
    title: "Freelance Translator & Interpreter",
    description: "Professional translations in Polish, English, and Sinhala. Language support for business meetings, developing communication skills applied in IT support roles.",
    type: "milestone",
  },
];

const iconMap = {
  leadership: Users,
  development: Code2,
  education: GraduationCap,
  milestone: Rocket,
};

const gradientMap = {
  leadership: "from-primary to-primary/50",
  development: "from-accent to-accent/50",
  education: "from-secondary to-secondary/50",
  milestone: "from-chart-4 to-chart-4/50",
};

const glowMap = {
  leadership: "shadow-primary/50",
  development: "shadow-accent/50",
  education: "shadow-secondary/50",
  milestone: "shadow-chart-4/50",
};

export function JourneyTimeline({ events = defaultEvents }: JourneyTimelineProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Animated gradient line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-px">
        <motion.div
          className="h-full w-full bg-gradient-to-b from-primary via-accent to-secondary"
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
        />
      </div>

      <div className="space-y-16">
        {events.map((event, index) => {
          const Icon = iconMap[event.type];
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={`${event.year}-${event.title}`}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                delay: index * 0.15,
              }}
            >
              {/* Icon node */}
              <motion.div
                className={cn(
                  "absolute left-8 md:left-1/2 top-0 -translate-x-1/2 z-20",
                  "w-14 h-14 rounded-full",
                  "bg-gradient-to-br",
                  gradientMap[event.type],
                  "flex items-center justify-center",
                  "shadow-lg",
                  glowMap[event.type],
                  "border-4 border-background"
                )}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.15 + 0.2,
                }}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : { scale: 1.1 }
                }
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Content wrapper */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mobile: always show card on right of icon */}
                <div className="md:hidden pl-20 pr-4">
                  <TimelineCard event={event} prefersReducedMotion={prefersReducedMotion} />
                </div>

                {/* Desktop: alternating layout */}
                {/* Left column */}
                <div className={cn(
                  "hidden md:block",
                  isLeft ? "pr-16 text-right" : ""
                )}>
                  {isLeft && (
                    <TimelineCard
                      event={event}
                      align="right"
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  )}
                </div>

                {/* Right column */}
                <div className={cn(
                  "hidden md:block",
                  !isLeft ? "pl-16" : ""
                )}>
                  {!isLeft && (
                    <TimelineCard
                      event={event}
                      align="left"
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* End node */}
      <motion.div
        className="absolute left-8 md:left-1/2 -bottom-4 -translate-x-1/2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: events.length * 0.15 + 0.3 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-background" />
        </div>
      </motion.div>
    </div>
  );
}

interface TimelineCardProps {
  event: TimelineEvent;
  align?: "left" | "right";
  prefersReducedMotion: boolean;
}

function TimelineCard({ event, align = "left", prefersReducedMotion }: TimelineCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative p-6 rounded-2xl",
        "bg-card/50 backdrop-blur-sm",
        "border border-border/50",
        "hover:border-primary/30 transition-colors duration-300",
        "overflow-hidden"
      )}
      whileHover={
        prefersReducedMotion
          ? {}
          : { y: -5, transition: { duration: 0.2 } }
      }
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Decorative corner accent */}
      <div className={cn(
        "absolute top-0 w-20 h-20 opacity-20",
        align === "right" ? "right-0" : "left-0"
      )}>
        <div className={cn(
          "absolute w-full h-full bg-gradient-to-br from-primary/30 to-transparent",
          align === "right" ? "rounded-bl-full" : "rounded-br-full"
        )} />
      </div>

      <div className={cn("relative z-10", align === "right" && "md:text-right")}>
        {/* Year badge */}
        <motion.span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3",
            "bg-primary/10 text-primary border border-primary/20"
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Calendar className="w-3 h-3" />
          {event.year}
        </motion.span>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {event.description}
        </p>

        {/* Bottom accent line */}
        <motion.div
          className={cn(
            "absolute bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent",
            align === "right" ? "right-0" : "left-0"
          )}
          initial={{ width: 0 }}
          whileInView={{ width: "30%" }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

export default JourneyTimeline;
